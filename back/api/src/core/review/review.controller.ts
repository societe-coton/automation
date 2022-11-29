import { Controller, Get } from "@nestjs/common";

import { ReviewService } from "./review.service";

@Controller("reviews")
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}
  @Get()
  async sendReviewToClient() {
    const workingDays = await this.reviewService.getWorkingDays();

    return workingDays;
  }
}
