import { Module } from "@nestjs/common";

import { PrismaService } from "./prisma.service";

import { CoreModule } from "./core/core.module";

@Module({
  imports: [CoreModule],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
