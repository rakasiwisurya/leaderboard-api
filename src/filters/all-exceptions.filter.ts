import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const res = exception.getResponse();

      // Handle both string and object messages
      message = typeof res === 'string' ? res : (res as any).message || message;
    } else if (exception instanceof Error) {
      console.error(exception);
      message = exception.message || message;
    }

    if (Array.isArray(message)) {
      message = message.join(', ');
    }

    // Map custom messages (like your Express helpers)
    const messageMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized access',
      [HttpStatus.FORBIDDEN]: 'Forbidden access',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Unprocessable Entity',
      [HttpStatus.BAD_GATEWAY]: 'Bad Gateway',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    };

    // If message not provided, use mapped default
    if (!message) {
      message = messageMap[status] || 'Unknown error';
    }

    response.status(status).json({
      status,
      message,
      data: null,
    });
  }
}
