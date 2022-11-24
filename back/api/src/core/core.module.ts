import { Module } from '@nestjs/common';
import { ReviewService } from './review/review.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ReviewService],
})
export class CoreModule {}
