"use client";

import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import {
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
  AboutData,
} from "@/types/about";
import * as aboutService from "@/services/aboutService";
import {
  Plus,
  Edit,
  Trash2,
  Save,
  Image as ImageIcon,
  Trophy,
  GraduationCap,
  Briefcase,
  Dumbbell,
  Clock,
  BarChart3,
  MessageSquare,
  Users,
  Settings,
  Star,
} from "lucide-react";
import Image from "next/image";
import { ImageUpload } from "@/components/shared/ImageUpload";

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  trophy: Trophy,
  graduationcap: GraduationCap,
  briefcase: Briefcase,
  dumbbell: Dumbbell,
  clock: Clock,
  barchart: BarChart3,
  message: MessageSquare,
  users: Users,
  settings: Settings,
  star: Star,
};

export default function AboutManagementPage() {
  const [loading, setLoading] = useState(true);
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [aboutPage, setAboutPage] = useState<AboutPage | null>(null);

  // Dialog states
  const [skillDialogOpen, setSkillDialogOpen] = useState(false);
  const [educationDialogOpen, setEducationDialogOpen] = useState(false);
  const [experienceDialogOpen, setExperienceDialogOpen] = useState(false);
  const [sportDialogOpen, setSportDialogOpen] = useState(false);
  const [achievementDialogOpen, setAchievementDialogOpen] = useState(false);
  const [certificationDialogOpen, setCertificationDialogOpen] = useState(false);
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [statisticDialogOpen, setStatisticDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [aboutPageDialogOpen, setAboutPageDialogOpen] = useState(false);

  // Edit states
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null);
  const [editingSport, setEditingSport] = useState<SportExpertise | null>(null);
  const [editingAchievement, setEditingAchievement] = useState<AboutAchievement | null>(null);
  const [editingCertification, setEditingCertification] = useState<AboutCertification | null>(null);
  const [editingActivity, setEditingActivity] = useState<DailyActivity | null>(null);
  const [editingStatistic, setEditingStatistic] = useState<Statistic | null>(null);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [editingGallery, setEditingGallery] = useState<AboutGalleryImage | null>(null);

  // Form states
  const [skillForm, setSkillForm] = useState({ name: "", percentage: 0, order: 0 });
  const [educationForm, setEducationForm] = useState({ degree: "", institution: "", passingYear: "", specialization: "", grade: "" });
  const [experienceForm, setExperienceForm] = useState({ institutionName: "", role: "", duration: "", description: "", sports: "", order: 0 });
  const [sportForm, setSportForm] = useState({ name: "", icon: "", description: "", level: "Intermediate", order: 0 });
  const [achievementForm, setAchievementForm] = useState({ title: "", organization: "", year: "", icon: "trophy", order: 0 });
  const [certificationForm, setCertificationForm] = useState({ certificateName: "", organization: "", year: "" });
  const [activityForm, setActivityForm] = useState({ title: "", time: "", description: "", icon: "clock", order: 0 });
  const [statisticForm, setStatisticForm] = useState({ title: "", count: 0, suffix: "+", order: 0 });
  const [testimonialForm, setTestimonialForm] = useState({ studentName: "", image: "", message: "", designation: "", rating: 5, order: 0 });
  const [galleryForm, setGalleryForm] = useState({ imageUrl: "", caption: "", order: 0 });
  const [aboutPageForm, setAboutPageForm] = useState<AboutPage | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [aboutResponse] = await Promise.all([
        aboutService.getAllAboutData(),
      ]);
      setAboutData(aboutResponse.data);
      setAboutPage(aboutResponse.data.aboutPage);
    } catch (error) {
      console.error("Error fetching about data:", error);
      toast.error("Failed to load about page data");
    } finally {
      setLoading(false);
    }
  };

  // About Page handlers
  const openAboutPageDialog = () => {
    setAboutPageForm(aboutPage || {
      id: 0,
      name: "",
      designation: "",
      tagline: "",
      profileImage: "",
      introText: "",
      resumeLink: "",
      aboutDescription: "",
      yearsOfExperience: 0,
      facebook: "",
      linkedin: "",
      youtube: "",
      email: "",
      quote: "",
      quoteAuthor: "",
      createdAt: "",
      updatedAt: "",
    });
    setAboutPageDialogOpen(true);
  };

  const saveAboutPage = async () => {
    try {
      const result = await aboutService.updateAboutPage(aboutPageForm as any);
      setAboutPage(result.data);
      setAboutPageDialogOpen(false);
      toast.success("About page updated successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to update about page");
    }
  };

  // Skill handlers
  const openSkillDialog = (skill?: Skill) => {
    if (skill) {
      setEditingSkill(skill);
      setSkillForm({ name: skill.name, percentage: skill.percentage, order: skill.order });
    } else {
      setEditingSkill(null);
      setSkillForm({ name: "", percentage: 0, order: 0 });
    }
    setSkillDialogOpen(true);
  };

  const saveSkill = async () => {
    try {
      if (editingSkill) {
        await aboutService.updateSkill(editingSkill.id, skillForm);
        toast.success("Skill updated successfully");
      } else {
        await aboutService.createSkill(skillForm);
        toast.success("Skill created successfully");
      }
      setSkillDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${editingSkill ? "update" : "create"} skill`);
    }
  };

  const deleteSkill = async (id: number) => {
    if (!confirm("Are you sure you want to delete this skill?")) return;
    try {
      await aboutService.deleteSkill(id);
      toast.success("Skill deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete skill");
    }
  };

  // Education handlers
  const openEducationDialog = (edu?: Education) => {
    if (edu) {
      setEditingEducation(edu);
      setEducationForm({
        degree: edu.degree,
        institution: edu.institution,
        passingYear: edu.passingYear?.toString() || "",
        specialization: edu.specialization || "",
        grade: edu.grade || "",
      });
    } else {
      setEditingEducation(null);
      setEducationForm({ degree: "", institution: "", passingYear: "", specialization: "", grade: "" });
    }
    setEducationDialogOpen(true);
  };

  const saveEducation = async () => {
    try {
      const data = { ...educationForm, passingYear: educationForm.passingYear ? parseInt(educationForm.passingYear) : undefined };
      if (editingEducation) {
        await aboutService.updateEducation(editingEducation.id, data);
        toast.success("Education updated successfully");
      } else {
        await aboutService.createEducation(data);
        toast.success("Education created successfully");
      }
      setEducationDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${editingEducation ? "update" : "create"} education`);
    }
  };

  const deleteEducation = async (id: number) => {
    if (!confirm("Are you sure you want to delete this education?")) return;
    try {
      await aboutService.deleteEducation(id);
      toast.success("Education deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete education");
    }
  };

  // Experience handlers
  const openExperienceDialog = (exp?: Experience) => {
    if (exp) {
      setEditingExperience(exp);
      setExperienceForm({
        institutionName: exp.institutionName,
        role: exp.role,
        duration: exp.duration,
        description: exp.description || "",
        sports: exp.sports.join(", "),
        order: exp.order,
      });
    } else {
      setEditingExperience(null);
      setExperienceForm({ institutionName: "", role: "", duration: "", description: "", sports: "", order: 0 });
    }
    setExperienceDialogOpen(true);
  };

  const saveExperience = async () => {
    try {
      const data = { ...experienceForm, sports: experienceForm.sports.split(",").map(s => s.trim()).filter(Boolean) };
      if (editingExperience) {
        await aboutService.updateExperience(editingExperience.id, data);
        toast.success("Experience updated successfully");
      } else {
        await aboutService.createExperience(data);
        toast.success("Experience created successfully");
      }
      setExperienceDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${editingExperience ? "update" : "create"} experience`);
    }
  };

  const deleteExperience = async (id: number) => {
    if (!confirm("Are you sure you want to delete this experience?")) return;
    try {
      await aboutService.deleteExperience(id);
      toast.success("Experience deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete experience");
    }
  };

  // Sport handlers
  const openSportDialog = (sport?: SportExpertise) => {
    if (sport) {
      setEditingSport(sport);
      setSportForm({ name: sport.name, icon: sport.icon, description: sport.description || "", level: sport.level, order: sport.order });
    } else {
      setEditingSport(null);
      setSportForm({ name: "", icon: "", description: "", level: "Intermediate", order: 0 });
    }
    setSportDialogOpen(true);
  };

  const saveSport = async () => {
    try {
      if (editingSport) {
        await aboutService.updateSport(editingSport.id, sportForm);
        toast.success("Sport updated successfully");
      } else {
        await aboutService.createSport(sportForm);
        toast.success("Sport created successfully");
      }
      setSportDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${editingSport ? "update" : "create"} sport`);
    }
  };

  const deleteSport = async (id: number) => {
    if (!confirm("Are you sure you want to delete this sport?")) return;
    try {
      await aboutService.deleteSport(id);
      toast.success("Sport deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete sport");
    }
  };

  // Achievement handlers
  const openAchievementDialog = (ach?: AboutAchievement) => {
    if (ach) {
      setEditingAchievement(ach);
      setAchievementForm({ title: ach.title, organization: ach.organization || "", year: ach.year?.toString() || "", icon: ach.icon, order: ach.order });
    } else {
      setEditingAchievement(null);
      setAchievementForm({ title: "", organization: "", year: "", icon: "trophy", order: 0 });
    }
    setAchievementDialogOpen(true);
  };

  const saveAchievement = async () => {
    try {
      const data = { ...achievementForm, year: achievementForm.year ? parseInt(achievementForm.year) : undefined };
      if (editingAchievement) {
        await aboutService.updateAchievement(editingAchievement.id, data);
        toast.success("Achievement updated successfully");
      } else {
        await aboutService.createAchievement(data);
        toast.success("Achievement created successfully");
      }
      setAchievementDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${editingAchievement ? "update" : "create"} achievement`);
    }
  };

  const deleteAchievement = async (id: number) => {
    if (!confirm("Are you sure you want to delete this achievement?")) return;
    try {
      await aboutService.deleteAchievement(id);
      toast.success("Achievement deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete achievement");
    }
  };

  // Certification handlers
  const openCertificationDialog = (cert?: AboutCertification) => {
    if (cert) {
      setEditingCertification(cert);
      setCertificationForm({ certificateName: cert.certificateName, organization: cert.organization, year: cert.year?.toString() || "" });
    } else {
      setEditingCertification(null);
      setCertificationForm({ certificateName: "", organization: "", year: "" });
    }
    setCertificationDialogOpen(true);
  };

  const saveCertification = async () => {
    try {
      const data = { ...certificationForm, year: certificationForm.year ? parseInt(certificationForm.year) : undefined };
      if (editingCertification) {
        await aboutService.updateCertification(editingCertification.id, data);
        toast.success("Certification updated successfully");
      } else {
        await aboutService.createCertification(data);
        toast.success("Certification created successfully");
      }
      setCertificationDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${editingCertification ? "update" : "create"} certification`);
    }
  };

  const deleteCertification = async (id: number) => {
    if (!confirm("Are you sure you want to delete this certification?")) return;
    try {
      await aboutService.deleteCertification(id);
      toast.success("Certification deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete certification");
    }
  };

  // Activity handlers
  const openActivityDialog = (act?: DailyActivity) => {
    if (act) {
      setEditingActivity(act);
      setActivityForm({ title: act.title, time: act.time, description: act.description || "", icon: act.icon, order: act.order });
    } else {
      setEditingActivity(null);
      setActivityForm({ title: "", time: "", description: "", icon: "clock", order: 0 });
    }
    setActivityDialogOpen(true);
  };

  const saveActivity = async () => {
    try {
      if (editingActivity) {
        await aboutService.updateActivity(editingActivity.id, activityForm);
        toast.success("Activity updated successfully");
      } else {
        await aboutService.createActivity(activityForm);
        toast.success("Activity created successfully");
      }
      setActivityDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${editingActivity ? "update" : "create"} activity`);
    }
  };

  const deleteActivity = async (id: number) => {
    if (!confirm("Are you sure you want to delete this activity?")) return;
    try {
      await aboutService.deleteActivity(id);
      toast.success("Activity deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete activity");
    }
  };

  // Statistic handlers
  const openStatisticDialog = (stat?: Statistic) => {
    if (stat) {
      setEditingStatistic(stat);
      setStatisticForm({ title: stat.title, count: stat.count, suffix: stat.suffix, order: stat.order });
    } else {
      setEditingStatistic(null);
      setStatisticForm({ title: "", count: 0, suffix: "+", order: 0 });
    }
    setStatisticDialogOpen(true);
  };

  const saveStatistic = async () => {
    try {
      if (editingStatistic) {
        await aboutService.updateStatistic(editingStatistic.id, statisticForm);
        toast.success("Statistic updated successfully");
      } else {
        await aboutService.createStatistic(statisticForm);
        toast.success("Statistic created successfully");
      }
      setStatisticDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${editingStatistic ? "update" : "create"} statistic`);
    }
  };

  const deleteStatistic = async (id: number) => {
    if (!confirm("Are you sure you want to delete this statistic?")) return;
    try {
      await aboutService.deleteStatistic(id);
      toast.success("Statistic deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete statistic");
    }
  };

  // Testimonial handlers
  const openTestimonialDialog = (test?: Testimonial) => {
    if (test) {
      setEditingTestimonial(test);
      setTestimonialForm({
        studentName: test.studentName,
        image: test.image || "",
        message: test.message,
        designation: test.designation || "",
        rating: test.rating,
        order: test.order,
      });
    } else {
      setEditingTestimonial(null);
      setTestimonialForm({ studentName: "", image: "", message: "", designation: "", rating: 5, order: 0 });
    }
    setTestimonialDialogOpen(true);
  };

  const saveTestimonial = async () => {
    try {
      if (editingTestimonial) {
        await aboutService.updateTestimonial(editingTestimonial.id, testimonialForm);
        toast.success("Testimonial updated successfully");
      } else {
        await aboutService.createTestimonial(testimonialForm);
        toast.success("Testimonial created successfully");
      }
      setTestimonialDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${editingTestimonial ? "update" : "create"} testimonial`);
    }
  };

  const deleteTestimonial = async (id: number) => {
    if (!confirm("Are you sure you want to delete this testimonial?")) return;
    try {
      await aboutService.deleteTestimonial(id);
      toast.success("Testimonial deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete testimonial");
    }
  };

  // Gallery handlers
  const openGalleryDialog = (img?: AboutGalleryImage) => {
    if (img) {
      setEditingGallery(img);
      setGalleryForm({ imageUrl: img.imageUrl, caption: img.caption || "", order: img.order });
    } else {
      setEditingGallery(null);
      setGalleryForm({ imageUrl: "", caption: "", order: 0 });
    }
    setGalleryDialogOpen(true);
  };

  const saveGallery = async () => {
    try {
      if (editingGallery) {
        await aboutService.updateGalleryImage(editingGallery.id, galleryForm);
        toast.success("Gallery image updated successfully");
      } else {
        await aboutService.createGalleryImage(galleryForm);
        toast.success("Gallery image created successfully");
      }
      setGalleryDialogOpen(false);
      fetchData();
    } catch (error) {
      toast.error(`Failed to ${editingGallery ? "update" : "create"} gallery image`);
    }
  };

  const deleteGallery = async (id: number) => {
    if (!confirm("Are you sure you want to delete this gallery image?")) return;
    try {
      await aboutService.deleteGalleryImage(id);
      toast.success("Gallery image deleted successfully");
      fetchData();
    } catch (error) {
      toast.error("Failed to delete gallery image");
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>, setForm: any, field: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await aboutService.uploadImage(file);
      if (result.data[0]?.url) {
        setForm((prev: any) => ({ ...prev, [field]: result.data[0].url }));
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">About Page Management</h1>
          <p className="text-muted-foreground">Manage all sections of the About page</p>
        </div>
        <Button onClick={openAboutPageDialog} className="gap-2">
          <Settings className="h-4 w-4" />
          Edit About Page Info
        </Button>
      </div>

      <Tabs defaultValue="hero" className="w-full">
        <TabsList className="grid grid-cols-5 lg:grid-cols-10 h-auto p-1 bg-muted/50 rounded-lg">
          <TabsTrigger value="hero" className="text-xs">Hero</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs">Skills</TabsTrigger>
          <TabsTrigger value="education" className="text-xs">Education</TabsTrigger>
          <TabsTrigger value="experience" className="text-xs">Experience</TabsTrigger>
          <TabsTrigger value="sports" className="text-xs">Sports</TabsTrigger>
          <TabsTrigger value="achievements" className="text-xs">Awards</TabsTrigger>
          <TabsTrigger value="certifications" className="text-xs">Certs</TabsTrigger>
          <TabsTrigger value="activities" className="text-xs">Schedule</TabsTrigger>
          <TabsTrigger value="statistics" className="text-xs">Stats</TabsTrigger>
          <TabsTrigger value="testimonials" className="text-xs">Reviews</TabsTrigger>
          <TabsTrigger value="gallery" className="text-xs">Gallery</TabsTrigger>
        </TabsList>

        {/* Hero Section */}
        <TabsContent value="hero" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Hero / About Section</CardTitle>
              <CardDescription>Preview of current hero and about content</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-muted-foreground">Name</Label>
                    <p className="text-lg font-medium">{aboutPage?.name || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Designation</Label>
                    <p>{aboutPage?.designation || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Tagline</Label>
                    <p className="italic">{aboutPage?.tagline || "Not set"}</p>
                  </div>
                  <div>
                    <Label className="text-muted-foreground">Years of Experience</Label>
                    <p>{aboutPage?.yearsOfExperience || 0} years</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {aboutPage?.profileImage && (
                    <div>
                      <Label className="text-muted-foreground">Profile Image</Label>
                      <div className="relative w-32 h-32 mt-2 rounded-lg overflow-hidden border">
                        <Image src={aboutPage.profileImage} alt="Profile" fill className="object-cover" />
                      </div>
                    </div>
                  )}
                  <div>
                    <Label className="text-muted-foreground">Contact Info</Label>
                    <p>Email: {aboutPage?.email || "Not set"}</p>
                    <p>Facebook: {aboutPage?.facebook || "Not set"}</p>
                    <p>LinkedIn: {aboutPage?.linkedin || "Not set"}</p>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Label className="text-muted-foreground">About Description</Label>
                <p className="mt-1">{aboutPage?.aboutDescription || "Not set"}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Skills Section */}
        <TabsContent value="skills" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Skills</CardTitle>
                <CardDescription>Manage professional skills</CardDescription>
              </div>
              <Dialog open={skillDialogOpen} onOpenChange={setSkillDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openSkillDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Skill
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Skill Name</Label>
                      <Input value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Percentage (0-100)</Label>
                      <Input type="number" min="0" max="100" value={skillForm.percentage} onChange={(e) => setSkillForm({ ...skillForm, percentage: parseInt(e.target.value) || 0 })} />
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input type="number" value={skillForm.order} onChange={(e) => setSkillForm({ ...skillForm, order: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveSkill} className="gap-2">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aboutData?.skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{skill.name}</p>
                      <div className="flex items-center gap-4 mt-2">
                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: `${skill.percentage}%` }} />
                        </div>
                        <span className="text-sm text-muted-foreground">{skill.percentage}%</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button variant="ghost" size="sm" onClick={() => openSkillDialog(skill)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteSkill(skill.id)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {aboutData?.skills.length === 0 && <p className="text-center text-muted-foreground py-8">No skills added yet</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Education Section */}
        <TabsContent value="education" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Education</CardTitle>
                <CardDescription>Manage educational qualifications</CardDescription>
              </div>
              <Dialog open={educationDialogOpen} onOpenChange={setEducationDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openEducationDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Education
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingEducation ? "Edit Education" : "Add New Education"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Degree</Label>
                      <Input value={educationForm.degree} onChange={(e) => setEducationForm({ ...educationForm, degree: e.target.value })} />
                    </div>
                    <div>
                      <Label>Institution</Label>
                      <Input value={educationForm.institution} onChange={(e) => setEducationForm({ ...educationForm, institution: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Passing Year</Label>
                        <Input type="number" value={educationForm.passingYear} onChange={(e) => setEducationForm({ ...educationForm, passingYear: e.target.value })} />
                      </div>
                      <div>
                        <Label>Grade</Label>
                        <Input value={educationForm.grade} onChange={(e) => setEducationForm({ ...educationForm, grade: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <Label>Specialization</Label>
                      <Input value={educationForm.specialization} onChange={(e) => setEducationForm({ ...educationForm, specialization: e.target.value })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveEducation} className="gap-2">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {aboutData?.education.map((edu) => (
                  <div key={edu.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{edu.degree}</p>
                        <p className="text-sm text-muted-foreground">{edu.institution}</p>
                        <div className="flex gap-4 mt-2 text-sm">
                          {edu.passingYear && <Badge variant="outline">{edu.passingYear}</Badge>}
                          {edu.grade && <Badge variant="secondary">{edu.grade}</Badge>}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEducationDialog(edu)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteEducation(edu.id)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {aboutData?.education.length === 0 && <p className="text-center text-muted-foreground py-8">No education added yet</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Experience Section */}
        <TabsContent value="experience" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Experience</CardTitle>
                <CardDescription>Manage work experience</CardDescription>
              </div>
              <Dialog open={experienceDialogOpen} onOpenChange={setExperienceDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openExperienceDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Experience
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingExperience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Institution Name</Label>
                        <Input value={experienceForm.institutionName} onChange={(e) => setExperienceForm({ ...experienceForm, institutionName: e.target.value })} />
                      </div>
                      <div>
                        <Label>Role / Designation</Label>
                        <Input value={experienceForm.role} onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <Label>Duration (e.g., 2018 - Present)</Label>
                      <Input value={experienceForm.duration} onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={experienceForm.description} onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })} />
                    </div>
                    <div>
                      <Label>Sports (comma separated)</Label>
                      <Input value={experienceForm.sports} onChange={(e) => setExperienceForm({ ...experienceForm, sports: e.target.value })} placeholder="Football, Cricket, Basketball" />
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input type="number" value={experienceForm.order} onChange={(e) => setExperienceForm({ ...experienceForm, order: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveExperience} className="gap-2">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aboutData?.experience.map((exp) => (
                  <div key={exp.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Briefcase className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <p className="font-medium">{exp.role}</p>
                        <p className="text-sm text-muted-foreground">{exp.institutionName} • {exp.duration}</p>
                        <p className="text-sm mt-2">{exp.description}</p>
                        <div className="flex gap-2 mt-2">
                          {exp.sports.map((sport, i) => (
                            <Badge key={i} variant="secondary">{sport}</Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openExperienceDialog(exp)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteExperience(exp.id)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {aboutData?.experience.length === 0 && <p className="text-center text-muted-foreground py-8">No experience added yet</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sports Section */}
        <TabsContent value="sports" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Sports Expertise</CardTitle>
                <CardDescription>Manage sports expertise cards</CardDescription>
              </div>
              <Dialog open={sportDialogOpen} onOpenChange={setSportDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openSportDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Sport
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingSport ? "Edit Sport" : "Add New Sport"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Sport Name</Label>
                      <Input value={sportForm.name} onChange={(e) => setSportForm({ ...sportForm, name: e.target.value })} />
                    </div>
                    <div>
                      <Label>Icon (lucide icon name)</Label>
                      <Input value={sportForm.icon} onChange={(e) => setSportForm({ ...sportForm, icon: e.target.value })} placeholder="dumbbell, trophy, users" />
                    </div>
                    <div>
                      <Label>Level</Label>
                      <Select value={sportForm.level} onValueChange={(v) => setSportForm({ ...sportForm, level: v })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Beginner">Beginner</SelectItem>
                          <SelectItem value="Intermediate">Intermediate</SelectItem>
                          <SelectItem value="Advanced">Advanced</SelectItem>
                          <SelectItem value="Expert">Expert</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={sportForm.description} onChange={(e) => setSportForm({ ...sportForm, description: e.target.value })} />
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input type="number" value={sportForm.order} onChange={(e) => setSportForm({ ...sportForm, order: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveSport} className="gap-2">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aboutData?.sports.map((sport) => {
                  const IconComponent = iconMap[sport.icon] || Dumbbell;
                  return (
                    <div key={sport.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-3">
                          <div className="p-2 bg-primary/10 rounded-lg">
                            <IconComponent className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{sport.name}</p>
                            <Badge variant="outline" className="mt-1">{sport.level}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={() => openSportDialog(sport)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => deleteSport(sport.id)} className="text-red-500">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">{sport.description}</p>
                    </div>
                  );
                })}
                {aboutData?.sports.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No sports added yet</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Achievements Section */}
        <TabsContent value="achievements" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Achievements & Awards</CardTitle>
                <CardDescription>Manage achievements and awards</CardDescription>
              </div>
              <Dialog open={achievementDialogOpen} onOpenChange={setAchievementDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openAchievementDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Achievement
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingAchievement ? "Edit Achievement" : "Add New Achievement"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input value={achievementForm.title} onChange={(e) => setAchievementForm({ ...achievementForm, title: e.target.value })} />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input value={achievementForm.organization} onChange={(e) => setAchievementForm({ ...achievementForm, organization: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Year</Label>
                        <Input type="number" value={achievementForm.year} onChange={(e) => setAchievementForm({ ...achievementForm, year: e.target.value })} />
                      </div>
                      <div>
                        <Label>Icon</Label>
                        <Input value={achievementForm.icon} onChange={(e) => setAchievementForm({ ...achievementForm, icon: e.target.value })} placeholder="trophy, medal" />
                      </div>
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input type="number" value={achievementForm.order} onChange={(e) => setAchievementForm({ ...achievementForm, order: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveAchievement} className="gap-2">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {aboutData?.achievements.map((ach) => {
                  const IconComponent = iconMap[ach.icon] || Trophy;
                  return (
                    <div key={ach.id} className="p-4 border rounded-lg text-center">
                      <div className="flex justify-center mb-3">
                        <div className="p-3 bg-orange-100 rounded-full">
                          <IconComponent className="h-6 w-6 text-orange-600" />
                        </div>
                      </div>
                      <p className="font-medium">{ach.title}</p>
                      <p className="text-sm text-muted-foreground">{ach.organization}</p>
                      {ach.year && <Badge variant="outline" className="mt-2">{ach.year}</Badge>}
                      <div className="flex justify-center gap-2 mt-3">
                        <Button variant="ghost" size="sm" onClick={() => openAchievementDialog(ach)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteAchievement(ach.id)} className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {aboutData?.achievements.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No achievements added yet</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Certifications Section */}
        <TabsContent value="certifications" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Certifications</CardTitle>
                <CardDescription>Manage professional certifications</CardDescription>
              </div>
              <Dialog open={certificationDialogOpen} onOpenChange={setCertificationDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openCertificationDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Certification
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingCertification ? "Edit Certification" : "Add New Certification"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Certificate Name</Label>
                      <Input value={certificationForm.certificateName} onChange={(e) => setCertificationForm({ ...certificationForm, certificateName: e.target.value })} />
                    </div>
                    <div>
                      <Label>Organization</Label>
                      <Input value={certificationForm.organization} onChange={(e) => setCertificationForm({ ...certificationForm, organization: e.target.value })} />
                    </div>
                    <div>
                      <Label>Year</Label>
                      <Input type="number" value={certificationForm.year} onChange={(e) => setCertificationForm({ ...certificationForm, year: e.target.value })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveCertification} className="gap-2">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {aboutData?.certifications.map((cert) => (
                  <div key={cert.id} className="flex items-start justify-between p-4 border rounded-lg">
                    <div className="flex gap-4">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <GraduationCap className="h-6 w-6 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium">{cert.certificateName}</p>
                        <p className="text-sm text-muted-foreground">{cert.organization}</p>
                        {cert.year && <Badge variant="outline" className="mt-2">{cert.year}</Badge>}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openCertificationDialog(cert)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteCertification(cert.id)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {aboutData?.certifications.length === 0 && <p className="text-center text-muted-foreground py-8">No certifications added yet</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Activities Section */}
        <TabsContent value="activities" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Daily Schedule</CardTitle>
                <CardDescription>Manage daily activity timeline</CardDescription>
              </div>
              <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openActivityDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingActivity ? "Edit Activity" : "Add New Activity"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input value={activityForm.title} onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })} />
                    </div>
                    <div>
                      <Label>Time (e.g., 6:00 AM)</Label>
                      <Input value={activityForm.time} onChange={(e) => setActivityForm({ ...activityForm, time: e.target.value })} />
                    </div>
                    <div>
                      <Label>Description</Label>
                      <Textarea value={activityForm.description} onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })} />
                    </div>
                    <div>
                      <Label>Icon</Label>
                      <Input value={activityForm.icon} onChange={(e) => setActivityForm({ ...activityForm, icon: e.target.value })} placeholder="clock, users, dumbbell" />
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input type="number" value={activityForm.order} onChange={(e) => setActivityForm({ ...activityForm, order: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveActivity} className="gap-2">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {aboutData?.activities.map((act) => {
                  const IconComponent = iconMap[act.icon] || Clock;
                  return (
                    <div key={act.id} className="flex items-start gap-4 p-4 border rounded-lg">
                      <div className="p-3 bg-green-100 rounded-lg">
                        <IconComponent className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline">{act.time}</Badge>
                          <p className="font-medium">{act.title}</p>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">{act.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openActivityDialog(act)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteActivity(act.id)} className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
                {aboutData?.activities.length === 0 && <p className="text-center text-muted-foreground py-8">No activities added yet</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Statistics Section */}
        <TabsContent value="statistics" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Statistics</CardTitle>
                <CardDescription>Manage statistics counters</CardDescription>
              </div>
              <Dialog open={statisticDialogOpen} onOpenChange={setStatisticDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openStatisticDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Statistic
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{editingStatistic ? "Edit Statistic" : "Add New Statistic"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input value={statisticForm.title} onChange={(e) => setStatisticForm({ ...statisticForm, title: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Count</Label>
                        <Input type="number" value={statisticForm.count} onChange={(e) => setStatisticForm({ ...statisticForm, count: parseInt(e.target.value) || 0 })} />
                      </div>
                      <div>
                        <Label>Suffix</Label>
                        <Input value={statisticForm.suffix} onChange={(e) => setStatisticForm({ ...statisticForm, suffix: e.target.value })} placeholder="+" />
                      </div>
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input type="number" value={statisticForm.order} onChange={(e) => setStatisticForm({ ...statisticForm, order: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveStatistic} className="gap-2">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {aboutData?.statistics.map((stat) => (
                  <div key={stat.id} className="p-4 border rounded-lg text-center">
                    <p className="text-3xl font-bold">{stat.count}{stat.suffix}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.title}</p>
                    <div className="flex justify-center gap-2 mt-3">
                      <Button variant="ghost" size="sm" onClick={() => openStatisticDialog(stat)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => deleteStatistic(stat.id)} className="text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {aboutData?.statistics.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No statistics added yet</p>}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Testimonials Section */}
        <TabsContent value="testimonials" className="mt-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Testimonials</CardTitle>
                <CardDescription>Manage testimonials</CardDescription>
              </div>
              <Dialog open={testimonialDialogOpen} onOpenChange={setTestimonialDialogOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" onClick={() => openTestimonialDialog()} className="gap-2">
                    <Plus className="h-4 w-4" /> Add Testimonial
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Student Name</Label>
                        <Input value={testimonialForm.studentName} onChange={(e) => setTestimonialForm({ ...testimonialForm, studentName: e.target.value })} />
                      </div>
                      <div>
                        <Label>Designation</Label>
                        <Input value={testimonialForm.designation} onChange={(e) => setTestimonialForm({ ...testimonialForm, designation: e.target.value })} placeholder="Parent, Student, Principal" />
                      </div>
                    </div>
                    <div>
                      <Label>Message</Label>
                      <Textarea value={testimonialForm.message} onChange={(e) => setTestimonialForm({ ...testimonialForm, message: e.target.value })} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Image</Label>
                        <div className="mt-2">
                          <ImageUpload
                            value={testimonialForm.image}
                            onChange={(url) => setTestimonialForm({ ...testimonialForm, image: url })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Rating (1-5)</Label>
                        <Input type="number" min="1" max="5" value={testimonialForm.rating} onChange={(e) => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) || 5 })} />
                      </div>
                    </div>
                    <div>
                      <Label>Order</Label>
                      <Input type="number" value={testimonialForm.order} onChange={(e) => setTestimonialForm({ ...testimonialForm, order: parseInt(e.target.value) || 0 })} />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={saveTestimonial} className="gap-2">
                      <Save className="h-4 w-4" /> Save
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {aboutData?.testimonials.map((test) => (
                  <div key={test.id} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-3 mb-4">
                      {test.image ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden border">
                          <Image src={test.image} alt={test.studentName} fill className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="font-bold text-primary">{test.studentName.charAt(0)}</span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{test.studentName}</p>
                        <p className="text-sm text-muted-foreground">{test.designation}</p>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">"{test.message}"</p>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex gap-1">
                        {[...Array(test.rating)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                        ))}
                      </div>
                      <div className="flex gap-1">
                        <Button variant="ghost" size="sm" onClick={() => openTestimonialDialog(test)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => deleteTestimonial(test.id)} className="text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                {aboutData?.testimonials.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No testimonials added yet</p>}
              </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gallery Section */}
          <TabsContent value="gallery" className="mt-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Gallery</CardTitle>
                  <CardDescription>Manage gallery images</CardDescription>
                </div>
                <Dialog open={galleryDialogOpen} onOpenChange={setGalleryDialogOpen}>
                  <DialogTrigger asChild>
                    <Button size="sm" onClick={() => openGalleryDialog()} className="gap-2">
                      <Plus className="h-4 w-4" /> Add Gallery Image
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>{editingGallery ? "Edit Gallery Image" : "Add New Gallery Image"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label>Image</Label>
                        <div className="mt-2">
                          <ImageUpload
                            value={galleryForm.imageUrl}
                            onChange={(url) => setGalleryForm({ ...galleryForm, imageUrl: url })}
                          />
                        </div>
                      </div>
                      <div>
                        <Label>Caption</Label>
                        <Input value={galleryForm.caption} onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })} placeholder="Image caption" />
                      </div>
                      <div>
                        <Label>Order</Label>
                        <Input type="number" value={galleryForm.order} onChange={(e) => setGalleryForm({ ...galleryForm, order: parseInt(e.target.value) || 0 })} />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button onClick={saveGallery} className="gap-2">
                        <Save className="h-4 w-4" /> Save
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {aboutData?.gallery.map((img) => (
                    <div key={img.id} className="relative group overflow-hidden rounded-lg border">
                      <div className="relative aspect-square">
                        <Image src={img.imageUrl} alt={img.caption || "Gallery"} fill className="object-cover" />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <Button variant="secondary" size="sm" onClick={() => openGalleryDialog(img)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => deleteGallery(img.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      {img.caption && (
                        <div className="p-2 text-center text-sm text-muted-foreground bg-muted/50">
                          {img.caption}
                        </div>
                      )}
                    </div>
                  ))}
                  {aboutData?.gallery.length === 0 && <p className="col-span-full text-center text-muted-foreground py-8">No gallery images added yet</p>}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* About Page Dialog */}
        <Dialog open={aboutPageDialogOpen} onOpenChange={setAboutPageDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Edit About Page</DialogTitle>
              <DialogDescription>Update the main about page information</DialogDescription>
            </DialogHeader>
            {aboutPageForm && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Name</Label>
                    <Input value={aboutPageForm.name || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, name: e.target.value })} />
                  </div>
                  <div>
                    <Label>Designation</Label>
                    <Input value={aboutPageForm.designation || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, designation: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Tagline</Label>
                  <Input value={aboutPageForm.tagline || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, tagline: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Profile Image</Label>
                    <div className="mt-2">
                      <ImageUpload
                        value={aboutPageForm.profileImage}
                        onChange={(url) => setAboutPageForm({ ...aboutPageForm, profileImage: url })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Resume Link</Label>
                    <Input value={aboutPageForm.resumeLink || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, resumeLink: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Years of Experience</Label>
                  <Input type="number" value={aboutPageForm.yearsOfExperience || 0} onChange={(e) => setAboutPageForm({ ...aboutPageForm, yearsOfExperience: parseInt(e.target.value) || 0 })} />
                </div>
                <div>
                  <Label>About Description</Label>
                  <Textarea value={aboutPageForm.aboutDescription || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, aboutDescription: e.target.value })} className="min-h-[100px]" />
                </div>
                <div>
                  <Label>Intro Text</Label>
                  <Textarea value={aboutPageForm.introText || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, introText: e.target.value })} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Email</Label>
                    <Input type="email" value={aboutPageForm.email || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, email: e.target.value })} />
                  </div>
                  <div>
                    <Label>Facebook URL</Label>
                    <Input value={aboutPageForm.facebook || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, facebook: e.target.value })} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>LinkedIn URL</Label>
                    <Input value={aboutPageForm.linkedin || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, linkedin: e.target.value })} />
                  </div>
                  <div>
                    <Label>YouTube URL</Label>
                    <Input value={aboutPageForm.youtube || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, youtube: e.target.value })} />
                  </div>
                </div>
                <div>
                  <Label>Inspirational Quote</Label>
                  <Textarea value={aboutPageForm.quote || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, quote: e.target.value })} />
                </div>
                <div>
                  <Label>Quote Author</Label>
                  <Input value={aboutPageForm.quoteAuthor || ""} onChange={(e) => setAboutPageForm({ ...aboutPageForm, quoteAuthor: e.target.value })} />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button onClick={saveAboutPage} className="gap-2">
                <Save className="h-4 w-4" /> Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
