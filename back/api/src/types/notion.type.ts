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
