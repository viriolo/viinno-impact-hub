import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { InputHTMLAttributes, ReactNode } from "react";

interface IconInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon: ReactNode;
}

export function IconInput({ icon, className, ...props }: IconInputProps) {
  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
        {icon}
      </div>
      <Input className={cn("pl-9", className)} {...props} />
    </div>
  );
}