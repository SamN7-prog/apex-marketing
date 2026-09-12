import { createClient } from "../../utils/supabase/server";

export default async function SupabaseTest() {
  const supabase = await createClient();

  const { error } = await supabase.auth.getUser();

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-3xl font-bold">Supabase Connection Test</h1>

        <p className="mt-4">
          {error
            ? `Supabase responded: ${error.message}`
            : "✅ Supabase is connected!"}
        </p>
      </div>
    </main>
  );
}