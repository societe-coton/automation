import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { PrismaService } from "./prisma.service";

import { CoreModule } from "./core/core.module";
import configuration from "config/configuration";

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true, load: [configuration] }), CoreModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
