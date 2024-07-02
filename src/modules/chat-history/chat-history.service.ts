// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { ChatHistory } from "@/utils/db";

// need add types
import { IChatHistoryModel } from "./chat-history.interface";

export class ChatHistoryService extends BaseService<IChatHistoryModel> {
  constructor() {
    super(ChatHistory);
  }
};