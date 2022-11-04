import { Injectable } from "@nestjs/common";

@Injectable()
export class GitlabService {
  findAll(): string {
    return "gitlab";
  }
}
