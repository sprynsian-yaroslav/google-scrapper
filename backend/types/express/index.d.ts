import 'express-session';
import 'express';

declare module 'express-session' {
  interface SessionData {
    user: { userId: string; email: string };
  }
}

declare module 'express-serve-static-core' {
  interface Request {
    session: Session & Partial<SessionData>;
  }
}