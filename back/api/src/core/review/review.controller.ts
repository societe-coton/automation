import { Controller, Get } from "@nestjs/common";

import { MailService } from "../mail/mail.service";
import { SlackService } from "../slack/slack.service";
import { ReviewService } from "./review.service";

@Controller("reviews")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly mailService: MailService,
    private readonly slackService: SlackService
  ) {}
  @Get()
  sendReviewToClient() {
    // const unsentWorkingDays = await this.reviewService.getNotSentWorkingDays();
    // return unsentWorkingDays;
    const res = this.slackService.sendSlackMessage();

    return res;
  }
}
