import { Module } from "@nestjs/common";

import { GitlabService } from "./git/git.service";
import { ReviewService } from "./review/review.service";

import { GitController } from "./git/git.controller";
import { ReviewController } from "./review/review.controller";

@Module({
  imports: [],
  controllers: [ReviewController, GitController],
  providers: [ReviewService, GitlabService],
})
export class CoreModule {}
