import { Module } from '@nestjs/common';
import { ReviewController } from './review/review.controller';
import { ReviewService } from './review/review.service';

@Module({
  imports: [],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class CoreModule {}
