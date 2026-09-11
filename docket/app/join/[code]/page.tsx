import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { JoinButton } from "./JoinButton";

export const dynamic = "force-dynamic";

// 1. Define an interface matching what your SQL function returns
interface ClassPreview {
  name: string;
  member_count: number;
}

export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;
  const supabase = await createClient();

  // 2. Cast the data type using "as" or pass the generic type if your client supports it
  const { data } = await supabase
    .rpc("preview_class_by_code", { p_code: code })
    .maybeSingle();
    
  const preview = data as ClassPreview | null;

  const { data: { user } } = await supabase.auth.getUser();

  if (!preview) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <h1 className="font-serif text-2xl mb-2">This invite link isn&rsquo;t valid</h1>
        <p className="text-muted text-[15px] mb-6">
          It may have been mistyped, or the class no longer exists.
        </p>
        <Link href="/" className="btn-secondary"> Go home </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-muted mb-2">Docket</p>
      <h1 className="font-serif text-3xl mb-2">Join {preview.name}?</h1>
      <p className="text-muted text-[15px] mb-8">
        {preview.member_count > 0
          ? `You're joining a class with ${preview.member_count} ${
              preview.member_count === 1 ? "person" : "people"
            } already in it.`
          : "Be the first to join this class."}
      </p>
      {user ? (
        <JoinButton code={code} />
      ) : (
        <Link href={`/login?next=${encodeURIComponent(`/join/${code}`)}`} className="btn-primary">
          Sign in to join
        </Link>
      )}
    </main>
  );
}
