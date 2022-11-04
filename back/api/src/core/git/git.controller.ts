import { Controller, Get } from "@nestjs/common";

@Controller("git")
export class GitController {
  @Get()
  findAll(): string {
    return "This action returns all gits";
  }
}
