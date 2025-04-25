export interface JwtPayload {
    email: string;
    sub: number; // User ID
    role: 'user' | 'admin'; // User role
  }
  