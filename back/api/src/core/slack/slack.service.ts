import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { map } from "rxjs";

@Injectable()
export class SlackService {
  private token: string = this.configService.get<string>("slack.token");

  constructor(private readonly configService: ConfigService, private httpService: HttpService) {}

  sendSlackMessage() {
    const data = {
      channel: "#test",
      text: "Coucou",
    };
    const config = { headers: { authorization: `Bearer ${this.token}` } };

    const res = this.httpService.post("https://slack.com/api/chat.postMessage", data, config);

    return res.pipe(map((response) => response.data));
  }
}
