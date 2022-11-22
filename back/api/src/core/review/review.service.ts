import { Injectable } from '@nestjs/common';
import { NotionService } from 'src/notion/notion.service';

// This service gets all working days and send an email of daily recap to the client
@Injectable()
export class ReviewService {
  constructor(private readonly notion: NotionService) {}

  async onModuleInit() {
    // 1. Get all Notion DB
    const databases = await this.notion.queryDatabases(
      process.env.NOTION_DATABASE_ID,
    );

    //   // 2. Filter clients Coton is actually working with
    const currentClientsPages = databases.filter((data) => {
      const projectStatus = data.properties['Project status'];
      const name = projectStatus && projectStatus['select'].name;

      return name === 'Work in Progress';
    });

    // Get ID for each page
    const pagesID = currentClientsPages.map((page) => page.id);
    const blocks = [];
    for (const id of pagesID) {
      const block = await this.notion.queryBlocksWithChildren(id);
      blocks.push(...block);
    }

    // 3. Get everything inside "Pages" dropdown menu
    // Get all blocks having a heading
    const headingBlocks = blocks.filter((block) => block.heading_1);

    // Filter all blocks having "Pages" as heading name
    const pagesBlock = headingBlocks.filter(
      (hb) => hb.heading_1.rich_text[0].text.content === 'Pages',
    );

    // Getting ID's
    const pagesBlockID = pagesBlock.map((pb) => pb.id).filter((e) => e.length);

    // Finding pages by ID
    const pages = [];
    for (const id of pagesBlockID) {
      const page = await this.notion.queryBlocksWithChildren(id);
      pages.push(...page);
    }

    // 4. Get "Working Days" calendar block
    const pagesWithChildDatabase = pages.filter((p) => p.child_database);
    const pagesWithWorkingDays = pagesWithChildDatabase.filter(
      (p) => p.child_database.title === 'Working days',
    );
    const pagesWithWorkingDaysID = pagesWithWorkingDays.map((p) => p.id);

    const workingDaysPages = [];
    const filter = {
      timestamp: 'created_time',
      created_time: {
        past_week: {},
      },
    };

    for (const id of pagesWithWorkingDaysID) {
      const page = await this.notion.queryDatabases(id, filter);
      workingDaysPages.push(...page);
    }
  }
}
