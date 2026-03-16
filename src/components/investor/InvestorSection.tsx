import { cn } from "@/lib/utils";

type InvestorSectionProps = {
  id: string;
  children: React.ReactNode;
  className?: string;
};

export function InvestorSection({
  id,
  children,
  className,
}: InvestorSectionProps) {
  return (
    <section
      id={id}
      className={cn(
        "scroll-mt-24 border-b border-border/50 py-16 last:border-b-0 md:py-24",
        className
      )}
    >
      <div className="mx-auto max-w-5xl px-6">{children}</div>
    </section>
  );
}
