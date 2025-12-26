import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/users/user.entity';
import { Repository } from 'typeorm';
import { Score } from './score.entity';

@Injectable()
export class ScoresService {
  constructor(
    @InjectRepository(Score)
    private readonly scoreRepo: Repository<Score>,
    @InjectRepository(User)
    private readonly userRepo: Repository<User>,
  ) {}

  async submit(score: number, currentUser: User, targetUserId?: number) {
    const userId = targetUserId ?? currentUser.id;

    if (currentUser.role !== 'admin' && userId !== currentUser.id) {
      throw new ForbiddenException('You can only submit score for yourself');
    }

    const user = await this.userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newScore = this.scoreRepo.create({
      score,
      user,
    });

    return this.scoreRepo.save(newScore);
  }

  async leaderboard() {
    return this.scoreRepo.find({
      relations: ['user'],
      order: { score: 'DESC' },
      take: 10,
    });
  }
}
