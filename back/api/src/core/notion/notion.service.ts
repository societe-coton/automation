import { Injectable } from "@nestjs/common";

import { Client, NotionErrorCode } from "@notionhq/client";
import {
  ListBlockChildrenResponse,
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

@Injectable()
export class NotionService {
  private notion: Client;
  constructor() {
    this.notion = new Client({ auth: process.env.NOTION_KEY });
  }

  async getDatabase(database_id: string): Promise<PageObjectResponse[]> {
    return this.notion.databases
      .query({
        database_id,
      })
      .catch((error: NotionErrorCode) => {
        throw new Error(`Connexion à l'API Notion impossible : ${error}`);
      })
      .then((result: QueryDatabaseResponse) => result.results as unknown as PageObjectResponse[]);
  }

  async getManyDatabase(pagesID: string[], filter?: any): Promise<PageObjectResponse[][]> {
    return Promise.all(
      pagesID.map((database_id) =>
        this.notion.databases
          .query({
            database_id,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            filter,
          })
          .catch((error: NotionErrorCode) => {
            throw new Error(`Connexion à l'API Notion impossible : ${error}`);
          })
          .then((result) => result.results as PageObjectResponse[])
      )
    );
  }
  async getBlock<T>(block_id: string): Promise<T[]> {
    return this.notion.blocks.children
      .list({ block_id })
      .catch((error: NotionErrorCode) => {
        throw new Error(`Connexion à l'API Notion impossible : ${error}`);
      })
      .then((result: ListBlockChildrenResponse) => result.results as unknown as T[]);
  }

  async getManyBlock<T>(pagesID: string[]): Promise<T[][]> {
    return Promise.all(
      pagesID.map((block_id) =>
        this.notion.blocks.children
          .list({ block_id })
          .catch((error: NotionErrorCode) => {
            throw new Error(`Connexion à l'API Notion impossible : ${error}`);
          })
          .then((result: ListBlockChildrenResponse) => result.results as unknown as T[])
      )
    );
  }

  async getPage(page_id: string) {
    return this.notion.pages.retrieve({ page_id }).catch((error: NotionErrorCode) => {
      throw new Error(`Connexion à l'API Notion impossible : ${error}`);
    });
  }
}
