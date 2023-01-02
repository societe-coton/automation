import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from "axios";

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}
  async sendMail(email: string, content: string): Promise<boolean> {
    const url = this.configService.get<string>("sendinblue.url");
    const token = this.configService.get<string>("sendinblue.token");
    const senderEmail = this.configService.get<string>("sendinblue.email");
    const senderName = this.configService.get<string>("sendinblue.name");
    const date = new Date().toUTCString();
    const subject = `COTON | Working Day | ${date}`;
    const data = {
      sender: { email: senderEmail, name: senderName },
      to: [{ email, name: "Client" }],
      subject,
      htmlContent: `<html>${content}</html>`,
    };

    const headers = {
      "content-type": "application/json",
      "api-key": token,
    };

    return axios
      .post(url, data, { headers })
      .then(() => true)
      .catch(() => false);
  }
}
