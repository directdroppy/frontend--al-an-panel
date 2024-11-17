export interface Employee {
  id: string;
  name: string;
  position: string;
  department: string;
  imageUrl: string;
  bio: string;
  email: string;
  socialLinks?: {
    linkedin?: string;
    twitter?: string;
    github?: string;
  };
  skills: string[];
  startDate: string;
}