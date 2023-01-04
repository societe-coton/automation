import { RichTextItemResponse } from "@notionhq/client/build/src/api-endpoints";

export interface SelectObjectResponse {
  type: "select";
  select: SelectPropertyResponse | null;
  id: string;
}

export interface StatusObjectResponse {
  type: "status";
  status: SelectPropertyResponse | null;
  id: string;
}

export interface RelationObjectResponse {
  id: string;
  type: "relation";
  relation: Array<{
    id: string;
  }>;
}

export interface SelectPropertyResponse {
  id: string;
  name: string;
  color: string;
}

export interface DailyReview {
  communicationChannel: CommunicationChannel;
  review: Review;
}

export interface BlockType {
  rich_text: Array<RichTextItemResponse>;
  color: ApiColor;
}

type ApiColor =
  | "default"
  | "gray"
  | "brown"
  | "orange"
  | "yellow"
  | "green"
  | "blue"
  | "purple"
  | "pink"
  | "red"
  | "gray_background"
  | "brown_background"
  | "orange_background"
  | "yellow_background"
  | "green_background"
  | "blue_background"
  | "purple_background"
  | "pink_background"
  | "red_background";

interface CommunicationChannel {
  type: string;
  token: string;
  name: string;
}

interface Review {
  name: string;
}
