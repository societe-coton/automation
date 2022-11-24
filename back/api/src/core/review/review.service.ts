import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';
import {
  CHILD_DATABASE,
  HEADING_1,
  PAGES,
  PROJECT_STATUS,
  SELECT,
  WIP,
  WORKING_DAYS,
} from 'src/const/const.notion';
import {
  BlockObjectResponse,
  ListBlockChildrenResponse,
  PageObjectResponse,
  PartialBlockObjectResponse,
  PartialPageObjectResponse,
  QueryDatabaseResponse,
} from '@notionhq/client/build/src/api-endpoints';

// This service gets all working days and send an email of daily recap to the client
@Injectable()
export class ReviewService {
  private notion: Client;

  constructor(private readonly configService: ConfigService) {
    this.notion = new Client({ auth: process.env.NOTION_KEY });
  }

  async onModuleInit() {
    // 1. Get all Notion DB
    const database_id = this.configService.get<string>('notion.databaseID');
    if (!database_id) throw new Error('No database ID found in config file');

    const databases:
      | PageObjectResponse[]
      | (PageObjectResponse | PartialPageObjectResponse)[] =
      await this.notion.databases
        .query({
          database_id,
        })
        .catch((error) => {
          throw new Error(`Connexion à l'API Notion impossible : ${error}`);
        })
        .then((result: QueryDatabaseResponse) => result.results);

    // 2. Filter clients Coton is actually working with
    const currentClientsPages: (
      | PageObjectResponse
      | PartialPageObjectResponse
    )[] = databases.filter((data) => {
      const projectStatus = data.properties[PROJECT_STATUS];
      const name = projectStatus[SELECT]?.name;

      return name === WIP;
    });

    // Get ID for each page
    const pagesID: string[] = currentClientsPages.map((page) => page.id);
    const blocks = await Promise.all(
      pagesID.map((block_id) =>
        this.notion.blocks.children
          .list({ block_id })
          .then((b: ListBlockChildrenResponse) => b.results),
      ),
    );
    const flattenedBlocks: (
      | PartialBlockObjectResponse
      | BlockObjectResponse
    )[] = blocks.flatMap((e) => e);

    // 3. Get everything inside "Pages" dropdown menu
    // Get all blocks having a heading
    const headingBlocks = flattenedBlocks.filter((block) => block[HEADING_1]);

    // Filter all blocks having "Pages" as heading name
    const pagesBlock = headingBlocks.filter(
      (hb) => hb[HEADING_1].rich_text[0].text.content === PAGES,
    );

    // Getting ID's
    const pagesBlockID: string[] = pagesBlock
      .map((pb) => pb.id)
      .filter((e) => !!e.length);

    // Finding pages by ID
    const pages = await Promise.all(
      pagesBlockID.map((block_id) =>
        this.notion.blocks.children
          .list({ block_id })
          .then((result: ListBlockChildrenResponse) => result.results),
      ),
    );
    const flattenedPages = pages.flatMap((e) => e);

    // 4. Get "Working Days" calendar block
    // Filter every page having a child_database
    const pagesWithChildDatabase = flattenedPages.filter(
      (p) => p[CHILD_DATABASE],
    );
    const pagesWithWorkingDays = pagesWithChildDatabase.filter(
      (p) => p[CHILD_DATABASE].title === WORKING_DAYS,
    );
    const pagesWithWorkingDaysID = pagesWithWorkingDays.map((p) => p.id);

    // Get Working Days
    const workingDaysPages = await Promise.all(
      pagesWithWorkingDaysID.map((database_id) =>
        this.notion.databases
          .query({
            database_id,
            filter: {
              timestamp: 'created_time',
              created_time: { past_week: {} },
            },
          })
          .then((result) => result.results),
      ),
    );
    const workingDays = workingDaysPages.flatMap((e) => e);
    console.log(
      '🚀 ~ file: review.service.ts ~ line 110 ~ ReviewService ~ onModuleInit ~ workingDaysPages',
      workingDays,
    );
  }
}
