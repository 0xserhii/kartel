// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { ChatHistory } from "@/utils/db";

// need add types
import { IChatHistoryModel } from "./chat-history.interface";
import { IChatEmitHistory } from "./chat-history.types";
import logger from "@/utils/logger";

export class ChatHistoryService extends BaseService<IChatHistoryModel> {
  constructor() {
    super(ChatHistory);
  }

  fetchEarlierChatHistories = async (date: Date, limit: number): Promise<IChatEmitHistory[] | []> => {
    try {
      const chatHistories = await this.aggregateByPipeline([
        { $match: { sentAt: { $lt: date } } },
        { $sort: { sentAt: -1 } },
        { $limit: limit },
        {
          $lookup: {
            from: 'users',
            localField: 'user',
            foreignField: '_id',
            as: 'user'
          }
        },
        { $unwind: '$user' },
        {
          $project: {
            'user._id': 1,
            'user.username': 1,
            'user.avatar': 1,
            'user.hasVerifiedAccount': 1,
            'user.createdAt': 1,
            sentAt: 1,
            message: 1,
          }
        }
      ]);
      chatHistories.sort((a: any, b: any) => a.sentAt.getTime() - b.sentAt.getTime());
      if (chatHistories.length == 0) {
        return []
      }
      return chatHistories as IChatEmitHistory[]
    } catch (ex) {
      logger.error("Error finding chat histories that sent earlier than ${date}: ${(ex as Error).message}")
      return []
    }
  }
}
