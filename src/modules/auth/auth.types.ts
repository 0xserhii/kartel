import { Document, ObjectId } from "mongoose";

import { ROLE, STATUS } from "@/modules/user/user.constant";

import { PLATFORM } from "./auth.constant";

export interface IAuthInfo {
  deviceId?: string;
  platform?: PLATFORM;
  role: ROLE;
  status: STATUS;
  userId: ObjectId;
}

export interface IUpdateOrCreate {
  userId: ObjectId;
}

export interface IGenerateParams {
  deviceId?: string;
  platform?: PLATFORM;
  role: ROLE;
  status: STATUS;
  userId: ObjectId;
}

export interface IAuthModel extends Document {
  userId: ObjectId;
  deviceId: string;
  platform: PLATFORM;
  refreshToken?: string;
}
