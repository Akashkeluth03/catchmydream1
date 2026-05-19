import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { SiteHeader } from "@/components/site-header";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: {
    default: "CatchMyDream",
    template: "%s • CatchMyDream",
  },
  description:
    "CatchMyDream: Search universities, courses, tuition, visas, scholarships, accommodation, and jobs across top Asian destinations.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" suppressHydrationWarning className="h-full">
      <body
        className="min-h-full bg-[#F8F9FA] text-[#212121] antialiased"
      >
        <ThemeProvider>
          <SiteHeader session={session} />
          <main className="flex-1">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
