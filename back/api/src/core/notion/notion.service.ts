import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { Client, NotionErrorCode } from "@notionhq/client";
import {
  ListBlockChildrenResponse,
  PageObjectResponse,
  QueryDatabaseResponse,
} from "@notionhq/client/build/src/api-endpoints";

@Injectable()
export class NotionService {
  private notion: Client;
  constructor(private readonly configService: ConfigService) {
    const auth = this.configService.get<string>("notion.token");

    this.notion = new Client({ auth });
  }

  async getDatabase(database_id: string): Promise<PageObjectResponse[]> {
    return this.notion.databases
      .query({
        database_id,
      })
      .then((result: QueryDatabaseResponse) => result.results as unknown as PageObjectResponse[])
      .catch((error: NotionErrorCode) => {
        throw new Error(`Connexion à l'API Notion impossible : ${error}`);
      });
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
          .then((result) => result.results as PageObjectResponse[])
          .catch((error: NotionErrorCode) => {
            throw new Error(`Connexion à l'API Notion impossible : ${error}`);
          })
      )
    );
  }

  async getBlock<T>(block_id: string): Promise<T[]> {
    return this.notion.blocks.children
      .list({ block_id })
      .then((result: ListBlockChildrenResponse) => result.results as unknown as T[])
      .catch((error: NotionErrorCode) => {
        throw new Error(`Connexion à l'API Notion impossible : ${error}`);
      });
  }

  async getManyBlock<T>(pagesID: string[]): Promise<T[][]> {
    return Promise.all(
      pagesID.map((block_id) =>
        this.notion.blocks.children
          .list({ block_id })
          .then((result: ListBlockChildrenResponse) => result.results as unknown as T[])
          .catch((error: NotionErrorCode) => {
            throw new Error(`Connexion à l'API Notion impossible : ${error}`);
          })
      )
    );
  }

  async getPage<T>(page_id: string): Promise<T> {
    return this.notion.pages
      .retrieve({ page_id })
      .then((result) => result as unknown as T)
      .catch((error: NotionErrorCode) => {
        throw new Error(`Connexion à l'API Notion impossible : ${error}`);
      });
  }
}
