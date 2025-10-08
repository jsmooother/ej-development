interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 font-serif text-3xl font-light text-foreground">{value}</p>
          {trend && (
            <p className={`mt-2 text-xs ${trend.positive ? "text-green-600" : "text-red-600"}`}>
              {trend.positive ? "↗" : "↘"} {trend.value}
            </p>
          )}
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-2xl">
          {icon}
        </div>
      </div>
    </div>
  );
}

