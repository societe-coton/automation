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

export interface SelectPropertyResponse {
  id: string;
  name: string;
  color: string;
}

export interface DailyReview {
  communicationChannel: CommunicationChannel;
  review: Review;
}

interface CommunicationChannel {
  type: string;
  token: string;
  name: string;
}

interface Review {
  name: string;
}
