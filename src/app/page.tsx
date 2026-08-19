import type { Metadata } from "next";
import type { AboutData } from "@/types/about";
import HomeContent from "@/components/home/HomeContent";

export const metadata: Metadata = {
  title: "Home",
};

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

async function getAboutData(): Promise<AboutData | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/about/all`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = await res.json();
    return (json?.data as AboutData) ?? null;
  } catch (err) {
    console.error("Failed to fetch about data for home page:", err);
    return null;
  }
}

export default async function Home() {
  const aboutData = await getAboutData();

  return (
    <HomeContent
      aboutPage={aboutData?.aboutPage ?? null}
      statistics={aboutData?.statistics ?? []}
      testimonials={aboutData?.testimonials ?? []}
      gallery={aboutData?.gallery ?? []}
    />
  );
}