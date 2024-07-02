// need add model to mongo index file
import BaseService from "@/utils/base/service";
import { RaceEntry } from "@/utils/db";

// need add types
import { IRaceEntry } from "./race-entry.interface";

export class RaceEntryService extends BaseService<IRaceEntry> {
  constructor() {
    super(RaceEntry);
  }
}
