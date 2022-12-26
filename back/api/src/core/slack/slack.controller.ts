import { Controller, Get } from "@nestjs/common";

@Controller("slack")
export class SlackController {
  constructor() {}

  @Get()
  async getSlackButton() {
    
  }
}
