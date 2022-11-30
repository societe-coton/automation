import { Injectable } from "@nestjs/common";

import { SibApiV3Sdk } from "sib-api-v3-sdk";

@Injectable()
export class MailService {
  private client;

  constructor() {
    this.client = SibApiV3Sdk.ApiClient.instance;
  }
}
