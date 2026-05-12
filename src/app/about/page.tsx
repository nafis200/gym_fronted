"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { aboutService } from "@/services/aboutService";
import {
  Download,
  Mail,
  Activity,
  GraduationCap,
  Briefcase,
  Trophy,
  Clock,
  Star,
  Quote,
  Dumbbell,
  Target,
  Users,
  Award,
  Medal,
  Flame,
  Facebook,
  Linkedin,
  Youtube,
  Heart,
  Shield,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function AboutPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const result = await aboutService.getAllAboutData();
        console.log("About page data fetched:", result);
        setData(result);
      } catch (err) {
        setError("Failed to load about page data");
        console.error("About page fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <AboutLoadingSkeleton />;
  if (error) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="p-8 text-center max-w-md">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </Card>
    </div>
  );

  const { aboutPage, skills, education, experience, sports, achievements, certifications, activities, statistics, testimonials, gallery } = data || {};

  return (
    <div className="min-h-screen bg-background">
      <HeroSection aboutPage={aboutPage} />
      <AboutMeSection aboutPage={aboutPage} />
      <StatisticsSection statistics={statistics} />
      <ExperienceSection experience={experience} />
      <EducationSection education={education} certifications={certifications} />
      <SkillsSection skills={skills} />
      <SportsExpertiseSection sports={sports} />
      <AchievementsSection achievements={achievements} />
      <ActivitiesTimeline activities={activities} />
      <CareerJourneySection education={education} experience={experience} />
      <QuoteSection quote={aboutPage?.quote} author={aboutPage?.quoteAuthor} />
      <GallerySection gallery={gallery} />
      <TestimonialsSection testimonials={testimonials} />
      <ContactSection aboutPage={aboutPage} />
    </div>
  );
}

// ─── ANIMATED COUNTER ─────────────────────────────────────
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest: number) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [isInView, value, count]);

  useEffect(() => rounded.on("change", (v) => setDisplay(v)), [rounded]);

  return <span ref={ref}>{display}{suffix}</span>;
}

// ─── SECTION HEADER ─────────────────────────────────────
function SectionHeader({ icon: Icon, label, title, subtitle, color = "blue", light = false }: {
  icon: any; label: string; title: string; subtitle?: string; color?: string; light?: boolean;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const colorMap: Record<string, string> = {
    blue: "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    green: "bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400",
    orange: "bg-orange-50 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    purple: "bg-purple-50 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400",
    pink: "bg-pink-50 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  };
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6 }}
      className="text-center mb-16"
    >
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-4 ${colorMap[color] || colorMap.blue}`}>
        <Icon className="w-4 h-4" />
        <span>{label}</span>
      </div>
      <h2 className={`text-4xl md:text-5xl font-bold mb-4 ${light ? "text-white" : "text-foreground"}`}>{title}</h2>
      {subtitle && <p className={`text-lg max-w-2xl mx-auto ${light ? "text-blue-100" : "text-muted-foreground"}`}>{subtitle}</p>}
    </motion.div>
  );
}

// ─── SCROLL REVEAL ─────────────────────────────────────
function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 1: HERO
// ─────────────────────────────────────────────────────────
function HeroSection({ aboutPage }: { aboutPage?: any }) {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900">
      <motion.div className="absolute inset-0" animate={{ opacity: [0.4, 0.6, 0.4] }} transition={{ duration: 6, repeat: Infinity }}>
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </motion.div>
      <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='white' fill-opacity='1'%3E%3Ccircle cx='30' cy='30' r='1.5'/%3E%3C/g%3E%3C/svg%3E")`, backgroundSize: '60px 60px' }} />

      <div className="relative z-10 container mx-auto px-4 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-6"
            >
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-sm font-medium text-white/90">Physical Education Professional</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold text-white mb-4 leading-tight"
            >
              {aboutPage?.name || (
                <>Building Strong <span className="text-green-400">Minds</span> Through <span className="text-orange-400">Fitness</span></>
              )}
            </motion.h1>

            {aboutPage?.designation && (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
                className="text-xl md:text-2xl text-blue-200 font-medium mb-4">
                {aboutPage.designation}
              </motion.p>
            )}

            {aboutPage?.tagline && (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                className="text-lg text-blue-200/80 mb-6 max-w-xl leading-relaxed">
                {aboutPage.tagline}
              </motion.p>
            )}

            {aboutPage?.introText && (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                className="text-blue-100/70 mb-8 max-w-xl leading-relaxed">
                {aboutPage.introText}
              </motion.p>
            )}

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
              className="flex flex-wrap gap-4">
              {aboutPage?.resumeLink && (
                <a href={aboutPage.resumeLink} target="_blank" rel="noopener noreferrer">
                  <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-green-500/30">
                    <Download className="w-5 h-5 mr-2" /> Download Resume
                  </Button>
                </a>
              )}
              <Link href="/contact">
                <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full">
                  <Mail className="w-5 h-5 mr-2" /> Contact Me
                </Button>
              </Link>
              <a href="#activities">
                <Button className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-orange-500/30">
                  <Activity className="w-5 h-5 mr-2" /> View Activities
                </Button>
              </a>
            </motion.div>

            {(aboutPage?.facebook || aboutPage?.linkedin || aboutPage?.youtube) && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                className="flex gap-3 mt-8">
                {aboutPage.facebook && (
                  <a href={aboutPage.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Facebook className="w-5 h-5 text-white" />
                  </a>
                )}
                {aboutPage.linkedin && (
                  <a href={aboutPage.linkedin} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Linkedin className="w-5 h-5 text-white" />
                  </a>
                )}
                {aboutPage.youtube && (
                  <a href={aboutPage.youtube} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center hover:bg-white/20 transition-colors">
                    <Youtube className="w-5 h-5 text-white" />
                  </a>
                )}
              </motion.div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
            className="relative flex justify-center">
            <div className="relative">
              <motion.div className="absolute -inset-6 border-2 border-green-400/30 rounded-full"
                animate={{ rotate: 360 }} transition={{ duration: 20, repeat: Infinity, ease: "linear" }} />
              <motion.div className="absolute -inset-12 border-[1.5px] border-orange-400/15 rounded-full"
                animate={{ rotate: -360 }} transition={{ duration: 25, repeat: Infinity, ease: "linear" }} />
              <div className="relative w-80 h-80 md:w-96 md:h-96">
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-blue-500 rounded-full opacity-30 blur-2xl" />
                <Image
                  src={aboutPage?.profileImage || "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=600&h=600&fit=crop"}
                  alt="Profile" fill className="object-cover rounded-full border-4 border-white/20 shadow-2xl" priority />
              </div>
              <motion.div className="absolute -top-2 -right-2 bg-white rounded-full p-3 shadow-xl"
                animate={{ y: [0, -12, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
                <Trophy className="w-7 h-7 text-yellow-500" />
              </motion.div>
              <motion.div className="absolute bottom-12 -left-8 bg-white rounded-full p-3 shadow-xl"
                animate={{ y: [0, 12, 0] }} transition={{ duration: 3, repeat: Infinity }}>
                <Medal className="w-7 h-7 text-blue-500" />
              </motion.div>
              {aboutPage?.yearsOfExperience && (
                <motion.div className="absolute top-1/2 -right-10 bg-white rounded-xl px-4 py-2 shadow-xl"
                  animate={{ y: [0, -8, 0] }} transition={{ duration: 2.8, repeat: Infinity }}>
                  <p className="text-2xl font-bold text-blue-600">{aboutPage.yearsOfExperience}+</p>
                  <p className="text-xs text-gray-500">Years Exp.</p>
                </motion.div>
              )}
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div className="w-1.5 h-3 bg-white/60 rounded-full"
            animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 2: ABOUT ME
// ─────────────────────────────────────────────────────────
function AboutMeSection({ aboutPage }: { aboutPage?: any }) {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <Reveal>
            <div className="relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={aboutPage?.profileImage || "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&h=600&fit=crop"}
                  alt="Teaching" width={600} height={500}
                  className="object-cover w-full h-[450px]" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 text-white">
                  <p className="text-4xl font-bold">{aboutPage?.yearsOfExperience || "10"}+</p>
                  <p className="text-sm opacity-90">Years of Excellence in Physical Education</p>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.2}>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <Target className="w-4 h-4" />
              <span>About Me</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Passionate About <span className="text-blue-600 dark:text-blue-400">Physical Education</span> & <span className="text-green-500 dark:text-green-400">Student Development</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-6">
              {aboutPage?.aboutDescription ||
                "As a dedicated Physical Education Teacher, I believe in the transformative power of sports and physical fitness. My mission is to nurture athletic excellence while building character, discipline, and teamwork in every student."
              }
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Users, label: "Student Leadership", color: "text-blue-600", bg: "bg-blue-50 dark:bg-blue-900/30" },
                { icon: Trophy, label: "Team Building", color: "text-green-600", bg: "bg-green-50 dark:bg-green-900/30" },
                { icon: Heart, label: "Health & Wellness", color: "text-orange-600", bg: "bg-orange-50 dark:bg-orange-900/30" },
                { icon: Shield, label: "Character Dev.", color: "text-purple-600", bg: "bg-purple-50 dark:bg-purple-900/30" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-3 p-4 rounded-xl bg-card border border-border shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className={`w-11 h-11 rounded-lg ${item.bg} flex items-center justify-center`}>
                    <item.icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <span className="font-medium text-foreground text-sm">{item.label}</span>
                </motion.div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 3: STATISTICS
// ─────────────────────────────────────────────────────────
function StatisticsSection({ statistics }: { statistics?: any[] }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });
  const fallback = [
    { title: "Years of Experience", count: 10, suffix: "+" },
    { title: "Students Trained", count: 5000, suffix: "+" },
    { title: "Events Conducted", count: 150, suffix: "+" },
    { title: "Awards Achieved", count: 25, suffix: "+" },
  ];
  const items = statistics?.length ? statistics : fallback;

  return (
    <section ref={ref} className="py-20 bg-gradient-to-r from-blue-600 to-blue-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(circle at 25px 25px, white 1.5px, transparent 0)`, backgroundSize: '50px 50px' }} />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">Impact in Numbers</h2>
          <p className="text-blue-200 text-lg">A track record of excellence and achievement</p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {items.map((s: any, i: number) => (
            <motion.div key={i} initial={{ opacity: 0, scale: 0.5 }} animate={inView ? { opacity: 1, scale: 1 } : {}} transition={{ delay: i * 0.1 }} className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-white mb-2">
                <AnimatedCounter value={s.count} suffix={s.suffix || "+"} />
              </div>
              <div className="text-blue-200 text-lg">{s.title}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 4: EXPERIENCE
// ─────────────────────────────────────────────────────────
function ExperienceSection({ experience }: { experience?: any[] }) {
  if (!experience?.length) return null;

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader icon={Briefcase} label="Experience" title="Professional Experience"
          subtitle="A journey dedicated to physical education and student athletic development" color="orange" />
        <div className="max-w-4xl mx-auto space-y-6">
          {experience.map((exp: any, i: number) => (
            <Reveal key={exp.id} delay={i * 0.15}>
              <Card className="p-6 md:p-8 border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/80 backdrop-blur-sm group">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <Briefcase className="w-8 h-8 text-white" />
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-start justify-between mb-3">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">{exp.role}</h3>
                        <p className="text-blue-600 dark:text-blue-400 font-medium text-lg">{exp.institutionName}</p>
                      </div>
                      <span className="inline-flex items-center px-4 py-2 bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300 rounded-full text-sm font-medium mt-2 md:mt-0 whitespace-nowrap">
                        <Clock className="w-4 h-4 mr-1.5" />
                        {exp.duration}
                      </span>
                    </div>
                    {exp.description && <p className="text-muted-foreground leading-relaxed">{exp.description}</p>}
                    {exp.sports?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4">
                        {exp.sports.map((s: string, idx: number) => (
                          <span key={idx} className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium">{s}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 5: EDUCATION
// ─────────────────────────────────────────────────────────
function EducationSection({ education, certifications }: { education?: any[]; certifications?: any[] }) {
  const eduList = education || [];
  const certList = certifications || [];

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader icon={GraduationCap} label="Education" title="Academic Qualifications"
          subtitle="Educational background and professional certifications" color="green" />

        {eduList.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {eduList.map((edu: any, i: number) => (
              <Reveal key={edu.id} delay={i * 0.1}>
                <Card className="p-6 h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-green-50/50 dark:from-card dark:to-green-950/20 group hover:-translate-y-1">
                  <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center mb-4 group-hover:bg-green-500 transition-colors duration-300">
                    <GraduationCap className="w-7 h-7 text-green-600 dark:text-green-400 group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-bold text-foreground mb-1">{edu.degree}</h3>
                  <p className="text-green-600 dark:text-green-400 font-medium mb-2">{edu.institution}</p>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                    {edu.passingYear && (
                      <span className="inline-flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{edu.passingYear}</span>
                    )}
                    {edu.grade && (
                      <span className="inline-flex items-center gap-1"><Star className="w-3.5 h-3.5" />{edu.grade}</span>
                    )}
                  </div>
                  {edu.specialization && <p className="mt-2 text-sm text-muted-foreground">Specialization: {edu.specialization}</p>}
                </Card>
              </Reveal>
            ))}
          </div>
        )}

        {certList.length > 0 && (
          <Reveal delay={0.3}>
            <div>
              <h3 className="text-2xl font-bold text-foreground mb-8 text-center">Professional Certifications</h3>
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {certList.map((cert: any) => (
                  <Card key={cert.id} className="p-5 border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-card group hover:-translate-y-1">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center shrink-0 group-hover:bg-blue-500 transition-colors">
                        <Award className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:text-white transition-colors" />
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-bold text-foreground text-base mb-1">{cert.certificateName}</h4>
                        {cert.organization && (
                          <p className="text-sm text-muted-foreground">{cert.organization}</p>
                        )}
                        {cert.year && (
                          <span className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2.5 py-1 rounded-full">
                            <Clock className="w-3 h-3" />
                            {cert.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 6: SKILLS
// ─────────────────────────────────────────────────────────
function SkillsSection({ skills }: { skills?: any[] }) {
  const fallback = [
    { name: "Fitness Training", percentage: 95 },
    { name: "Sports Coaching", percentage: 92 },
    { name: "Team Management", percentage: 88 },
    { name: "Student Motivation", percentage: 94 },
    { name: "Health & Wellness", percentage: 90 },
    { name: "Event Organization", percentage: 85 },
    { name: "Leadership Skills", percentage: 89 },
    { name: "Athletic Performance", percentage: 91 },
  ];
  const items = skills?.length ? skills : fallback;

  return (
    <section className="py-24 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.08) 35px, rgba(255,255,255,.08) 70px)` }} />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader icon={Dumbbell} label="Skills" title="Skills & Competencies"
          subtitle="Professional expertise developed through years of dedicated practice" color="blue" light />
        <div className="grid md:grid-cols-2 gap-x-16 gap-y-8 max-w-5xl mx-auto">
          {items.map((skill: any, i: number) => (
            <SkillItem key={i} skill={skill} delay={i * 0.08} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SkillItem({ skill, delay }: { skill: any; delay: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, x: -30 }} animate={inView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.5, delay }}>
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-lg text-white/90">{skill.name}</span>
        <span className="text-blue-400 font-bold">{skill.percentage}%</span>
      </div>
      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <SkillProgressBar value={skill.percentage} />
      </div>
    </motion.div>
  );
}

function SkillProgressBar({ value }: { value: number }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  return (
    <motion.div ref={ref} className="h-full rounded-full bg-gradient-to-r from-blue-500 via-green-400 to-blue-500"
      initial={{ width: 0 }} animate={inView ? { width: `${value}%` } : {}} transition={{ duration: 1.5, ease: "easeOut" }} />
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 7: SPORTS EXPERTISE
// ─────────────────────────────────────────────────────────
function getSportIcon(icon: string, name: string): React.ReactNode {
  const iconMap: Record<string, string> = {
    football: "⚽", cricket: "🏏", athletics: "🏃", running: "🏃",
    basketball: "🏀", volleyball: "🏐", yoga: "🧘", fitness: "💪",
    swimming: "🏊", tennis: "🎾", badminton: "🏸", cycling: "🚴",
    trophy: "🏆", medal: "🥇", dumbbell: "🏋️", target: "🎯",
    heart: "❤️", star: "⭐", flame: "🔥", award: "🏅",
    run: "🏃‍♂️", sport: "⚡", game: "🎮", team: "👥",
    coach: "🧑‍🏫", training: "📋", exercise: "🤸",
  };
  const key = icon?.toLowerCase().trim() || "";
  if (iconMap[key]) return iconMap[key];
  if (key.length <= 2) return key;
  const nameMap: Record<string, string> = {
    football: "⚽", cricket: "🏏", athletics: "🏃", running: "🏃",
    basketball: "🏀", volleyball: "🏐", yoga: "🧘", fitness: "💪",
    swimming: "🏊", tennis: "🎾", badminton: "🏸",
  };
  const nameKey = name?.toLowerCase().trim() || "";
  if (nameMap[nameKey]) return nameMap[nameKey];
  return "🏅";
}

function SportsExpertiseSection({ sports }: { sports?: any[] }) {
  const fallback = [
    { name: "Football", icon: "football", description: "Professional coaching and training in football skills, tactics, and team play", level: "Expert" },
    { name: "Cricket", icon: "cricket", description: "Comprehensive cricket training covering batting, bowling, and fielding", level: "Expert" },
    { name: "Athletics", icon: "athletics", description: "Track and field events training including sprints, jumps, and throws", level: "Advanced" },
    { name: "Basketball", icon: "basketball", description: "Team training, dribbling, shooting techniques, and game strategy", level: "Advanced" },
    { name: "Volleyball", icon: "volleyball", description: "Indoor and beach volleyball coaching with focus on teamwork", level: "Intermediate" },
    { name: "Yoga & Fitness", icon: "yoga", description: "Flexibility, strength training, and mental wellness programs", level: "Expert" },
  ];
  const items = sports?.length ? sports : fallback;
  const levelColor = (lvl: string) => {
    const map: Record<string, string> = { expert: "bg-green-500", advanced: "bg-blue-500", intermediate: "bg-orange-500" };
    return map[lvl.toLowerCase()] || "bg-gray-500";
  };

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader icon={Medal} label="Sports" title="Sports Expertise"
          subtitle="Specialized training across multiple sports disciplines" color="orange" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((sport: any, i: number) => (
            <Reveal key={i} delay={i * 0.08}>
              <Card className="p-8 h-full text-center border-0 shadow-md hover:shadow-2xl transition-all duration-300 bg-card group hover:-translate-y-2">
                <motion.div className="text-6xl mb-5" whileHover={{ scale: 1.3, rotate: 10 }} transition={{ type: "spring", stiffness: 300 }}>
                  {getSportIcon(sport.icon, sport.name)}
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{sport.name}</h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">{sport.description}</p>
                <span className={`inline-block px-5 py-1.5 ${levelColor(sport.level)} text-white rounded-full text-sm font-medium shadow-md`}>
                  {sport.level}
                </span>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 8: ACHIEVEMENTS
// ─────────────────────────────────────────────────────────
function AchievementsSection({ achievements }: { achievements?: any[] }) {
  if (!achievements?.length) return null;

  return (
    <section className="py-24 bg-gradient-to-br from-blue-600 to-blue-800 text-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
      <div className="container mx-auto px-4 relative z-10">
        <SectionHeader icon={Trophy} label="Achievements" title="Awards & Recognition"
          subtitle="Recognition for excellence in physical education and sports coaching" color="blue" light />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((a: any, i: number) => (
            <Reveal key={a.id} delay={i * 0.1}>
              <Card className="p-6 h-full bg-white/10 backdrop-blur-md border border-white/10 hover:bg-white/20 transition-all duration-300">
                <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center mb-4 shadow-lg">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold mb-1">{a.title}</h3>
                {a.organization && <p className="text-blue-200 mb-2">{a.organization}</p>}
                {a.year && <span className="inline-flex items-center px-3 py-1 bg-white/20 rounded-full text-sm">{a.year}</span>}
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 9: DAILY ACTIVITIES TIMELINE
// ─────────────────────────────────────────────────────────
function ActivitiesTimeline({ activities }: { activities?: any[] }) {
  const fallback = [
    { title: "Morning Fitness Session", time: "6:00 AM - 8:00 AM", description: "Cardio, stretching, and warm-up exercises to start the day with energy" },
    { title: "Student Practice Sessions", time: "9:00 AM - 12:00 PM", description: "Sports training and skill development with students" },
    { title: "Classroom Activities", time: "1:00 PM - 3:00 PM", description: "Theory classes on health, fitness, and sports science" },
    { title: "Sports Event Preparation", time: "3:30 PM - 5:00 PM", description: "Event planning, team strategy, and competition preparation" },
    { title: "Evening Coaching & Mentoring", time: "5:30 PM - 7:30 PM", description: "Advanced training sessions and student mentoring programs" },
  ];
  const items = activities?.length ? activities : fallback;

  return (
    <section id="activities" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader icon={Clock} label="Schedule" title="Daily Training Schedule"
          subtitle="A structured day focused on fitness, learning, and student development" color="blue" />
        <div className="max-w-4xl mx-auto">
          {items.map((a: any, i: number) => (
            <Reveal key={i} delay={i * 0.12}>
              <div className="flex gap-6">
                <div className="flex flex-col items-center shrink-0">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg z-10">
                    <Clock className="w-6 h-6 text-white" />
                  </div>
                  {i < items.length - 1 && <div className="w-0.5 flex-1 min-h-[24px] bg-gradient-to-b from-blue-400 to-green-400" />}
                </div>
                <Card className="flex-1 p-6 mb-8 border-0 shadow-md hover:shadow-xl transition-shadow bg-card">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-2">
                    <h3 className="text-xl font-bold text-foreground">{a.title}</h3>
                    <span className="inline-flex items-center px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium whitespace-nowrap">{a.time}</span>
                  </div>
                  <p className="text-muted-foreground">{a.description}</p>
                </Card>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 10: CAREER JOURNEY
// ─────────────────────────────────────────────────────────
function CareerJourneySection({ education, experience }: { education?: any[]; experience?: any[] }) {
  const journey: { title: string; subtitle: string; year: string; type: string }[] = [];
  education?.forEach(e => journey.push({ title: e.degree, subtitle: e.institution, year: e.passingYear?.toString() || "", type: "education" }));
  experience?.forEach(e => journey.push({ title: e.role, subtitle: e.institutionName, year: e.duration, type: "experience" }));
  journey.sort((a, b) => {
    const ay = parseInt(a.year) || 0;
    const by = parseInt(b.year) || 0;
    return by - ay;
  });

  if (!journey.length) return null;

  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader icon={Target} label="Journey" title="Career Journey"
          subtitle="From education to professional excellence" color="purple" />
        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-1/2 -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-400 via-green-400 to-orange-400 rounded-full hidden md:block" />
          {journey.map((item, i) => (
            <Reveal key={i} delay={i * 0.15}>
              <div className={`relative flex items-center gap-8 mb-10 last:mb-0 ${i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} flex-row`}>
                <div className={`w-full md:w-5/12 ${i % 2 === 0 ? "md:text-right" : "md:text-left"}`}>
                  <Card className={`p-5 inline-block border-0 shadow-md hover:shadow-xl transition-shadow ${
                    item.type === "education"
                      ? "bg-gradient-to-br from-green-50 to-card dark:from-green-950/30 dark:to-card"
                      : "bg-gradient-to-br from-blue-50 to-card dark:from-blue-950/30 dark:to-card"
                  }`}>
                    <h3 className="font-bold text-foreground">{item.title}</h3>
                    <p className={item.type === "education" ? "text-green-600 dark:text-green-400" : "text-blue-600 dark:text-blue-400"}>{item.subtitle}</p>
                    <p className="text-muted-foreground text-sm mt-1">{item.year}</p>
                  </Card>
                </div>
                <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 w-5 h-5 rounded-full bg-background border-4 border-blue-500 z-10" />
                <div className="hidden md:block w-5/12" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 11: INSPIRATIONAL QUOTE
// ─────────────────────────────────────────────────────────
function QuoteSection({ quote, author }: { quote?: string | null; author?: string | null }) {
  if (!quote) return null;

  return (
    <section className="py-24 bg-gradient-to-br from-muted/50 to-primary/5">
      <div className="container mx-auto px-4">
        <Reveal>
          <div className="max-w-4xl mx-auto">
            <Card className="p-10 md:p-16 relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white">
              <Quote className="absolute top-6 left-6 w-20 h-20 text-white/10" />
              <Quote className="absolute bottom-6 right-6 w-20 h-20 text-white/10 rotate-180" />
              <div className="relative z-10 text-center">
                <Quote className="w-12 h-12 text-yellow-400 mx-auto mb-6" />
                <blockquote className="text-2xl md:text-3xl font-light italic mb-6 leading-relaxed">&ldquo;{quote}&rdquo;</blockquote>
                {author && <cite className="text-lg text-blue-200 not-italic">&mdash; {author}</cite>}
              </div>
            </Card>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 12: GALLERY
// ─────────────────────────────────────────────────────────
function GallerySection({ gallery }: { gallery?: any[] }) {
  const [selected, setSelected] = useState<string | null>(null);
  const fallback = [
    "https://images.unsplash.com/photo-1461896836934-0a0f56a9b9043e?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400&h=400&fit=crop",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400&h=400&fit=crop",
  ];
  const images = gallery?.length ? gallery : fallback.map((url, i) => ({ id: i, imageUrl: url, caption: "" }));

  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <SectionHeader icon={Award} label="Gallery" title="Sports Gallery"
          subtitle="Capturing moments of training, competition, and achievement" color="pink" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((img: any, i: number) => (
            <Reveal key={i} delay={i * 0.06}>
              <motion.div
                className="relative aspect-square overflow-hidden rounded-2xl cursor-pointer group shadow-md"
                onClick={() => setSelected(img.imageUrl)}
                whileHover={{ scale: 1.02 }}
              >
                <Image src={img.imageUrl} alt={img.caption || "Gallery"} fill className="object-cover transition-transform duration-500 group-hover:scale-110" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                {img.caption && (
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-medium">{img.caption}</p>
                  </div>
                )}
              </motion.div>
            </Reveal>
          ))}
        </div>
      </div>

      {selected && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="relative max-w-4xl max-h-[90vh] w-full">
            <Image src={selected} alt="Gallery" width={1200} height={800} className="object-contain w-full h-full rounded-lg" />
            <button className="absolute top-4 right-4 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl hover:bg-white/30 transition-colors"
              onClick={() => setSelected(null)}>×</button>
          </div>
        </motion.div>
      )}
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 13: TESTIMONIALS
// ─────────────────────────────────────────────────────────
function TestimonialsSection({ testimonials }: { testimonials?: any[] }) {
  const fallback = [
    { studentName: "Alex Johnson", designation: "Former Student, State Athlete", message: "Coach's dedication and expertise transformed my athletic career. His training methods are exceptional and his motivation is contagious.", rating: 5 },
    { studentName: "Sarah Williams", designation: "Student, National Champion", message: "The best physical education teacher I've ever had. He genuinely cares about each student's development and success.", rating: 5 },
    { studentName: "Michael Chen", designation: "Colleague, PE Teacher", message: "An inspiring educator who sets the standard for physical education. His innovative approach to teaching is remarkable.", rating: 5 },
  ];
  const items = testimonials?.length ? testimonials : fallback;

  return (
    <section className="py-24 bg-gradient-to-br from-muted/30 to-orange-50 dark:to-orange-950/10">
      <div className="container mx-auto px-4">
        <SectionHeader icon={Star} label="Testimonials" title="What Students Say"
          subtitle="Feedback from students and colleagues" color="orange" />
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map((t: any, i: number) => {
            const initial = (t.studentName || "?")[0];
            return (
              <Reveal key={i} delay={i * 0.15}>
                <Card className="p-6 h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-card">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(t.rating || 5)].map((_, r) => <Star key={r} className="w-5 h-5 fill-yellow-400 text-yellow-400" />)}
                  </div>
                  <Quote className="w-8 h-8 text-primary/20 mb-3" />
                  <p className="text-muted-foreground mb-6 italic leading-relaxed">&ldquo;{t.message}&rdquo;</p>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-bold text-lg">
                      {initial}
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{t.studentName}</h4>
                      {t.designation && <p className="text-sm text-muted-foreground">{t.designation}</p>}
                    </div>
                  </div>
                </Card>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// SECTION 14: CONTACT / SOCIAL
// ─────────────────────────────────────────────────────────
function ContactSection({ aboutPage }: { aboutPage?: any }) {
  const hasSocial = aboutPage?.facebook || aboutPage?.linkedin || aboutPage?.youtube || aboutPage?.email;
  if (!hasSocial) return null;

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
      <div className="container mx-auto px-4 text-center">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Let's Connect</h2>
          <p className="text-gray-300 mb-8 max-w-xl mx-auto">Follow me on social media or reach out directly</p>
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {aboutPage?.facebook && (
              <a href={aboutPage.facebook} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors">
                <Facebook className="w-5 h-5" /> <span>Facebook</span>
              </a>
            )}
            {aboutPage?.linkedin && (
              <a href={aboutPage.linkedin} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors">
                <Linkedin className="w-5 h-5" /> <span>LinkedIn</span>
              </a>
            )}
            {aboutPage?.youtube && (
              <a href={aboutPage.youtube} target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors">
                <Youtube className="w-5 h-5" /> <span>YouTube</span>
              </a>
            )}
            {aboutPage?.email && (
              <a href={`mailto:${aboutPage.email}`}
                className="flex items-center gap-2 px-6 py-3 bg-white/10 backdrop-blur-sm rounded-full hover:bg-white/20 transition-colors">
                <Mail className="w-5 h-5" /> <span>{aboutPage.email}</span>
              </a>
            )}
          </div>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/contact">
              <Button className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-full shadow-lg">
                <Mail className="w-5 h-5 mr-2" /> Get In Touch
              </Button>
            </Link>
            {aboutPage?.resumeLink && (
              <a href={aboutPage.resumeLink} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full">
                  <Download className="w-5 h-5 mr-2" /> Download CV
                </Button>
              </a>
            )}
          </div>
        </Reveal>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────
// LOADING SKELETON
// ─────────────────────────────────────────────────────────
function AboutLoadingSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="h-screen bg-blue-900">
        <div className="container mx-auto px-4 h-full flex items-center">
          <div className="grid lg:grid-cols-2 gap-12 w-full">
            <div className="space-y-6">
              {[1, 2, 3, 4, 5].map(i => (
                <Skeleton key={i} className={`h-${i === 1 ? 8 : i === 2 ? 24 : i === 3 ? 8 : i === 4 ? 20 : 14} bg-white/20`}
                  style={{ width: i === 1 ? '200px' : i === 3 ? '60%' : '100%' }} />
              ))}
              <div className="flex gap-4">
                <Skeleton className="h-14 w-40 bg-white/20 rounded-full" />
                <Skeleton className="h-14 w-40 bg-white/20 rounded-full" />
              </div>
            </div>
            <Skeleton className="w-96 h-96 rounded-full bg-white/20 mx-auto" />
          </div>
        </div>
      </div>
      <div className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <Skeleton className="h-[450px] rounded-3xl" />
            <div className="space-y-6">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-16 w-full" />
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}