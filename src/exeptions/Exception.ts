import { ApolloError } from 'apollo-server-errors';

export class GraphQLException extends ApolloError {
  constructor(message: string, code: string = 'INTERNAL_SERVER_ERROR', extensions?: Record<string, any>) {
    super(message, code, extensions);

    Object.defineProperty(this, 'name', { value: 'GraphQLException' });
  }
}
export class NotFoundException extends GraphQLException {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND');
  }
}

export class UnauthorizedException extends GraphQLException {
  constructor(message: string = 'You are not authorized') {
    super(message, 'UNAUTHORIZED');
  }
}

export class BadRequestException extends GraphQLException {
  constructor(message: string = 'Invalid input') {
    super(message, 'BAD_USER_INPUT');
  }
}

export class FoundException extends GraphQLException {
  constructor(message: string = 'User already registered') {
    super(message, 'BAD_USER_INPUT');
  }
}