import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ScoresService } from './scores.service';
import { CreateScoreDto } from './dto/create-score.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller()
export class ScoresController {
  constructor(private readonly scoresService: ScoresService) {}

  @Post('scores')
  submit(@Body() dto: CreateScoreDto, @Req() req) {
    return this.scoresService.submit(dto.score, dto.username, req.user);
  }

  @Get('leaderboard')
  leaderboard() {
    return this.scoresService.leaderboard();
  }
}
