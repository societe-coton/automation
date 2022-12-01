import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from "axios";

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}
  async sendMail() {
    const url = "https://api.sendinblue.com/v3/smtp/email";
    const token = this.configService.get<string>("sendinblue.token");
    const senderEmail = this.configService.get<string>("sendinblue.email");
    const senderName = this.configService.get<string>("sendinblue.name");
    const data = {
      sender: { email: senderEmail, name: senderName },
      to: [{ email: "benjaminj.geron@gmail.com", name: "Ben" }],
      subject: "Coucou",
      htmlContent: "<html><h1>Coucou</h1></html>",
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
