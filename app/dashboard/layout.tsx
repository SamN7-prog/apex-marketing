import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import AIAssistant from "../components/AIAssistant";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <>
      {children}
      <AIAssistant />
    </>
  );
}