export interface Tutorial {
  id: string;
  title: string;
  videoLink: string;
  createdAt: string;
  updatedAt: string;
}

export interface TutorialApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: Tutorial[];
}

export interface SingleTutorialApiResponse {
  success: boolean;
  status: number;
  message: string;
  data: Tutorial;
}
