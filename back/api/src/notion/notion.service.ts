import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';
import { QUERY_TYPE } from 'src/enums/queryType.enum';

@Injectable()
export class NotionService {
  constructor(private readonly httpService: HttpService) {}

  public async get(id: string, type: QUERY_TYPE) {
    return lastValueFrom(
      this.httpService
        .get(`https://api.notion.com/v1/${type}/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_KEY}`,
            'Notion-Version': process.env.NOTION_VERSION,
            'Content-Type': 'application/json',
          },
        })
        .pipe(map((res) => res.data)),
    );
  }

  public async queryDatabases(id: string, filter?: any) {
    return lastValueFrom(
      this.httpService
        .post(
          `https://api.notion.com/v1/databases/${id}/query`,
          { filter },
          {
            headers: {
              Authorization: `Bearer ${process.env.NOTION_KEY}`,
              'Notion-Version': process.env.NOTION_VERSION,
              'Content-Type': 'application/json',
            },
          },
        )
        .pipe(map((res) => res.data.results)),
    );
  }

  public async queryBlocksWithChildren(id: string) {
    return lastValueFrom(
      this.httpService
        .get(`https://api.notion.com/v1/blocks/${id}/children?page_size=100`, {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_KEY}`,
            'Notion-Version': process.env.NOTION_VERSION,
            'Content-Type': 'application/json',
          },
        })
        .pipe(map((res) => res.data.results)),
    );
  }
}
