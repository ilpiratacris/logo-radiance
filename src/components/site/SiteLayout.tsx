import type { ReactNode } from "react";
import { Header } from "@/components/site/Header";
import { Footer } from "@/components/site/Footer";
import { TopBar } from "@/components/site/TopBar";
import { BottomNav } from "@/components/site/BottomNav";
import { CartDrawer } from "@/components/site/CartDrawer";
import { SearchOverlay } from "@/components/site/SearchOverlay";

export function SiteLayout({
  children,
  hideBottomNav,
}: {
  children: ReactNode;
  hideBottomNav?: boolean;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <TopBar />
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <BottomNav hidden={hideBottomNav} />
      <CartDrawer />
      <SearchOverlay />
    </div>
  );
}
