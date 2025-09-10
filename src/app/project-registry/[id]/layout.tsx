import { Header } from "@/components/header";

export default function ProjectDetailLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header userRole="buyer" />
      <main className="flex-1">{children}</main>
    </div>
  );
}
