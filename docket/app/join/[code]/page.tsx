import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { JoinButton } from "./JoinButton";

export const dynamic = "force-dynamic";

interface ClassPreview {
  name: string;
  member_count: number;
}

function Message({ title, body }: { title: string; body: string }) {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <h1 className="font-serif text-2xl mb-2">{title}</h1>
      <p className="text-muted text-[15px] mb-6">{body}</p>
      <Link href="/" className="btn-secondary"> Go home </Link>
    </main>
  );
}

export default async function JoinPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = await params;

  if (!/^[A-Za-z0-9]{4,12}$/.test(code)) {
    return (
      <Message
        title="This invite link isn’t valid"
        body="It may have been mistyped, or the class no longer exists."
      />
    );
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
        <p className="text-sm text-muted mb-2">DueBird</p>
        <h1 className="font-serif text-3xl mb-2">You&rsquo;re invited to a class</h1>
        <p className="text-muted text-[15px] mb-8">
          Sign in to see which class it is and join.
        </p>
        <Link href={`/login?next=${encodeURIComponent(`/join/${code}`)}`} className="btn-primary">
          Sign in to join
        </Link>
      </main>
    );
  }

  const { data, error } = await supabase
    .rpc("preview_class_by_code", { p_code: code })
    .maybeSingle();

  const preview = data as ClassPreview | null;

  if (error && error.message.includes("too_many_attempts")) {
    return (
      <Message
        title="Too many tries"
        body="Wait a little while and try that link again."
      />
    );
  }

  if (!preview) {
    return (
      <Message
        title="This invite link isn’t valid"
        body="It may have been mistyped, or the class no longer exists."
      />
    );
  }

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6 text-center">
      <p className="text-sm text-muted mb-2">DueBird</p>
      <h1 className="font-serif text-3xl mb-2">Join {preview.name}?</h1>
      <p className="text-muted text-[15px] mb-8">
        {preview.member_count > 0
          ? `You're joining a class with ${preview.member_count} ${
              preview.member_count === 1 ? "person" : "people"
            } already in it.`
          : "Be the first to join this class."}
      </p>
      <JoinButton code={code} />
    </main>
  );
}
