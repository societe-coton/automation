export interface SelectObjectResponse {
  type: "select";
  select: SelectPropertyResponse | null;
  id: string;
}

export interface SelectPropertyResponse {
  id: string;
  name: string;
  color: string;
}
