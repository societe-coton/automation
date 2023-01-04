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

      switch (platform) {
        case "email":
          await Promise.all(
            workingDay.communicationChannel.address.map(async (address) => {
              const isSent = await this.mailService.sendMail(address, workingDay.formattedContent);
              if (!isSent) return;
              // TODO: En plus du return, inscrire l'échec dans les logs
              await this.reviewService.updateSentToClient(workingDay);
            })
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
