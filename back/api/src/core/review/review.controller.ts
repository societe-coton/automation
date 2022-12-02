import { Controller, Get } from "@nestjs/common";

import { MailService } from "../mail/mail.service";
import { ReviewService } from "./review.service";

@Controller("reviews")
export class ReviewController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly mailService: MailService
  ) {}
  @Get()
  async sendReviewToClient() {
    const unsentWorkingDays = await this.reviewService.getNotSentWorkingDays();
    return unsentWorkingDays;
  }
}
