import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import * as fs from 'fs';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    res.on('finish', () => {
      fs.appendFileSync(
        'logs/app.log',
        `${req.ip} ${req.method} ${req.originalUrl} ${res.statusCode}\n`,
      );
    });
    next();
  }
}
