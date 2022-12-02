import {
  BlockObjectResponse,
  GetPageResponse,
  PageObjectResponse,
} from "@notionhq/client/build/src/api-endpoints";

export class WorkingDay {
  public id: string;
  private content: BlockObjectResponse[];
  private communicationChannels: GetPageResponse;
  private contentPromise?: Promise<BlockObjectResponse[]>;
  private comunnicationChannelsPromise?: Promise<GetPageResponse>;

  constructor(workingDay: PageObjectResponse) {
    this.id = workingDay?.id;
  }

  async computePromise() {
    this.content = await this.contentPromise;
    this.communicationChannels = await this.comunnicationChannelsPromise;

    return this;
  }

  setContentPromise = (promise: Promise<BlockObjectResponse[]>) => (this.contentPromise = promise);
  setCommunicationChannelsPromise = (promise: Promise<GetPageResponse>) => {
    this.comunnicationChannelsPromise = promise;
  };
}
