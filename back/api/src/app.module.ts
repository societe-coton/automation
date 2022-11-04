import { Module } from "@nestjs/common";

import { PrismaService } from "./prisma.service";

import { GitController } from "./core/git/git.controller";

@Module({
  imports: [],
  controllers: [GitController],
  providers: [PrismaService],
})
export class AppModule {}
