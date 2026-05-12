"use client";

import { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useTransform, animate } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { memberService } from "@/services/memberService";
import { TeamMember, MemberType, memberTypeLabels } from "@/types/member";
import {
  Users, Trophy, Medal, Star, Dumbbell, Target, Flame, Zap,
  Mail, Copy, Check, ExternalLink, Search, X, Quote, Shield,
  ArrowRight, Sparkles, Clock, Award, Heart, ThumbsUp,
  GraduationCap, BookOpen, Globe, Activity, ChevronRight,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

// ─── MAPPING ─────────────────────
const memberTypeDisplay: Record<string, { label: string; desc: string }> = {
  FACULTY: { label: "Head Coaches & Trainers", desc: "Professional coaches leading athletic excellence" },
  ATHLETE: { label: "Student Athletes", desc: "Active sports performers and competitors" },
  STUDENT: { label: "Sports Club Members", desc: "Students training in various disciplines" },
  CAPTAIN: { label: "Team Captains & Leaders", desc: "Student leaders who inspire and guide teams" },
  ALUMNI: { label: "Alumni Athletes", desc: "Former members who excelled in sports" },
};

const typeIcons: Record<string, any> = {
  FACULTY: Trophy, ATHLETE: Zap, STUDENT: Users, CAPTAIN: Medal, ALUMNI: Globe,
};

const typeGradients: Record<string, string> = {
  FACULTY: "from-blue-600 to-blue-800",
  ATHLETE: "from-green-500 to-green-700",
  STUDENT: "from-orange-500 to-orange-700",
  CAPTAIN: "from-amber-500 to-amber-700",
  ALUMNI: "from-gray-600 to-gray-800",
};

const typeBadgeColors: Record<string, string> = {
  FACULTY: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  ATHLETE: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  STUDENT: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  CAPTAIN: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  ALUMNI: "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300",
};

const expertiseIcons: Record<string, string> = {
  football: "⚽", cricket: "🏏", athletics: "🏃", running: "🏃",
  basketball: "🏀", volleyball: "🏐", yoga: "🧘", fitness: "💪",
  swimming: "🏊", tennis: "🎾", badminton: "🏸", cycling: "🚴",
};

function getSportEmoji(text: string): string {
  const key = text.toLowerCase().trim();
  if (expertiseIcons[key]) return expertiseIcons[key];
  for (const [k, v] of Object.entries(expertiseIcons)) {
    if (key.includes(k)) return v;
  }
  return "🏅";
}

// ─── MAIN PAGE ───────────────────
export default function MembersPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<TeamMember | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await memberService.getAllMembers();
        setMembers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const filtered = members.filter(m => {
    const q = search.toLowerCase();
    const matchesSearch = !q ||
      m.name.toLowerCase().includes(q) ||
      m.email?.toLowerCase().includes(q) ||
      m.role?.toLowerCase().includes(q) ||
      m.expertise.some(e => e.toLowerCase().includes(q));
    const matchesFilter = filter === "ALL" || m.memberType === filter;
    return matchesSearch && matchesFilter;
  });

  const grouped = Object.entries(memberTypeDisplay).map(([key, val]) => ({
    key: key as MemberType,
    ...val,
    members: filtered.filter(m => m.memberType === key),
  })).filter(g => g.members.length > 0);

  // Stats
  const stats = {
    total: members.length,
    faculty: members.filter(m => m.memberType === "FACULTY").length,
    athlete: members.filter(m => m.memberType === "ATHLETE").length,
    student: members.filter(m => m.memberType === "STUDENT").length,
    captain: members.filter(m => m.memberType === "CAPTAIN").length,
    alumni: members.filter(m => m.memberType === "ALUMNI").length,
  };

  return (
    <div className="min-h-screen bg-background">
      {/* 1. HERO */}
      <HeroSection stats={stats} />

      {/* 2. STATISTICS */}
      <StatsSection stats={stats} />

      {/* 3. SEARCH & FILTER */}
      <SearchFilter search={search} setSearch={setSearch} filter={filter} setFilter={setFilter} />

      {/* 4. CATEGORY SECTIONS */}
      {filter === "ALL" ? (
        grouped.map(g => (
          <CategorySection
            key={g.key}
            title={g.label}
            subtitle={g.desc}
            members={g.members}
            icon={typeIcons[g.key]}
            gradient={typeGradients[g.key]}
            onSelect={setSelected}
          />
        ))
      ) : (
        <MembersGrid members={filtered} onSelect={setSelected} />
      )}

      {/* 5. FEATURED COACHES */}
      <FeaturedCoaches members={members} onSelect={setSelected} />

      {/* 6. SPORTS EXPERTISE */}
      <SportsExpertiseSection />

      {/* 7. ACTIVITIES */}
      <ActivitiesSection />

      {/* 8. INSPIRATIONAL QUOTE */}
      <QuoteSection />

      {/* 10. CTA */}
      <CTASection />

      {/* MODAL */}
      <MemberModal member={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

// ─── HERO ────────────────────────
function HeroSection({ stats }: any) {
  return (
    <section className="relative min-h-[70vh] flex items-center overflow-hidden bg-gradient-to-br from-blue-700 via-blue-600 to-blue-900">
      {/* Animated BG */}
      <motion.div className="absolute inset-0" animate={{ opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 6, repeat: Infinity }}>
        <div className="absolute top-20 left-10 w-96 h-96 bg-green-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-[500px] h-[500px] bg-orange-400/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl" />
      </motion.div>
      <div className="absolute inset-0 opacity-[0.06]" style={{ backgroundImage: `radial-gradient(circle at 20px 20px, white 1.5px, transparent 0)`, backgroundSize: '40px 40px' }} />

      {/* Floating sport elements */}
      <motion.div className="absolute top-16 right-20 text-white/10" animate={{ y: [0, -25, 0], rotate: [0, 15, 0] }} transition={{ duration: 5, repeat: Infinity }}>
        <Trophy className="w-20 h-20" />
      </motion.div>
      <motion.div className="absolute bottom-24 left-16 text-white/10" animate={{ y: [0, 25, 0], rotate: [0, -15, 0] }} transition={{ duration: 6, repeat: Infinity }}>
        <Medal className="w-16 h-16" />
      </motion.div>
      <motion.div className="absolute top-1/3 right-1/4 text-white/10" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity }}>
        <Dumbbell className="w-12 h-12" />
      </motion.div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm rounded-full border border-white/20 mb-8"
          >
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-white/90 font-medium">{stats.total} Team Members</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight"
          >
            Meet Our Dedicated <span className="text-green-400">Sports Team</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-blue-100/80 max-w-3xl mx-auto leading-relaxed"
          >
            Passionate educators, trainers, and athletes working together to inspire discipline,
            teamwork, fitness, and excellence in every student.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap justify-center gap-4 mt-10"
          >
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-green-500/30">
              <Activity className="w-5 h-5 mr-2" />Join Our Activities
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full">
              <Target className="w-5 h-5 mr-2" />View Sports Programs
            </Button>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full">
                <Mail className="w-5 h-5 mr-2" />Contact Team
              </Button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div className="absolute bottom-8 left-1/2 -translate-x-1/2" animate={{ y: [0, 10, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
          <motion.div className="w-1.5 h-3 bg-white/60 rounded-full" animate={{ opacity: [1, 0.3, 1], y: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
}

// ─── STATISTICS ──────────────────
function StatsSection({ stats }: any) {
  const items = [
    { label: "Total Coaches", value: stats.faculty, icon: Trophy, gradient: "from-blue-500 to-blue-600" },
    { label: "Student Leaders", value: stats.captain, icon: Medal, gradient: "from-amber-500 to-amber-600" },
    { label: "Active Athletes", value: stats.athlete, icon: Zap, gradient: "from-green-500 to-green-600" },
    { label: "Club Members", value: stats.student, icon: Users, gradient: "from-orange-500 to-orange-600" },
    { label: "Alumni Players", value: stats.alumni, icon: Globe, gradient: "from-gray-500 to-gray-600", suffix: "+" },
  ];

  return (
    <section className="py-16 -mt-16 relative z-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {items.map((item, i) => (
            <StatsCard key={i} {...item} delay={i * 0.1} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StatsCard({ label, value, icon: Icon, gradient, delay, suffix = "" }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const count = useMotionValue(0);
  const rounded = useTransform(count, (v: number) => Math.round(v));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (inView) {
      const controls = animate(count, value, { duration: 2, ease: "easeOut" });
      return controls.stop;
    }
  }, [inView, value, count]);

  useEffect(() => rounded.on("change", setDisplay), [rounded]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
    >
      <Card className="border-0 shadow-lg backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <CardContent className="p-5 text-center">
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mx-auto mb-3 shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div className="text-3xl font-bold text-foreground">
            {display}{suffix}
          </div>
          <div className="text-sm text-muted-foreground mt-1">{label}</div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── SEARCH & FILTER ─────────────
function SearchFilter({ search, setSearch, filter, setFilter }: any) {
  const filters = [
    { key: "ALL", label: "All Members", icon: Users },
    { key: "FACULTY", label: "Coaches", icon: Trophy },
    { key: "CAPTAIN", label: "Team Captains", icon: Medal },
    { key: "ATHLETE", label: "Athletes", icon: Zap },
    { key: "STUDENT", label: "Club Members", icon: Users },
    { key: "ALUMNI", label: "Alumni", icon: Globe },
  ];

  return (
    <section className="py-8 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search by name, role, sport..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-12 h-12 rounded-full bg-background border-0 shadow-sm"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2">
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <div className="flex gap-2 flex-wrap justify-center">
            {filters.map(f => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 ${
                  filter === f.key
                    ? "bg-primary text-primary-foreground shadow-lg scale-105"
                    : "bg-background text-muted-foreground hover:bg-muted hover:text-foreground shadow-sm"
                }`}
              >
                <f.icon className="w-4 h-4" />
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CATEGORY SECTION ────────────
function CategorySection({ title, subtitle, members, icon: Icon, gradient, onSelect }: any) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 border-b last:border-0">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          className="flex items-center gap-4 mb-8"
        >
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}>
            <Icon className="w-7 h-7 text-white" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
            <p className="text-muted-foreground">{subtitle} — {members.length} members</p>
          </div>
        </motion.div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m: TeamMember, i: number) => (
            <MemberCard key={m.id} member={m} index={i} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── MEMBER CARD ─────────────────
function MemberCard({ member, index, onSelect }: { member: TeamMember; index: number; onSelect: (m: TeamMember) => void }) {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = () => {
    if (member.email) {
      navigator.clipboard.writeText(member.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8 }}
    >
      <Card className="group h-full border-0 shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-b from-card to-muted/30 relative overflow-hidden rounded-2xl">
        {/* Top gradient stripe */}
        <div className={`h-2 w-full bg-gradient-to-r ${typeGradients[member.memberType] || "from-blue-500 to-blue-600"}`} />

        <CardContent className="p-6 text-center relative z-10">
          {/* Image */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-primary/5 rounded-full blur-xl" />
            <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-primary/10">
              {member.profilePhoto ? (
                <Image src={member.profilePhoto} alt={member.name} fill className="object-cover" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary/20 to-muted flex items-center justify-center text-2xl font-bold text-foreground">
                  {member.name[0]}
                </div>
              )}
            </div>
          </div>

          <h3 className="font-bold text-lg text-foreground mb-1">{member.name}</h3>
          <p className="text-sm text-primary font-medium mb-2">{member.role || "Team Member"}</p>

          {/* Badges */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-3">
            <Badge variant="secondary" className={typeBadgeColors[member.memberType]}>
              {memberTypeLabels[member.memberType]}
            </Badge>
            {member.status === "ACTIVE" && (
              <Badge variant="outline" className="text-green-600 border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30">
                Active
              </Badge>
            )}
          </div>

          {member.institution && (
            <p className="text-xs text-muted-foreground mb-3 truncate">{member.institution}</p>
          )}

          {/* Expertise chips */}
          {member.expertise.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1 mb-4">
              {member.expertise.slice(0, 3).map((e, i) => (
                <span key={i} className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 bg-muted rounded-full text-muted-foreground">
                  <span className="text-xs">{getSportEmoji(e)}</span>
                  {e}
                </span>
              ))}
              {member.expertise.length > 3 && (
                <span className="text-[11px] px-2.5 py-1 bg-muted rounded-full text-muted-foreground">
                  +{member.expertise.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-center gap-2 mt-3">
            {member.email && (
              <>
                <Button size="sm" variant="outline" className="h-8 px-3 text-xs rounded-full" asChild>
                  <a href={`mailto:${member.email}`}><Mail className="w-3 h-3 mr-1" />Contact</a>
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 rounded-full" onClick={handleCopyEmail}>
                  {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                </Button>
              </>
            )}
            <Button size="sm" className="h-8 px-3 text-xs rounded-full" onClick={() => onSelect(member)}>
              <ExternalLink className="w-3 h-3 mr-1" />Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

// ─── MEMBERS GRID ────────────────
function MembersGrid({ members, onSelect, loading }: any) {
  if (loading) return <LoadingGrid />;
  if (!members.length) return <EmptyState />;

  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {members.map((m: TeamMember, i: number) => (
            <MemberCard key={m.id} member={m} index={i} onSelect={onSelect} />
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── FEATURED COACHES ────────────
function FeaturedCoaches({ members, onSelect }: any) {
  const featured = members.filter((m: TeamMember) => m.memberType === "FACULTY" || m.memberType === "CAPTAIN").slice(0, 3);
  if (!featured.length) return null;

  return (
    <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-sm mb-4">
            <Star className="w-4 h-4 text-yellow-500" />
            <span className="text-sm font-medium">Featured Coaches</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Our Coaching Leadership</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experienced coaches and team captains dedicated to developing athletic excellence
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {featured.map((m: TeamMember, i: number) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ y: -5 }}
            >
              <Card className="relative overflow-hidden border-2 border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 bg-gradient-to-br from-white to-blue-50 dark:from-slate-800 dark:to-slate-800">
                {/* Spotlight */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />

                <CardContent className="p-8 text-center relative z-10">
                  <div className="relative w-28 h-28 mx-auto mb-5">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary to-green-500 rounded-full blur-xl opacity-60" />
                    <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-primary/30">
                      {m.profilePhoto ? (
                        <Image src={m.profilePhoto} alt={m.name} fill className="object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary/30 to-green-500/30 flex items-center justify-center text-3xl font-bold text-foreground">
                          {m.name[0]}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="inline-flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 rounded-full text-xs font-medium mb-3">
                    <Star className="w-3 h-3" />
                    {m.memberType === "FACULTY" ? "Head Coach" : "Team Captain"}
                  </div>

                  <h3 className="text-xl font-bold text-foreground mb-1">{m.name}</h3>
                  <p className="text-primary font-medium mb-3">{m.role || "Coach"}</p>

                  {m.expertise.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-1 mb-4">
                      {m.expertise.slice(0, 4).map((e, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-muted rounded-full text-muted-foreground">{e}</span>
                      ))}
                    </div>
                  )}

                  <Button size="sm" className="rounded-full" onClick={() => onSelect(m)}>
                    <ExternalLink className="w-4 h-4 mr-2" />View Profile
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SPORTS EXPERTISE ────────────
function SportsExpertiseSection() {
  const sports = [
    { name: "Football", icon: "⚽", desc: "Team strategy, skills, and match training", level: "Expert" },
    { name: "Cricket", icon: "🏏", desc: "Batting, bowling, fielding techniques", level: "Expert" },
    { name: "Basketball", icon: "🏀", desc: "Dribbling, shooting, team play", level: "Advanced" },
    { name: "Volleyball", icon: "🏐", desc: "Serving, spiking, defensive drills", level: "Advanced" },
    { name: "Athletics", icon: "🏃", desc: "Track, field, endurance training", level: "Expert" },
    { name: "Yoga & Fitness", icon: "🧘", desc: "Flexibility, strength, wellness", level: "Expert" },
  ];
  const levelColors: Record<string, string> = {
    Expert: "bg-green-500", Advanced: "bg-blue-500", Intermediate: "bg-orange-500",
  };

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-50 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400 rounded-full text-sm font-medium mb-4">
            <Dumbbell className="w-4 h-4" />
            <span>Sports Expertise</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Training Specializations</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Comprehensive training programs across multiple sports disciplines
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sports.map((sport, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -8 }}
            >
              <Card className="p-8 h-full text-center border-0 shadow-md hover:shadow-2xl transition-all duration-300 bg-gradient-to-b from-card to-muted/30 group rounded-2xl">
                <motion.div
                  className="text-6xl mb-5"
                  whileHover={{ scale: 1.3, rotate: 10 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {sport.icon}
                </motion.div>
                <h3 className="text-2xl font-bold text-foreground mb-2">{sport.name}</h3>
                <p className="text-muted-foreground mb-5 leading-relaxed">{sport.desc}</p>
                <span className={`inline-block px-5 py-1.5 ${levelColors[sport.level] || "bg-gray-500"} text-white rounded-full text-sm font-medium shadow-md`}>
                  {sport.level}
                </span>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── ACTIVITIES ──────────────────
function ActivitiesSection() {
  const activities = [
    { title: "Annual Sports Day", desc: "School-wide athletic competition featuring multiple sports events", icon: Trophy, color: "from-blue-500 to-blue-600" },
    { title: "Fitness Training Camps", desc: "Intensive physical conditioning and skill development programs", icon: Dumbbell, color: "from-green-500 to-green-600" },
    { title: "Inter-School Tournaments", desc: "Competitive matches against other schools and academies", icon: Medal, color: "from-orange-500 to-orange-600" },
    { title: "Team Practice Sessions", desc: "Regular training and strategy sessions for all sports teams", icon: Target, color: "from-amber-500 to-amber-600" },
    { title: "Award Ceremonies", desc: "Recognizing and celebrating student athletic achievements", icon: Award, color: "from-purple-500 to-purple-600" },
    { title: "Sports Workshops", desc: "Skill-building workshops with professional athletes and coaches", icon: Users, color: "from-cyan-500 to-cyan-600" },
  ];

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full text-sm font-medium mb-4">
            <Activity className="w-4 h-4" />
            <span>Activities</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Sports Activities & Events</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Engaging programs that build athletic skills, teamwork, and sportsmanship
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((act, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -5 }}
            >
              <Card className="p-6 h-full border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card group rounded-2xl">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${act.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <act.icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">{act.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{act.desc}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── QUOTE SECTION ───────────────
function QuoteSection() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto"
        >
          <Card className="p-10 md:p-16 relative overflow-hidden border-0 shadow-2xl bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-3xl">
            <Quote className="absolute top-6 left-6 w-24 h-24 text-white/10" />
            <Quote className="absolute bottom-6 right-6 w-24 h-24 text-white/10 rotate-180" />
            <div className="relative z-10 text-center max-w-3xl mx-auto">
              <Trophy className="w-14 h-14 text-yellow-400 mx-auto mb-6" />
              <blockquote className="text-2xl md:text-3xl font-light italic mb-6 leading-relaxed">
                &ldquo;Sports teach discipline, teamwork, confidence, and the strength to never give up. Physical fitness is not only one of the most important keys to a healthy body, it is the foundation of dynamic and creative intellectual activity.&rdquo;
              </blockquote>
              <cite className="text-lg text-blue-200 not-italic">&mdash; Physical Education Philosophy</cite>
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}

// ─── CTA ─────────────────────────
function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(255,255,255,.08) 35px, rgba(255,255,255,.08) 70px)` }} />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-green-500/20 backdrop-blur-sm rounded-full border border-green-400/30 mb-8"
          >
            <Flame className="w-5 h-5 text-orange-400" />
            <span className="text-green-300 font-medium">Join Our Sports Community</span>
          </motion.div>

          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to <span className="text-green-400">Train</span> With Us?
          </h2>
          <p className="text-lg text-gray-300 max-w-xl mx-auto mb-8">
            Build strength, leadership, and athletic excellence. Join our team and transform your potential into performance.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" className="bg-green-500 hover:bg-green-600 text-white px-8 py-6 text-lg rounded-full shadow-lg shadow-green-500/30">
              <Mail className="w-5 h-5 mr-2" />Contact Now
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full">
              <Activity className="w-5 h-5 mr-2" />Join Activities
            </Button>
            <Button size="lg" variant="outline" className="border-white/30 bg-white/10 text-white hover:bg-white/20 px-8 py-6 text-lg rounded-full">
              <Target className="w-5 h-5 mr-2" />View Programs
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ─── MODAL ───────────────────────
function MemberModal({ member, onClose }: { member: TeamMember | null; onClose: () => void }) {
  if (!member) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-card rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
      >
        <div className="relative">
          <div className={`h-32 bg-gradient-to-br ${typeGradients[member.memberType] || "from-blue-500 to-blue-600"} rounded-t-3xl`} />
          <button onClick={onClose} className="absolute top-4 right-4 w-8 h-8 bg-black/20 rounded-full flex items-center justify-center text-white hover:bg-black/40 transition-colors">
            <X className="w-4 h-4" />
          </button>

          <div className="px-8 pb-8 -mt-16">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="relative w-28 h-28 rounded-full overflow-hidden ring-4 ring-background shadow-xl shrink-0">
                {member.profilePhoto ? (
                  <Image src={member.profilePhoto} alt={member.name} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-primary/30 to-muted flex items-center justify-center text-3xl font-bold text-foreground">
                    {member.name[0]}
                  </div>
                )}
              </div>
              <div className="flex-1 pt-4">
                <h2 className="text-2xl font-bold text-foreground">{member.name}</h2>
                <p className="text-primary font-medium">{member.role || "Team Member"}</p>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Badge variant="secondary" className={typeBadgeColors[member.memberType]}>
                    {memberTypeLabels[member.memberType]}
                  </Badge>
                  {member.status === "ACTIVE" && <Badge variant="outline" className="text-green-600 border-green-300">Active</Badge>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {member.institution && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <GraduationCap className="w-4 h-4" /> {member.institution}
                </div>
              )}
              {member.email && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a href={`mailto:${member.email}`} className="hover:text-primary">{member.email}</a>
                </div>
              )}
              {member.yearsActive && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="w-4 h-4" /> {member.yearsActive} years active
                </div>
              )}
            </div>

            {member.highlights && (
              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" /> Biography
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{member.highlights}</p>
              </div>
            )}

            {member.expertise.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Dumbbell className="w-4 h-4 text-primary" /> Sports Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {member.expertise.map((e, i) => (
                    <Badge key={i} variant="secondary" className="gap-1">
                      <span className="text-sm">{getSportEmoji(e)}</span> {e}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {member.achievements.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-primary" /> Achievements
                </h3>
                <ul className="space-y-1">
                  {member.achievements.map((a, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Medal className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
                      {a}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex flex-wrap gap-3 mt-8 pt-6 border-t">
              {member.email && (
                <Button asChild className="rounded-full">
                  <a href={`mailto:${member.email}`}><Mail className="w-4 h-4 mr-2" />Send Email</a>
                </Button>
              )}
              <Button variant="outline" className="rounded-full" onClick={() => { navigator.clipboard.writeText(member.email || ""); }}>
                <Copy className="w-4 h-4 mr-2" />Copy Email
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── LOADING ─────────────────────
function LoadingGrid({ count = 6 }: { count?: number }) {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: count }).map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="w-24 h-24 rounded-full mx-auto mb-4" />
              <Skeleton className="h-5 w-32 mx-auto mb-2" />
              <Skeleton className="h-4 w-24 mx-auto mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mx-auto" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── EMPTY ───────────────────────
function EmptyState() {
  return (
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <Users className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-foreground mb-2">No Members Found</h3>
        <p className="text-muted-foreground">No team members match your current search criteria.</p>
      </div>
    </section>
  );
}