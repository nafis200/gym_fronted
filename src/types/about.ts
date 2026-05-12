export interface AboutPage {
  id: number;
  name?: string;
  designation?: string;
  tagline?: string;
  profileImage?: string;
  introText?: string;
  resumeLink?: string;
  aboutDescription?: string;
  yearsOfExperience?: number;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  email?: string;
  quote?: string;
  quoteAuthor?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Skill {
  id: number;
  name: string;
  percentage: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Education {
  id: number;
  degree: string;
  institution: string;
  passingYear?: number;
  specialization?: string;
  grade?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Experience {
  id: number;
  institutionName: string;
  role: string;
  duration: string;
  description?: string;
  sports: string[];
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface SportExpertise {
  id: number;
  name: string;
  icon: string;
  description?: string;
  level: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AboutAchievement {
  id: number;
  title: string;
  organization?: string;
  year?: number;
  icon: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AboutCertification {
  id: number;
  certificateName: string;
  organization: string;
  year?: number;
  createdAt: string;
  updatedAt: string;
}

export interface DailyActivity {
  id: number;
  title: string;
  time: string;
  description?: string;
  icon: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Statistic {
  id: number;
  title: string;
  count: number;
  suffix: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface Testimonial {
  id: number;
  studentName: string;
  image?: string;
  message: string;
  designation?: string;
  rating: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AboutGalleryImage {
  id: number;
  imageUrl: string;
  caption?: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface AboutData {
  aboutPage: AboutPage | null;
  skills: Skill[];
  education: Education[];
  experience: Experience[];
  sports: SportExpertise[];
  achievements: AboutAchievement[];
  certifications: AboutCertification[];
  activities: DailyActivity[];
  statistics: Statistic[];
  testimonials: Testimonial[];
  gallery: AboutGalleryImage[];
}

// Form Data Types
export interface AboutPageFormData {
  name?: string;
  designation?: string;
  tagline?: string;
  profileImage?: string;
  introText?: string;
  resumeLink?: string;
  aboutDescription?: string;
  yearsOfExperience?: number;
  facebook?: string;
  linkedin?: string;
  youtube?: string;
  email?: string;
  quote?: string;
  quoteAuthor?: string;
}

export interface SkillFormData {
  name: string;
  percentage: number;
  order?: number;
}

export interface EducationFormData {
  degree: string;
  institution: string;
  passingYear?: number;
  specialization?: string;
  grade?: string;
}

export interface ExperienceFormData {
  institutionName: string;
  role: string;
  duration: string;
  description?: string;
  sports?: string[];
  order?: number;
}

export interface SportExpertiseFormData {
  name: string;
  icon: string;
  description?: string;
  level?: string;
  order?: number;
}

export interface AchievementFormData {
  title: string;
  organization?: string;
  year?: number;
  icon?: string;
  order?: number;
}

export interface CertificationFormData {
  certificateName: string;
  organization: string;
  year?: number;
}

export interface ActivityFormData {
  title: string;
  time: string;
  description?: string;
  icon?: string;
  order?: number;
}

export interface StatisticFormData {
  title: string;
  count: number;
  suffix?: string;
  order?: number;
}

export interface TestimonialFormData {
  studentName: string;
  image?: string;
  message: string;
  designation?: string;
  rating?: number;
  order?: number;
}

export interface GalleryImageFormData {
  imageUrl: string;
  caption?: string;
  order?: number;
}
