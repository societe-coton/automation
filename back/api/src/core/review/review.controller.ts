import { Controller, Get } from "@nestjs/common";

import { ReviewService } from "./review.service";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Get()
  async sendReviewToClient() {
    const unsentWorkingDays = await this.reviewService.getNotSentWorkingDays();

    return unsentWorkingDays;
  }
}
