import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { lastValueFrom, map } from 'rxjs';

@Injectable()
export class NotionService {
  constructor(private readonly httpService: HttpService) {}
  public async get(id: string) {
    return lastValueFrom(
      this.httpService
        .get(`https://api.notion.com/v1/databases/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_KEY}`,
            'Notion-Version': process.env.NOTION_VERSION,
            'Content-Type': 'application/json',
          },
        })
        .pipe(map((res) => res.data)),
    );
  }

  public async getPage(id: string) {
    return lastValueFrom(
      this.httpService
        .get(`https://api.notion.com/v1/pages/${id}`, {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_KEY}`,
            'Notion-Version': process.env.NOTION_VERSION,
            'Content-Type': 'application/json',
          },
        })
        .pipe(map((res) => res.data)),
    );
  }

  public async getBlock(id: string) {
    return lastValueFrom(
      this.httpService
        .get(`https://api.notion.com/v1/blocks/${id}/children?page_size=100`, {
          headers: {
            Authorization: `Bearer ${process.env.NOTION_KEY}`,
            'Notion-Version': process.env.NOTION_VERSION,
            'Content-Type': 'application/json',
          },
        })
        .pipe(map((res) => res.data)),
    );
  }
}
