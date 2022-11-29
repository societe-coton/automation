import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import {
  BlockObjectResponse,
  ChildDatabaseBlockObjectResponse,
  Heading1BlockObjectResponse,
  PageObjectResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { NotionService } from "../notion/notion.service";

import {
  COMMUNICATION_CHANNELS,
  PAGES,
  PROJECT_STATUS,
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
    // 1. Get all Notion DB
    const database_id = this.configService.get<string>("notion.databaseID");
    if (!database_id) throw new Error("No database ID found in config file");

    const databases: PageObjectResponse[] = await this.notionService.getDatabase(database_id);

    // 2. Filter clients Coton is actually working with
    const currentClientsPages: PageObjectResponse[] = databases.filter(
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
    const pagesID: string[] = currentClientsPages.map((page) => page.id);
    const currentClientsBlocks: BlockObjectResponse[][] = await this.notionService.getManyBlock(
      pagesID
    );
    const flattenedBlocks = currentClientsBlocks.flatMap((e) => e);

    // 3. Get everything inside "Pages" dropdown menu
    // Get all blocks having a heading
    const headingBlocks: BlockObjectResponse[] = flattenedBlocks.filter(
      (block: Heading1BlockObjectResponse) => block.heading_1
    );

    // Filter all blocks having "Pages" as heading name
    const pagesBlock = headingBlocks.filter((block: Heading1BlockObjectResponse) => {
      const richText = block.heading_1.rich_text[0] as TextRichTextItemResponse;
      return richText.text.content === PAGES;
    });

    // Getting ID's
    const pagesBlockID: string[] = pagesBlock.map((pb) => pb.id).filter((e) => !!e.length);

    // Finding pages by I
    const pages = await this.notionService.getManyBlock<ChildDatabaseBlockObjectResponse>(
      pagesBlockID
    );
    const flattenedPages = pages.flatMap((e) => e);

    // 4. Get "Working Days" calendar block
    // Filter every page having a child_database
    const pagesWithChildDatabase: ChildDatabaseBlockObjectResponse[] = flattenedPages.filter(
      (p) => p.child_database
    );
    const pagesWithWorkingDays = pagesWithChildDatabase.filter(
      (page: ChildDatabaseBlockObjectResponse) => page.child_database.title === WORKING_DAYS
    );
    const pagesWithWorkingDaysID = pagesWithWorkingDays.map((p) => p.id);

    // Get Working Days
    const filter = {
      timestamp: "created_time",
      created_time: { past_week: {} },
    };
    const workingDaysPages: PageObjectResponse[][] = await this.notionService.getManyDatabase(
      pagesWithWorkingDaysID,
      filter
    );

    const notSentWorkingDays: PageObjectResponse[][] = workingDaysPages.map((e) =>
      e.filter((workingDay) => {
        const status = workingDay.properties[SENT_TO_CLIENT] as StatusObjectResponse;

        return status?.status.name === "Not Sent";
      })
    );

    const workingDaysWithCommunicationChannels = await Promise.all(
      notSentWorkingDays.map((workingDay) =>
        Promise.all(
          workingDay.map(async (wd) => {
            const communicationChannel = wd.properties[
              COMMUNICATION_CHANNELS
            ] as RelationObjectResponse;

            const communicationID = communicationChannel.relation[0]?.id;
            if (!communicationID) return;

            return {
              content: await this.notionService.getBlock(wd.id),
              communicationChannels: await this.notionService.getPage(communicationID),
            };
          })
        )
      )
    );

    return workingDaysWithCommunicationChannels;

    // const workingDaysBlocks: BlockObjectResponse[][] = await Promise.all(
    //   workingDaysID.map((block_id) =>
    //     this.notion.blocks.children
    //       .list({ block_id })
    //       .then((result) => result.results as BlockObjectResponse[])
    //   )
    // );

    // return workingDaysBlocks;
  }
}
