import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  BlockObjectResponse,
  ChildDatabaseBlockObjectResponse,
  Heading1BlockObjectResponse,
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { flattenDeep } from "lodash";

import { NotionService } from "../notion/notion.service";

import { WorkingDay } from "src/class/workingDay";
import {
  COMMUNICATION_CHANNELS,
  CREATED_TIME,
  PAGES,
  PROJECT_STATUS,
  READY_TO_SEND,
  SENT_TO_CLIENT,
  WIP,
  WORKING_DAYS,
} from "src/const/const.notion";
import {
  RelationObjectResponse,
  SelectObjectResponse,
  StatusObjectResponse,
} from "src/types/notion.type";

// This service gets all working days and send an email of daily recap to the client
@Injectable()
export class ReviewService {
  constructor(
    private readonly configService: ConfigService,
    private readonly notionService: NotionService
  ) {}

  async getNotSentWorkingDays() {
    // 1. Get "Suivi Clients" Notion DB
    const database_id = this.configService.get<string>("notion.databaseID");
    if (!database_id) throw new Error("No database ID found in config file");

    const database: PageObjectResponse[] = await this.notionService.getDatabase(database_id);

    // 2. Filter clients Coton is actually working with
    const currentClientsPageList: PageObjectResponse[] = database.filter(
      (data: PageObjectResponse) => {
        const projectStatus = data.properties[PROJECT_STATUS] as SelectObjectResponse;
        const select = projectStatus.select;

        return (
          select.name === WIP &&
          //TODO: url filter is only for dev mode
          data.url === "https://www.notion.so/Coton-3ad619fe6bec41ca8106e736ec666a43"
        );
      }
    );

    // Get ID for each page
    const pagesIDList: string[] = currentClientsPageList.map((page) => page.id);
    const rawCurrentClientsBlocks = await this.notionService.getManyBlock<BlockObjectResponse>(
      pagesIDList
    );

    const currentClientBlocks = rawCurrentClientsBlocks.flat();

    // 3. Get everything inside "Pages" dropdown menu
    // Get all blocks having a heading
    const headingBlocks: BlockObjectResponse[] = currentClientBlocks.filter(
      (block: Heading1BlockObjectResponse) => block.heading_1
    );

    // Filter all blocks having "Pages" as heading name
    const blockWithPagesH1 = headingBlocks.filter((block: Heading1BlockObjectResponse) => {
      const richText = block.heading_1.rich_text[0] as TextRichTextItemResponse;
      return richText.text.content === PAGES;
    });

    // Getting ID's
    const pagesBlockIDList: string[] = blockWithPagesH1
      .map((pb) => pb.id)
      .filter((e) => !!e.length);

    // Finding pages by I
    const pages = await this.notionService.getManyBlock<ChildDatabaseBlockObjectResponse>(
      pagesBlockIDList
    );
    const flattenedPages = pages.flat();

    // 4. Get "Working Days" calendar block
    // Filter every page having a child_database
    const pagesWithChildDatabase: ChildDatabaseBlockObjectResponse[] = flattenedPages.filter(
      (p) => p.child_database
    );
    const pagesWithWorkingDays = pagesWithChildDatabase.filter(
      (page: ChildDatabaseBlockObjectResponse) => page.child_database.title === WORKING_DAYS
    );
    const pagesWithWorkingDaysID = pagesWithWorkingDays.map((p) => p.id);

    // Get Working Days Databases
    const filter = {
      timestamp: CREATED_TIME,
      created_time: { past_week: {} },
    };
    const workingDaysDatabases: PageObjectResponse[][] = await this.notionService.getManyDatabase(
      pagesWithWorkingDaysID,
      filter
    );

    // Filter by "Ready To Send"
    const readyToSendWorkingDays: PageObjectResponse[] = workingDaysDatabases
      .map((e) =>
        e.filter((workingDay) => {
          const status = workingDay.properties[SENT_TO_CLIENT] as StatusObjectResponse;

          return status?.status.name === READY_TO_SEND;
        })
      )
      .flat();

    // Get ...
    const workingDaysToPromise: WorkingDay[] = readyToSendWorkingDays.map(
      (workingDay: PageObjectResponse): WorkingDay => {
        const communicationChannel = workingDay.properties[
          COMMUNICATION_CHANNELS
        ] as RelationObjectResponse;
        const communicationID = communicationChannel.relation[0]?.id;
        if (!communicationID) return;

        const wd: WorkingDay = new WorkingDay(workingDay);

        const contentPromise = this.notionService.getBlock<BlockObjectResponse>(workingDay.id);
        const communicationChannelsPromise = this.notionService.getPage(communicationID);

        void wd.setContentPromise(contentPromise);
        void wd.setCommunicationChannelsPromise(communicationChannelsPromise);

        return wd;
      }
    );

    const flattenedWorkingDaysToPromise: WorkingDay[] = flattenDeep(
      workingDaysToPromise
    ) as WorkingDay[];

    const workingsCompleted: WorkingDay[] = await Promise.all(
      flattenedWorkingDaysToPromise.filter((e) => e).map((wd) => wd.computeContentPromise())
    );

    return workingsCompleted;
  }
}
