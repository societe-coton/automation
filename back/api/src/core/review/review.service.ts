import { Injectable } from '@nestjs/common';
import { NotionService } from 'src/notion/notion.service';

@Injectable()
export class ReviewService {
  constructor(private readonly httpRequestService: NotionService) {}

  async onModuleInit() {
    //   // 1. Get all Notion DB
    const database = await this.httpRequestService.get(
      process.env.NOTION_DATABASE_ID,
    );

    //   const database = await this.notion.databases.query({
    //     database_id: process.env.NOTION_DATABASE_ID,
    //   });
    //   // 2. Filter clients Coton is actually working with
    //   const currentClientsPages = database.results.filter((data) => {
    //     const projectStatus = data.properties['Project status'];
    //     const name = projectStatus && projectStatus['select'].name;
    //     return name === 'Work in Progress';
    //   });
    //   // Get ID for each page
    //   const pagesID = currentClientsPages.map((page) => page.id);
    //   const blocks = [];
    //   for (const block_id of pagesID) {
    //     const block = await this.notion.blocks.children.list({ block_id });
    //     blocks.push(...block.results);
    //   }
    //   // 3. Get everything inside "Pages" dropdown menu
    //   // Get all blocks having a heading
    //   const headingBlocks = blocks.filter((block) => block.heading_1);
    //   // Filter all blocks having "Pages" as heading name
    //   const pagesBlock = headingBlocks.filter(
    //     (hb) => hb.heading_1.text[0].text.content === 'Pages',
    //   );
    //   // Getting ID's
    //   const pagesBlockID = pagesBlock.map((pb) => pb.id).filter((e) => e.length);
    //   // Finding pages by ID
    //   const pages = [];
    //   for (const block_id of pagesBlockID) {
    //     const page = await this.notion.blocks.children.list({
    //       block_id,
    //     });
    //     pages.push(...page.results);
    //   }
    //   // 4. Get "Working Days" calendar block
    //   const pagesWithChildDatabase = pages.filter((p) => p.child_database);
    //   const pagesWithWorkingDays = pagesWithChildDatabase.filter(
    //     (p) => p.child_database.title === 'Working days',
    //   );
    //   const pagesWithWorkingDaysID = pagesWithWorkingDays.map((p) => p.id);
    //   const workingDaysPages = [];
    //   for (const database_id of pagesWithWorkingDaysID) {
    //     const page = await this.notion.databases.query({
    //       database_id,
    //     });
    //     workingDaysPages.push(...page.results);
    //   }
    //   console.log(
    //     '🚀 ~ file: review.service.ts ~ line 66 ~ ReviewService ~ onModuleInit ~ workingDaysPages',
    //     workingDaysPages.length,
    //   );
  }
}
