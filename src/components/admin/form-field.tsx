import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  id: string;
  required?: boolean;
  description?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, id, required, description, error, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-foreground">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      {description && (
        <p className="text-xs text-muted-foreground/60">{description}</p>
      )}
      {children}
      {error && (
        <p className="text-xs text-red-600">{error}</p>
      )}
    </div>
  );
}

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export function Input({ error, className, ...props }: InputProps) {
  return (
    <input
      className={cn(
        "w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition-all",
        "focus:outline-none focus:ring-2 focus:ring-foreground/20",
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
          : "border-border/40 hover:border-border focus:border-foreground/40",
        className
      )}
      {...props}
    />
  );
}

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export function Textarea({ error, className, ...props }: TextareaProps) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition-all resize-none",
        "focus:outline-none focus:ring-2 focus:ring-foreground/20",
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
          : "border-border/40 hover:border-border focus:border-foreground/40",
        className
      )}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export function Select({ error, className, children, ...props }: SelectProps) {
  return (
    <select
      className={cn(
        "w-full rounded-lg border bg-white px-4 py-2.5 text-sm transition-all",
        "focus:outline-none focus:ring-2 focus:ring-foreground/20",
        error
          ? "border-red-300 focus:border-red-500 focus:ring-red-500/20"
          : "border-border/40 hover:border-border focus:border-foreground/40",
        className
      )}
      {...props}
    >
      {children}
    </select>
  );
}

