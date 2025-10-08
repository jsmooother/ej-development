interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: string;
    positive: boolean;
  };
}

export function StatCard({ title, value, icon, trend }: StatCardProps) {
  return (
    <div className="group rounded-2xl border border-border/50 bg-card p-6 transition-all duration-300 hover:border-border hover:shadow-lg">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground/60">{title}</p>
          <p className="mt-3 font-sans text-4xl font-normal tracking-tight text-foreground">{value}</p>
          {trend && (
            <div className="mt-3 flex items-center gap-1">
              <svg 
                className={`h-3 w-3 ${trend.positive ? "text-green-600" : "text-red-600"}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2.5} 
                  d={trend.positive ? "M13 7l5 5m0 0l-5 5m5-5H6" : "M11 17l-5-5m0 0l5-5m-5 5h12"} 
                />
              </svg>
              <span className={`text-xs font-medium ${trend.positive ? "text-green-600" : "text-red-600"}`}>
                {trend.value}
              </span>
            </div>
          )}
        </div>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-foreground/5 text-foreground/40 transition-all duration-300 group-hover:bg-foreground/10 group-hover:text-foreground/60">
          {icon}
        </div>
      </div>
    </div>
  );
}

