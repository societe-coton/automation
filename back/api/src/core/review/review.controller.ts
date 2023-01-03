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
    // Get Working Days
    const unsentWorkingDays = await this.reviewService.getNotSentWorkingDays();

    // Send Working Days to matching plateform
    unsentWorkingDays.forEach(async (workingDay) => {
      const platform = workingDay.communicationChannel.platform;
      let isSent: boolean[];

      switch (platform) {
        case "email":
          isSent = await Promise.all(
            workingDay.communicationChannel.address.map((address) =>
              this.mailService.sendMail(address, workingDay.formattedContent)
            )
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

      if (isSent.every((val) => val)) await this.reviewService.updateSentToClient(workingDay);
    });

    return unsentWorkingDays;
  }
}
