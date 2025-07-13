export interface User {
  id: string;
  userCode: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isActive: boolean;
  createdAtUtc: Date | null;
  lastLoginAtUtc: Date | null;
}