import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { NotionService } from 'src/notion/notion.service';
import { ReviewService } from './review/review.service';

@Module({
  imports: [HttpModule],
  controllers: [],
  providers: [ReviewService, NotionService],
})
export class CoreModule {}
