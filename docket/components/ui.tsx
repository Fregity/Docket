import { accentHex } from "@/lib/colors";

export function ColorDot({ colorId, size = 8 }: { colorId: string; size?: number }) {
  return (
    <span
      className="inline-block rounded-full shrink-0"
      style={{ backgroundColor: accentHex(colorId), width: size, height: size }}
    />
  );
}

export function EmptyState({
  title,
  body,
  children,
}: {
  title: string;
  body: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center text-center py-16 px-6 animate-fade-in">
      <h2 className="font-serif text-2xl text-ink mb-2">{title}</h2>
      <p className="text-muted text-[15px] max-w-xs mb-6">{body}</p>
      <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">{children}</div>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="font-serif text-lg text-ink mb-3 mt-8 first:mt-0">
      {children}
    </h3>
  );
}
