import { Module } from "@nestjs/common";

import { PrismaService } from "./prisma.service";

import { GitController } from "./core/git/git.controller";
import { CoreModule } from "./core/core.module";
import { ReviewService } from "./core/review/review.service";
import { ConfigModule } from "@nestjs/config";
import configuration from "config/configuration";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), CoreModule],
  controllers: [GitController],
  providers: [PrismaService, ReviewService],
})
export class AppModule {}
