import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { GitlabService } from "./git/gitlab.service";

import { GitController } from "./git/git.controller";

@Module({
  imports: [HttpModule],
  controllers: [GitController],
  providers: [GitlabService],
})
export class CoreModule {}
