import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Client, NotionErrorCode } from "@notionhq/client";
import {
  BlockObjectResponse,
  ChildDatabaseBlockObjectResponse,
  DatabaseObjectResponse,
  Heading1BlockObjectResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
  QueryDatabaseResponse,
  TextRichTextItemResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { PAGES, PROJECT_STATUS, SENT_TO_CLIENT, WIP, WORKING_DAYS } from "src/const/const.notion";
import { SelectObjectResponse, StatusObjectResponse } from "src/types/notion.type";

// This service gets all working days and send an email of daily recap to the client
@Injectable()
export class ReviewService {
  private notion: Client;

  constructor(private readonly configService: ConfigService) {
    this.notion = new Client({ auth: process.env.NOTION_KEY });
  }

  async getNotSentWorkingDays() {
    // 1. Get all Notion DB
    const database_id = this.configService.get<string>("notion.databaseID");
    if (!database_id) throw new Error("No database ID found in config file");

    const databases: PageObjectResponse[] = await this.notion.databases
      .query({
        database_id,
      })
      .catch((error: NotionErrorCode) => {
        throw new Error(`Connexion à l'API Notion impossible : ${error}`);
      })
      .then((result: QueryDatabaseResponse) => result.results as unknown as PageObjectResponse[]);

    // 2. Filter clients Coton is actually working with
    const currentClientsPages: PageObjectResponse[] = databases.filter(
      (data: PageObjectResponse) => {
        const projectStatus = data.properties[PROJECT_STATUS] as SelectObjectResponse;
        const select = projectStatus.select;

        return select.name === WIP;
      }
    );

    // Get ID for each page
    const pagesID: string[] = currentClientsPages.map((page) => page.id);
    const blocks: BlockObjectResponse[][] = await Promise.all(
      pagesID.map((block_id) =>
        this.notion.blocks.children
          .list({ block_id })
          .then((result: ListBlockChildrenResponse) => result.results as BlockObjectResponse[])
      )
    );
    const flattenedBlocks: BlockObjectResponse[] = blocks.flatMap((e) => e);

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

    // Finding pages by ID
    const pages: ChildDatabaseBlockObjectResponse[][] = await Promise.all(
      pagesBlockID.map((block_id) =>
        this.notion.blocks.children
          .list({ block_id })
          .then(
            (result: ListBlockChildrenResponse) =>
              result.results as ChildDatabaseBlockObjectResponse[]
          )
      )
    );
    const flattenedPages: ChildDatabaseBlockObjectResponse[] = pages.flatMap((e) => e);

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
    const workingDaysPages: PageObjectResponse[][] = await Promise.all(
      pagesWithWorkingDaysID.map((database_id) =>
        this.notion.databases
          .query({
            database_id,
            filter: {
              timestamp: "created_time",
              created_time: { past_week: {} },
            },
          })
          .then((result) => result.results as PageObjectResponse[])
      )
    );
    const workingDays: PageObjectResponse[] = workingDaysPages.flatMap((e) => e);

    const notSentWorkingDays = workingDays.filter((workingDay) => {
      const status = workingDay.properties[SENT_TO_CLIENT] as StatusObjectResponse;

      return status?.status.name === "Not Sent";
    });

    const workingDaysID = notSentWorkingDays.map((workingDay) => workingDay.id);

    const wdb = await Promise.all(
      workingDaysID.map((block_id) =>
        this.notion.blocks.children.list({ block_id }).then((result) => result)
      )
    );

    return wdb;
  }
}
