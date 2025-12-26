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

  async submit(score: number, targetUsername: string, currentUser: User) {
    if (
      currentUser.role !== 'admin' &&
      currentUser.username !== targetUsername
    ) {
      throw new ForbiddenException('You can only submit score for yourself');
    }

    const user = await this.userRepo.findOne({
      where: { username: targetUsername },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const newScore = this.scoreRepo.create({
      score,
      user,
    });

    const saved = await this.scoreRepo.save(newScore);

    return {
      message: 'Success add score',
      data: {
        username: user.username,
        score: saved.score,
      },
    };
  }

  async leaderboard() {
    const data = await this.scoreRepo
      .createQueryBuilder('score')
      .innerJoin('score.user', 'user')
      .select(['user.username AS username', 'score.score AS score'])
      .orderBy('score.score', 'DESC')
      .limit(10)
      .getRawMany();

    return {
      message: 'Success get leaderboard',
      data,
    };
  }
}
