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

    unsentWorkingDays.forEach((workingDay) => {
      const platform = workingDay.communicationChannel.platform;
      switch (platform) {
        case "email":
          workingDay.communicationChannel.address.forEach(
            async (address) => await this.mailService.sendMail(address, workingDay.formattedContent)
          );
          break;
        case "slack":
          break;
        case "whatsapp":
          break;
        case "teams":
          break;
        case "google-chat":
          break;
        default:
          throw new Error("No platform found");
      }
    });
    return unsentWorkingDays;
  }
}
