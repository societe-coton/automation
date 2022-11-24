import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Client } from '@notionhq/client';
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
          throw new Error(error);
        })
        .then((result: QueryDatabaseResponse) => result.results);

    // 2. Filter clients Coton is actually working with
    const currentClientsPages: (
      | PageObjectResponse
      | PartialPageObjectResponse
    )[] = databases.filter((data) => {
      const projectStatus = data.properties['Project status'];
      const name = projectStatus && projectStatus['select'].name;
      return name === 'Work in Progress';
    });

    // Get ID for each page
    const pagesID: string[] = currentClientsPages.map((page) => page.id);
    const blocks: (PartialBlockObjectResponse | BlockObjectResponse)[] = [];
    for (const block_id of pagesID) {
      const block = await this.notion.blocks.children
        .list({ block_id })
        .then((b: ListBlockChildrenResponse) => b.results);
      blocks.push(...block);
    }

    // 3. Get everything inside "Pages" dropdown menu
    // Get all blocks having a heading
    const headingBlocks = blocks.filter((block) => block['heading_1']);
    // Filter all blocks having "Pages" as heading name
    const pagesBlock = headingBlocks.filter(
      (hb) => hb['heading_1'].rich_text[0].text.content === 'Pages',
    );
    // Getting ID's
    const pagesBlockID = pagesBlock.map((pb) => pb.id).filter((e) => e.length);
    // Finding pages by ID
    const pages: (PartialBlockObjectResponse | BlockObjectResponse)[] = [];
    for (const block_id of pagesBlockID) {
      const page = await this.notion.blocks.children
        .list({ block_id })
        .then((result: ListBlockChildrenResponse) => result.results);
      pages.push(...page);
    }

    // 4. Get "Working Days" calendar block
    const pagesWithChildDatabase = pages.filter((p) => p['child_database']);
    const pagesWithWorkingDays = pagesWithChildDatabase.filter(
      (p) => p['child_database'].title === 'Working days',
    );
    const pagesWithWorkingDaysID = pagesWithWorkingDays.map((p) => p.id);
    const workingDaysPages = [];

    for (const database_id of pagesWithWorkingDaysID) {
      const page = await this.notion.databases
        .query({
          database_id,
          filter: {
            timestamp: 'created_time',
            created_time: { past_week: {} },
          },
        })
        .then((result) => result.results);
      workingDaysPages.push(...page);
    }
  }
}
