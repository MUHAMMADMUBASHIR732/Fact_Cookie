// Shared frame for marketing pages: smooth scroll, progress bar, header, footer, back-to-top.
import { BackToTop } from "@/components/BackToTop";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { SmoothScroll } from "@/components/SmoothScroll";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SmoothScroll />
      <div className="progress" aria-hidden />
      <SiteHeader />
      {children}
      <SiteFooter />
      <BackToTop />
    </>
  );
}
