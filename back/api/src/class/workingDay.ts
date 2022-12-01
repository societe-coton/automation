import { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export class WorkingDay {
  public id: string;
  private content;
  private communicationChannels;
  private contentPromise: Promise<unknown[]>;
  private comunnicationChannelsPromise: Promise<unknown>;

  constructor(workingDay: PageObjectResponse) {
    this.id = workingDay?.id;
  }

  async computeContentPromise() {
    this.content = await this.contentPromise;
    this.communicationChannels = await this.comunnicationChannelsPromise;

    return this;
  }

  setContentPromise = (promise: Promise<unknown[]>) => (this.contentPromise = promise);
  setCommunicationChannelsPromise = (promise: Promise<unknown>) => {
    this.comunnicationChannelsPromise = promise;
  };
}
