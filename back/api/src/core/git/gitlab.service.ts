import { HttpService } from "@nestjs/axios";
import { Injectable } from "@nestjs/common";

const GITLAB_PG_TOKEN_READONLY = "glpat-69My89Rm-rR6KPMWsK45";

@Injectable()
export class GitlabService {
  constructor(private readonly httpService: HttpService) {}

  public async getPullRequests(params: {
    repositoryName: string;
    state?: string;
  }): Promise<PRInformation[]> {
    // TODO: type state with an enum base on gitlab merge request state
    const { repositoryName, state = "opened" } = params;
    const pullRequests = await this.httpService.axiosRef.get<gitlabPR[]>(
      "https://gitlab.com/api/v4/merge_requests",
      {
        headers: {
          authorization: `Bearer ${GITLAB_PG_TOKEN_READONLY}`,
        },
        params: {
          state,
        },
      }
    );
    return pullRequests.data
      .filter((data) => data.web_url.includes(repositoryName))
      .map((data) => new PRInformation(data));
  }
}

class PRInformation {
  public web_url: string = null;
  public target_branch: string = null;
  public source_branch: string = null;
  public state: string = null;
  public project_id: number = null;
  public title: string = null;
  public description: string = null;

  public assignee: gitlabUser | any = null;
  public reviewers: (gitlabUser | any)[] = null;
  public labels: string[] = null;

  // TODO: replace any by gitlabPR (interface)
  constructor(PRObject?: gitlabUser | any) {
    if (!PRObject) return;

    for (const field of Object.keys(this)) this[field] = PRObject[field];
  }
}

interface gitlabUser {
  id: number;
  username: string;
  name: string;
  state: string;
  avatar_url: string;
  web_url: string;
}

interface gitlabPR {
  web_url: string;
  target_branch: string;
  source_branch: string;
  state: string; // TODO: replace by enum
  project_id: number;
  title: string;
  description?: string;
  assignee: gitlabUser;
  reviewers: gitlabUser[];
  labels: string[];
}
