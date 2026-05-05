import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL ?? "https://study-in-asia.vercel.app";
  const now = new Date();

  return [
    { url: `${baseUrl}/`, lastModified: now },
    { url: `${baseUrl}/countries`, lastModified: now },
    { url: `${baseUrl}/universities`, lastModified: now },
    { url: `${baseUrl}/courses`, lastModified: now },
    { url: `${baseUrl}/accommodation`, lastModified: now },
    { url: `${baseUrl}/jobs`, lastModified: now },
    { url: `${baseUrl}/dashboard`, lastModified: now },
  ];
}

