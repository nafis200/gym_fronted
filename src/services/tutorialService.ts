import api from "@/lib/axios";
import { TutorialApiResponse, SingleTutorialApiResponse } from "@/types/tutorial";

export const tutorialService = {
  getAll: async (): Promise<TutorialApiResponse> => {
    const { data } = await api.get<TutorialApiResponse>("/video");
    return data;
  },

  getById: async (id: string): Promise<SingleTutorialApiResponse> => {
    const { data } = await api.get<SingleTutorialApiResponse>(`/video/${id}`);
    return data;
  },
};
