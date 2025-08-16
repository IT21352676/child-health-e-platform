# Agent Coding Ruleset - TypeScript Backend

## Core Constraints for Code Generation

### File Size Limit
- **NEVER generate files exceeding 300 lines**
- When approaching this limit, split functionality into separate files
- Suggest file splitting strategies to the user

### Code Quality Standards
- Always generate production-ready code
- Include proper error handling
- Add meaningful comments for complex logic
- Use consistent naming conventions

## 1. Strong Typing Requirements

### Always Generate With Types
```typescript
// ❌ DON'T generate this
function processUser(user) {
  return user.name.toUpperCase();
}

// ✅ DO generate this
function processUser(user: User): string {
  return user.name.toUpperCase();
}
```

### Required Type Definitions
- Define interfaces/types for all data structures
- Type all function parameters and return values
- Use utility types (`Partial<T>`, `Pick<T>`, `Omit<T>`) when appropriate
- Never use `any` - use `unknown` if type is truly unknown

### TSConfig Requirements
When generating tsconfig.json, always include:
```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true
  }
}
```

## 2. Project Structure Generation Rules

### For Small/Medium Projects (Technical Organization)
Generate this structure:
```
src/
├── controllers/     # HTTP request handlers
├── services/        # Business logic
├── models/          # Data types and schemas
├── interfaces/      # Type definitions
├── middlewares/     # Express middlewares
├── utils/           # Helper functions
├── config/          # Configuration files
└── types/           # Global type definitions
```

### For Large Projects (Domain Organization)
Generate this structure:
```
src/
├── common/          # Shared utilities
│   ├── middlewares/
│   ├── utils/
│   └── types/
└── modules/
    ├── user/
    │   ├── user.controller.ts
    │   ├── user.service.ts
    │   ├── user.model.ts
    │   ├── user.types.ts
    │   └── index.ts
    └── product/
        ├── product.controller.ts
        ├── product.service.ts
        ├── product.model.ts
        ├── product.types.ts
        └── index.ts
```

### File Naming Conventions
- Use kebab-case for file names: `user-service.ts`
- Include file purpose in name: `user.controller.ts`, `user.service.ts`
- Always include `index.ts` for barrel exports

## 3. Input Validation Code Generation

### Always Generate Validation
For every API endpoint, generate validation using Zod:

```typescript
import { z } from 'zod';

// Generate schema
const CreateUserSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  age: z.number().int().min(0)
});

// Generate validation middleware
export const validateCreateUser = (req: Request, res: Response, next: NextFunction) => {
  try {
    CreateUserSchema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: 'Invalid input' });
  }
};
```

### Validation Requirements
- Validate ALL external inputs (request bodies, query params, headers)
- Generate custom error messages
- Use appropriate validation library (prefer Zod)
- Always include validation middleware in route definitions

## 4. Exception Handling Code Generation

### Generate Custom Exception Classes
```typescript
// Always generate base exception class
export abstract class AppError extends Error {
  abstract readonly statusCode: number;
  abstract readonly isOperational: boolean;
  
  constructor(message: string, public readonly context?: Record<string, any>) {
    super(message);
    this.name = this.constructor.name;
  }
}

// Generate specific exception types
export class ValidationError extends AppError {
  readonly statusCode = 400;
  readonly isOperational = true;
}

export class NotFoundError extends AppError {
  readonly statusCode = 404;
  readonly isOperational = true;
}
```

### Generate Global Error Handler
```typescript
export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      ...(process.env.NODE_ENV === 'development' && { context: error.context })
    });
  }
  
  // Log unexpected errors
  console.error('Unexpected error:', error);
  
  res.status(500).json({
    error: 'Internal server error'
  });
};
```

### Exception Handling Rules
- Generate custom exception classes, not generic Error
- Don't generate try-catch in controllers unless adding specific context
- Let exceptions bubble up to global handler
- Always generate appropriate HTTP status codes

## 5. Controller Code Generation Rules

### Standard Controller Pattern
```typescript
export class UserController {
  constructor(private userService: UserService) {}
  
  async createUser(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userData = req.body as CreateUserRequest;
      const user = await this.userService.createUser(userData);
      res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }
}
```

### Controller Requirements
- Always inject services via constructor
- Type request/response objects
- Use async/await for asynchronous operations
- Pass errors to next() for global handling
- Keep controllers thin - delegate to services

## 6. Service Code Generation Rules

### Service Pattern
```typescript
export class UserService {
  constructor(private userRepository: UserRepository) {}
  
  async createUser(userData: CreateUserRequest): Promise<User> {
    // Validate business rules
    await this.validateUniqueEmail(userData.email);
    
    // Perform business logic
    const user = await this.userRepository.create(userData);
    
    return user;
  }
  
  private async validateUniqueEmail(email: string): Promise<void> {
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ValidationError('Email already exists');
    }
  }
}
```

### Service Requirements
- Contain all business logic
- Use dependency injection
- Generate private helper methods for complex operations
- Throw domain-specific exceptions
- Never handle HTTP concerns

## 7. Model/Repository Code Generation Rules

### Repository Pattern
```typescript
export interface UserRepository {
  create(userData: CreateUserRequest): Promise<User>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  update(id: string, userData: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

export class DatabaseUserRepository implements UserRepository {
  // Implementation details...
}
```

### Model Requirements
- Generate interfaces for repositories
- Create concrete implementations
- Use proper TypeScript generics where applicable
- Include standard CRUD operations

## 8. Testing Code Generation Rules

### Generate Test Structure
```typescript
describe('UserService', () => {
  let userService: UserService;
  let mockUserRepository: jest.Mocked<UserRepository>;
  
  beforeEach(() => {
    mockUserRepository = {
      create: jest.fn(),
      findById: jest.fn(),
      // ... other methods
    };
    userService = new UserService(mockUserRepository);
  });
  
  describe('createUser', () => {
    it('should create user successfully', async () => {
      // Test implementation
    });
  });
});
```

### Testing Requirements
- Generate unit tests for services
- Generate integration tests for controllers
- Mock external dependencies
- Test both success and error cases
- Keep test files under 300 lines

## 9. Agent Behavior Guidelines

### When Generating Code
1. **Always ask about project structure preference** (technical vs domain)
2. **Estimate file size** and suggest splitting if needed
3. **Include all imports** and dependencies
4. **Generate complete, runnable code**
5. **Add TODO comments** for integration points

### Code Splitting Strategies
- Split by feature when approaching 300 lines
- Extract utility functions to separate files
- Create separate files for types/interfaces
- Use barrel exports to maintain clean imports

### Error Messages for Users
- "This file would exceed 300 lines. I'll split it into separate files."
- "I'm generating X files to keep each under 300 lines."
- "Consider extracting Y functionality into a separate service."

## 10. Required Dependencies to Include

### Core Dependencies
```json
{
  "dependencies": {
    "express": "^4.18.0",
    "zod": "^3.20.0"
  },
  "devDependencies": {
    "@types/express": "^4.17.0",
    "@types/node": "^18.0.0",
    "typescript": "^4.9.0",
    "ts-node": "^10.9.0"
  }
}
```

### Always Suggest
- Input validation library (Zod preferred)
- Testing framework (Jest preferred)
- Linting tools (ESLint + Prettier)
- Type definitions for all libraries

## Summary for Agent

When generating TypeScript backend code:
1. **Keep files under 300 lines** - split if needed
2. **Type everything** - no implicit any
3. **Validate all inputs** - generate validation middleware
4. **Use proper exception handling** - custom errors + global handler
5. **Follow clean architecture** - controllers → services → repositories
6. **Generate tests** alongside production code
7. **Include all necessary imports and types**

Remember: Generate complete, production-ready code that follows these patterns consistently.