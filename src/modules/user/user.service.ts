import bcrypt from "bcryptjs";
import { ObjectId } from "mongoose";

import BaseService from "@/utils/base/service";
import { User } from "@/utils/db";
import { validateFunc } from "@/utils/validations";

import * as validateUser from "./user.validate";
import { IUserDocumentModel } from "./user.interface";

export default class UserService extends BaseService<IUserDocumentModel> {
  constructor() {
    super(User);
  }

  async create(user: IUserDocumentModel) {
    const error = validateFunc(validateUser.full, user);

    if (error) {
      throw new Error(error);
    }

    if (user.password) {
      user.password = await bcrypt.hash(user.password, 10);
    }

    return super.create(user);
  }

  async resetPassword(id: ObjectId, password: string) {
    password = await bcrypt.hash(password, 10);
    return this.updateById(id, { password });
  }
}
