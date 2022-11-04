import { Controller, Get, Param } from "@nestjs/common";

import { GitlabService } from "./gitlab.service";

@Controller("git")
export class GitController {
  constructor(private _gitlabService: GitlabService) {}

  @Get("gitlab/pull-request/:repositoryName")
  public async findAll(@Param("repositoryName") repositoryName: string): Promise<any> {
    return this._gitlabService.getPullRequests({ repositoryName });
  }
}
