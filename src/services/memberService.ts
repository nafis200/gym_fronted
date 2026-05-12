import api from "@/lib/axios";
import { TeamMember, MemberFilters, MemberStats, PaginatedResponse, MemberFormData } from "@/types/member";

export const memberService = {
  getAllMembers: async (filters?: MemberFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.memberType) params.append("memberType", filters.memberType);
    if (filters?.status) params.append("status", filters.status);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    const { data } = await api.get<PaginatedResponse<TeamMember>>(`/members?${params.toString()}`);
    return data;
  },

  getMember: async (id: number) => {
    const { data } = await api.get<TeamMember>(`/members/${id}`);
    return data;
  },

  getStats: async () => {
    const { data } = await api.get<MemberStats>("/members/stats");
    return data;
  },

  getFaculty: async () => {
    const { data } = await api.get<TeamMember[]>("/members/faculty");
    return data;
  },

  getStudents: async (filters?: MemberFilters) => {
    const params = new URLSearchParams();
    if (filters?.search) params.append("search", filters.search);
    if (filters?.memberType) params.append("memberType", filters.memberType);
    if (filters?.page) params.append("page", String(filters.page));
    if (filters?.limit) params.append("limit", String(filters.limit));
    const { data } = await api.get<PaginatedResponse<TeamMember>>(`/members/students?${params.toString()}`);
    return data;
  },

  createMember: async (payload: MemberFormData) => {
    const { data } = await api.post<TeamMember>("/members", payload);
    return data;
  },

  updateMember: async (id: number, payload: Partial<MemberFormData>) => {
    const { data } = await api.put<TeamMember>(`/members/${id}`, payload);
    return data;
  },

  deleteMember: async (id: number) => {
    await api.delete(`/members/${id}`);
  },
};