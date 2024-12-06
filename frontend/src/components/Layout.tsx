import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Outlet } from "react-router-dom";

export function Layout() {
  return (
    <div className="h-full relative">
      <Header />
      <main className="flex-grow my-8">
        <div className="container mx-auto py-6 px-4">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  );
}
