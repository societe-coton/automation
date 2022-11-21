import { Injectable } from '@nestjs/common';
import { NotionService } from 'nestjs-notion';

@Injectable()
export class ReviewService {
  constructor(private readonly notion: NotionService) {}

  async onModuleInit() {
    // GET all clients database
    const database = await this.notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });

    // Filter clients Coton is actually working with
    const currentClientsPages = database.results.filter((data) => {
      const projectStatus = data.properties['Project status'];
      const name = projectStatus && projectStatus['select'].name;
      return name === 'Work in Progress';
    });

    // Get ID for each page
    const pagesID = currentClientsPages.map((page) => page.id);

    // Get Blocks of every Work In Progress client
    const blocks = [];
    for (const block_id of pagesID) {
      const block = await this.notion.blocks.children.list({ block_id });
      blocks.push(block);
    }

    // const test = await this.notion.blocks.children.list({
    //   block_id: '9a2c2daa-dc56-4741-bce2-b4d1fe903aae',
    // });
    // console.log(
    //   '🚀 ~ file: review.service.ts ~ line 35 ~ ReviewService ~ onModuleInit ~ test',
    //   test.results[0]['quote'].text,
    // );

    // console.log(blocks[0].results[0].heading_1);
    const pagesMenu = blocks.map((block) => {
      const headingBlocks = block.results.filter((b) => b.heading_1);
      const headingBlocksWithPageAsTitle = headingBlocks.filter((b) =>
        b.heading_1.text.filter((h) => h.text.content === 'Pages'),
      );
      return headingBlocksWithPageAsTitle;
    });
    console.log(
      '🚀 ~ file: review.service.ts ~ line 47 ~ ReviewService ~ pagesMenu ~ pagesMenu',
      pagesMenu,
    );

    // const test = pagesMenu.map((e) => e.map((f) => f.heading_1.text));
    // console.log(
    //   '🚀 ~ file: review.service.ts ~ line 46 ~ ReviewService ~ pagesMenu ~ headingBlocksWithPageAsTitle',
    //   test.map((e) => e.map((f) => f.map((g) => console.log(g.text)))),
    // );

    // const pagesMenuId = pagesMenu.map((pageMenu) => pageMenu.id);

    // console.log(
    //   '🚀 ~ file: review.service.ts ~ line 39 ~ ReviewService ~ pagesMenu ~ pagesMenu',
    //   pagesMenu,
    // );
    // console.log(blocks[0].results.map((res) => res.heading_1));
    // const blocks = await this.notion.blocks.children.list({
    //   block_id: '3ad619fe6bec41ca8106e736ec666a43',
    // });

    // const result = blocks.results.map((res) => res['heading_1']);
    // console.log(
    //   '🚀 ~ file: review.service.ts ~ line 23 ~ ReviewService ~ onModuleInit ~ blocks',
    //   blocks,
    // );
    // console.log('result', result[0].text);
  }
}
