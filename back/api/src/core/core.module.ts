import { HttpModule } from "@nestjs/axios";
import { Module } from "@nestjs/common";

import { GitlabService } from "./git/git.service";
import { MailService } from "./mail/mail.service";
import { NotionService } from "./notion/notion.service";
import { ReviewService } from "./review/review.service";
import { SlackService } from "./slack/slack.service";

import { GitController } from "./git/git.controller";
import { ReviewController } from "./review/review.controller";

@Module({
  imports: [HttpModule],
  controllers: [ReviewController, GitController],
  providers: [ReviewService, GitlabService, NotionService, MailService, SlackService],
})
export class CoreModule {}
