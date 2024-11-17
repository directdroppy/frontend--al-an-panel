import { logger } from './logger';

interface ErrorResponse {
  message: string;
  code: string;
  status: number;
}

export class AppError extends Error {
  public readonly code: string;
  public readonly status: number;

  constructor(message: string, code: string, status: number = 500) {
    super(message);
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, AppError.prototype);
  }

  public toResponse(): ErrorResponse {
    return {
      message: this.message,
      code: this.code,
      status: this.status
    };
  }
}

export const errorHandler = {
  handle(error: Error | AppError | any): ErrorResponse {
    // Log the error
    logger.error('Error caught by handler:', error);

    // If it's our custom error, return its response
    if (error instanceof AppError) {
      return error.toResponse();
    }

    // Handle different types of errors
    if (error.name === 'ValidationError') {
      return {
        message: 'Geçersiz veri formatı',
        code: 'VALIDATION_ERROR',
        status: 400
      };
    }

    if (error.name === 'UnauthorizedError') {
      return {
        message: 'Yetkisiz erişim',
        code: 'UNAUTHORIZED',
        status: 401
      };
    }

    if (error.code === 'ECONNREFUSED') {
      return {
        message: 'Sunucuya bağlanılamıyor',
        code: 'CONNECTION_ERROR',
        status: 503
      };
    }

    // Default error response
    return {
      message: 'Bir hata oluştu',
      code: 'INTERNAL_ERROR',
      status: 500
    };
  },

  // Common error creators
  badRequest(message: string): AppError {
    return new AppError(message, 'BAD_REQUEST', 400);
  },

  unauthorized(message: string = 'Yetkisiz erişim'): AppError {
    return new AppError(message, 'UNAUTHORIZED', 401);
  },

  forbidden(message: string = 'Bu işlem için yetkiniz yok'): AppError {
    return new AppError(message, 'FORBIDDEN', 403);
  },

  notFound(message: string = 'Kaynak bulunamadı'): AppError {
    return new AppError(message, 'NOT_FOUND', 404);
  },

  conflict(message: string): AppError {
    return new AppError(message, 'CONFLICT', 409);
  },

  internal(message: string = 'Sunucu hatası'): AppError {
    return new AppError(message, 'INTERNAL_ERROR', 500);
  }
};