// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { ChatHistory } from "@/utils/db";

// need add types
import { IChatHistoryDocument } from "./chat-history.interface";

export class ChatHistoryService extends BaseService<IChatHistoryDocument> {
  constructor() {
    super(ChatHistory);
  }
};