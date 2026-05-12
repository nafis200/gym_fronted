export type MemberType = "FACULTY" | "STUDENT" | "ATHLETE" | "CAPTAIN" | "ALUMNI";

export const memberTypeLabels: Record<MemberType, string> = {
  FACULTY: "Faculty",
  STUDENT: "BSc Student",
  ATHLETE: "Master Student",
  CAPTAIN: "Lead Researcher",
  ALUMNI: "Alumni",
};

export interface TeamMember {
  id: number;
  name: string;
  email?: string | null;
  profilePhoto?: string | null;
  phone?: string | null;
  memberType: MemberType;
  role?: string | null;
  status: string;
  institution?: string | null;
  expertise: string[];
  achievements: string[];
  highlights?: string | null;
  yearsActive?: number | null;
  graduationYear?: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface MemberFilters {
  search?: string;
  memberType?: string;
  status?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface MemberStats {
  total: number;
  faculty: number;
  student: number;
  athlete: number;
  captain: number;
  alumni: number;
}

export interface MemberFormData {
  name: string;
  email?: string;
  profilePhoto?: string;
  phone?: string;
  memberType: MemberType;
  role?: string;
  institution?: string;
  expertise?: string[];
  achievements?: string[];
  highlights?: string;
  yearsActive?: number;
  graduationYear?: number;
  status?: string;
}