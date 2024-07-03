import bcrypt from "bcryptjs";
import jwt, { UserJwtPayload } from "jsonwebtoken";

import { REFRESH_TOKEN_SECRET } from "@/config";
import { IUserModel } from "@/modules/user/user.interface";
import UserService from "@/modules/user/user.service";
import { CustomError } from "@/utils/helpers";
import * as localizations from "@/utils/localizations";
import ILocalization from "@/utils/localizations/localizations.interface";

import { ROLE } from "../user/user.constant";
import AuthService from "./auth.service";
import { IAuthModel } from "./auth.types";

export default class AuthController {
  private service: AuthService;
  private userService: UserService;
  private localizations: ILocalization;

  private passwordRegExp = new RegExp(
    /(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!@#$%^&*]{6,}/g
  );

  constructor() {
    this.service = new AuthService();
    this.userService = new UserService();

    this.localizations = localizations["en"];
  }

  // email signUp
  signUp = async (data: Partial<IUserModel> & { email: string }) => {
    try {
      const user = await this.userService.getItem({
        userEmail: data.email.toLowerCase(),
      });

      if (user) {
        throw new CustomError(
          409,
          this.localizations.ERRORS.USER.USER_ALREADY_EXIST
        );
      }

      let newUser: Partial<IUserModel>;

      try {
        data.userEmail = data.email.toLowerCase();
        data.wallet = new Map<string, number>([
          ["usk", 1000],
          ["kart", 1000],
        ]);

        if (data.password) {
          data.password = await bcrypt.hash(data.password, 10);
        }

        data.role = ROLE.MEMBER;
        newUser = await this.userService.updateOrInsert(
          { userEmail: data.userEmail },
          data
        );
      } catch (error) {
        console.log(error);

        if (error.code == 11000) {
          throw new CustomError(
            409,
            this.localizations.ERRORS.USER.USER_ALREADY_EXIST
          );
        }

        throw new Error(this.localizations.ERRORS.USER.USER_NOT_CREATED);
      }

      const authParams = this.service.generate({
        userId: newUser._id,
        role: newUser.role,
        status: newUser.status,
      });

      await this.service.updateOrInsert({ userId: newUser._id }, {
        userId: newUser._id,
        refreshToken: authParams.refreshToken,
      } as IAuthModel);

      // @ts-ignore
      delete newUser.password;
      return {
        status: 201,
        payload: {
          auth: authParams,
          user: newUser,
        },
      };
    } catch (error) {
      if (error.code === 11000) {
        throw new CustomError(409, this.localizations.ERRORS.OTHER.CONFLICT);
      }

      throw new Error(this.localizations.ERRORS.OTHER.SOMETHING_WENT_WRONG);
    }
  };

  // email signIn
  signIn = async ({ email, password }) => {
    const userEmail = email.toLowerCase();

    const foundUser = await this.userService.getItem({ userEmail });

    if (!foundUser) {
      throw new Error(this.localizations.ERRORS.USER.EMAIL_OR_PASSWORD_INVALID);
    }

    const { password: userPassword } = foundUser;
    const invalid: boolean = await bcrypt.compare(password, userPassword);

    if (!invalid) {
      throw new Error(this.localizations.ERRORS.USER.EMAIL_OR_PASSWORD_INVALID);
    }

    const auth = await this.setAuth(foundUser);
    let paymentInformation;
    delete foundUser.password;
    return {
      status: 200,
      payload: {
        auth,
        user: foundUser,
        paymentInformation,
      },
    };
  };

  // update token
  updateToken = async (
    { deviceId, platform },
    refreshToken: { refreshToken: string }
  ) => {
    const authParams = await this.service.getItem(refreshToken, {
      _id: 0,
      userId: 1,
      deviceId: 1,
      platform: 1,
    });

    if (!authParams) {
      throw new CustomError(
        404,
        this.localizations.ERRORS.OTHER.REFRESH_TOKEN_INVALID
      );
    }

    const decodeToken = <UserJwtPayload>(
      jwt.verify(refreshToken.refreshToken, REFRESH_TOKEN_SECRET)
    );

    if (deviceId !== decodeToken?.deviceId) {
      throw new CustomError(403, this.localizations.ERRORS.OTHER.FORBIDDEN);
    }

    const user = await this.userService.getItemById(authParams.userId, {
      password: 0,
    });

    const newAuthParams = this.service.generate({
      userId: user._id,
      role: user.role,
      status: user.status,
      deviceId: deviceId,
      platform: platform,
    });

    await this.service.create({
      deviceId: deviceId,
      platform: platform,
      userId: user._id,
      refreshToken: authParams.refreshToken,
    } as IAuthModel);

    return {
      status: 201,
      payload: {
        auth: newAuthParams,
        user,
      },
    };
  };

  logout = async ({ deviceId }, info) => {
    if (deviceId !== info.deviceId) {
      throw new CustomError(401, this.localizations.ERRORS.OTHER.UNAUTHORIZED);
    }

    await this.service.delete({
      deviceId,
      userId: info.userId,
      platform: info.platform,
    });

    return { message: "Success" };
  };

  setAuth = async (user: IUserModel) => {
    const auth = this.service.generate({
      userId: user._id,
      role: user.role,
      status: user.status,
    });
    await this.service.updateOrCreate(
      {
        userId: user._id,
      },
      auth.refreshToken
    );

    return auth;
  };
}
