import { Role } from "@/types/Role";

export type User = {
  id: string;
  role: Role;
  email: string;
  fullName: string;
};
