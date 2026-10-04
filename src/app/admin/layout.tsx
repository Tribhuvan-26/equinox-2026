import type { Metadata } from "next";

/** Organiser console — never indexed, never followed, whatever links to it. */
export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false, nocache: true },
};

export default function AdminLayout({ children }: LayoutProps<"/admin">) {
  return children;
}
