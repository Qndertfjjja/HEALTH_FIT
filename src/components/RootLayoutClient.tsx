"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";

export default function RootLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const hideNavbar = ["/login", "/signup"].includes(pathname);

  return (
    <>
      {!hideNavbar && <Navbar />}
      {children}
    </>
  );
}
