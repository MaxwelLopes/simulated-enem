import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
        outline: "text-foreground",
        inProgress:
          "border-transparent bg-yellow-500 text-yellow-800 hover:bg-yellow-400", // Amarelo para "Em Andamento"
        completed:
          "border-transparent bg-green-300 text-green-800 hover:bg-green-400", // Verde para "Finalizado"
        pending:
          "border-transparent bg-gray-300 text-gray-800 hover:bg-gray-200", // Cinza para "Pendente"
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({color=undefined, className, variant, ...props }: BadgeProps) {

  const variantClass = variant === "default" && color
    ? `bg-${color}-500 text-${color}-800 hover:bg-${color}-400` 
    : badgeVariants({ variant });

  return (
    <div className={cn(variantClass, className)} {...props} />
  );
}

export { Badge, badgeVariants };
