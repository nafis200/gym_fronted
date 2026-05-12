import api from "@/lib/axios";
import {
  AboutData,
  AboutPageFormData,
  SkillFormData,
  EducationFormData,
  ExperienceFormData,
  SportExpertiseFormData,
  AchievementFormData,
  CertificationFormData,
  ActivityFormData,
  StatisticFormData,
  TestimonialFormData,
  GalleryImageFormData,
  AboutPage,
  Skill,
  Education,
  Experience,
  SportExpertise,
  AboutAchievement,
  AboutCertification,
  DailyActivity,
  Statistic,
  Testimonial,
  AboutGalleryImage,
} from "@/types/about";

// Get All About Data (for public page)
export const getAllAboutData = async (): Promise<{ data: AboutData }> => {
  const res = await api.get("/about/all");
  return res.data;
};

// About Page
export const getAboutPage = async (): Promise<{ data: AboutPage | null }> => {
  const res = await api.get("/about/about-page");
  return res.data;
};

export const updateAboutPage = async (data: AboutPageFormData): Promise<{ data: AboutPage }> => {
  const res = await api.put("/about/about-page", data);
  return res.data;
};

// Skills
export const getSkills = async (): Promise<{ data: Skill[] }> => {
  const res = await api.get("/about/skills");
  return res.data;
};

export const createSkill = async (data: SkillFormData): Promise<{ data: Skill }> => {
  const res = await api.post("/about/skills", data);
  return res.data;
};

export const updateSkill = async (id: number, data: SkillFormData): Promise<{ data: Skill }> => {
  const res = await api.put(`/about/skills/${id}`, data);
  return res.data;
};

export const deleteSkill = async (id: number): Promise<void> => {
  await api.delete(`/about/skills/${id}`);
};

// Education
export const getEducation = async (): Promise<{ data: Education[] }> => {
  const res = await api.get("/about/education");
  return res.data;
};

export const createEducation = async (data: EducationFormData): Promise<{ data: Education }> => {
  const res = await api.post("/about/education", data);
  return res.data;
};

export const updateEducation = async (id: number, data: EducationFormData): Promise<{ data: Education }> => {
  const res = await api.put(`/about/education/${id}`, data);
  return res.data;
};

export const deleteEducation = async (id: number): Promise<void> => {
  await api.delete(`/about/education/${id}`);
};

// Experience
export const getExperience = async (): Promise<{ data: Experience[] }> => {
  const res = await api.get("/about/experience");
  return res.data;
};

export const createExperience = async (data: ExperienceFormData): Promise<{ data: Experience }> => {
  const res = await api.post("/about/experience", data);
  return res.data;
};

export const updateExperience = async (id: number, data: ExperienceFormData): Promise<{ data: Experience }> => {
  const res = await api.put(`/about/experience/${id}`, data);
  return res.data;
};

export const deleteExperience = async (id: number): Promise<void> => {
  await api.delete(`/about/experience/${id}`);
};

// Sports Expertise
export const getSports = async (): Promise<{ data: SportExpertise[] }> => {
  const res = await api.get("/about/sports");
  return res.data;
};

export const createSport = async (data: SportExpertiseFormData): Promise<{ data: SportExpertise }> => {
  const res = await api.post("/about/sports", data);
  return res.data;
};

export const updateSport = async (id: number, data: SportExpertiseFormData): Promise<{ data: SportExpertise }> => {
  const res = await api.put(`/about/sports/${id}`, data);
  return res.data;
};

export const deleteSport = async (id: number): Promise<void> => {
  await api.delete(`/about/sports/${id}`);
};

// Achievements
export const getAchievements = async (): Promise<{ data: AboutAchievement[] }> => {
  const res = await api.get("/about/achievements");
  return res.data;
};

export const createAchievement = async (data: AchievementFormData): Promise<{ data: AboutAchievement }> => {
  const res = await api.post("/about/achievements", data);
  return res.data;
};

export const updateAchievement = async (id: number, data: AchievementFormData): Promise<{ data: AboutAchievement }> => {
  const res = await api.put(`/about/achievements/${id}`, data);
  return res.data;
};

export const deleteAchievement = async (id: number): Promise<void> => {
  await api.delete(`/about/achievements/${id}`);
};

// Certifications
export const getCertifications = async (): Promise<{ data: AboutCertification[] }> => {
  const res = await api.get("/about/certifications");
  return res.data;
};

export const createCertification = async (data: CertificationFormData): Promise<{ data: AboutCertification }> => {
  const res = await api.post("/about/certifications", data);
  return res.data;
};

export const updateCertification = async (id: number, data: CertificationFormData): Promise<{ data: AboutCertification }> => {
  const res = await api.put(`/about/certifications/${id}`, data);
  return res.data;
};

export const deleteCertification = async (id: number): Promise<void> => {
  await api.delete(`/about/certifications/${id}`);
};

// Daily Activities
export const getActivities = async (): Promise<{ data: DailyActivity[] }> => {
  const res = await api.get("/about/activities");
  return res.data;
};

export const createActivity = async (data: ActivityFormData): Promise<{ data: DailyActivity }> => {
  const res = await api.post("/about/activities", data);
  return res.data;
};

export const updateActivity = async (id: number, data: ActivityFormData): Promise<{ data: DailyActivity }> => {
  const res = await api.put(`/about/activities/${id}`, data);
  return res.data;
};

export const deleteActivity = async (id: number): Promise<void> => {
  await api.delete(`/about/activities/${id}`);
};

// Statistics
export const getStatistics = async (): Promise<{ data: Statistic[] }> => {
  const res = await api.get("/about/statistics");
  return res.data;
};

export const createStatistic = async (data: StatisticFormData): Promise<{ data: Statistic }> => {
  const res = await api.post("/about/statistics", data);
  return res.data;
};

export const updateStatistic = async (id: number, data: StatisticFormData): Promise<{ data: Statistic }> => {
  const res = await api.put(`/about/statistics/${id}`, data);
  return res.data;
};

export const deleteStatistic = async (id: number): Promise<void> => {
  await api.delete(`/about/statistics/${id}`);
};

// Testimonials
export const getTestimonials = async (): Promise<{ data: Testimonial[] }> => {
  const res = await api.get("/about/testimonials");
  return res.data;
};

export const createTestimonial = async (data: TestimonialFormData): Promise<{ data: Testimonial }> => {
  const res = await api.post("/about/testimonials", data);
  return res.data;
};

export const updateTestimonial = async (id: number, data: TestimonialFormData): Promise<{ data: Testimonial }> => {
  const res = await api.put(`/about/testimonials/${id}`, data);
  return res.data;
};

export const deleteTestimonial = async (id: number): Promise<void> => {
  await api.delete(`/about/testimonials/${id}`);
};

// Gallery
export const getGallery = async (): Promise<{ data: AboutGalleryImage[] }> => {
  const res = await api.get("/about/gallery");
  return res.data;
};

export const createGalleryImage = async (data: GalleryImageFormData): Promise<{ data: AboutGalleryImage }> => {
  const res = await api.post("/about/gallery", data);
  return res.data;
};

export const updateGalleryImage = async (id: number, data: GalleryImageFormData): Promise<{ data: AboutGalleryImage }> => {
  const res = await api.put(`/about/gallery/${id}`, data);
  return res.data;
};

export const deleteGalleryImage = async (id: number): Promise<void> => {
  await api.delete(`/about/gallery/${id}`);
};

// Image Upload
export const uploadImage = async (file: File): Promise<{ data: { url: string }[] }> => {
  const formData = new FormData();
  formData.append("files", file);
  const res = await api.post("/image/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const aboutService = {
  getAllAboutData,
  getAboutPage,
  updateAboutPage,
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getEducation,
  createEducation,
  updateEducation,
  deleteEducation,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
  getSports,
  createSport,
  updateSport,
  deleteSport,
  getAchievements,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
  getStatistics,
  createStatistic,
  updateStatistic,
  deleteStatistic,
  getTestimonials,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  getGallery,
  createGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  uploadImage,
};
