import { Role } from "./role.model";

export interface User {
    id: number;
    username: string;
    email: string;
    password?: string; 
    roles: Role[];
  }

  export interface UserProfile {
  id: number;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  mobileNo?: string;
  roles?: string[];
  profileImage?: string | null;
  bio?: string | null;
  location?: string | null;
  createdAt?: string | null;
  status?: string | null;
}
