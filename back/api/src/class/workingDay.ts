import {
  BlockObjectResponse,
  EmailPropertyItemObjectResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

import { EMAIL, PLATEFORM } from "src/const/const.notion";
import { SelectObjectResponse } from "src/types/notion.type";

export class WorkingDay {
  public id: string;
  public content: BlockObjectResponse[];
  private communicationChannelPage: PageObjectResponse;
  private contentPromise?: Promise<BlockObjectResponse[]>;
  private communnicationChannelPromise?: Promise<PageObjectResponse>;

  public communicationChannel: CommunicationChannel;

  constructor(workingDay: PageObjectResponse) {
    this.id = workingDay?.id;
  }

  public setContentPromise = (promise: Promise<BlockObjectResponse[]>) =>
    (this.contentPromise = promise);
  public setCommunicationChannelsPromise = (promise: Promise<PageObjectResponse>) => {
    this.communnicationChannelPromise = promise;
  };
  public async computePromise() {
    this.content = await this.contentPromise;
    this.communicationChannelPage = await this.communnicationChannelPromise;

    this.getCommunicationChannel();
    return this;
  }
  private getCommunicationChannel = () => {
    const communicationChannelPage = this.communicationChannelPage;
    const plateform = communicationChannelPage.properties[PLATEFORM] as SelectObjectResponse;
    const plateformName = plateform.select.name;

    const addresses = communicationChannelPage.properties[EMAIL] as EmailPropertyItemObjectResponse;
    const addressName = addresses.email;
    const address = addressName.split(" ");

    this.communicationChannel = { platform: plateformName, address };
  };
}

class CommunicationChannel {
  platform: string;
  address: string[];
  token?: string;
}
