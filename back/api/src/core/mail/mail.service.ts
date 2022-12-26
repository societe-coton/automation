import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import axios from "axios";

@Injectable()
export class MailService {
  constructor(private readonly configService: ConfigService) {}
  async sendMail(email: string): Promise<boolean> {
    const url = this.configService.get<string>("sendinblue.url");
    const token = this.configService.get<string>("sendinblue.token");
    const senderEmail = this.configService.get<string>("sendinblue.email");
    const senderName = this.configService.get<string>("sendinblue.name");
    const data = {
      sender: { email: senderEmail, name: senderName },
      to: [{ email, name: "Working Day" }],
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
