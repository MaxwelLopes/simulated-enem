"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react"; // Ícones
import { Button } from "@/app/components/ui/button";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      // Aplica cores baseadas no tema atual usando os tokens do ShadCN
      className={`${
        theme === "light"
          ? "bg-secondary-foreground text-primary-foreground hover:bg-background/90"
          : "bg-secondary-foreground text-primary-foreground hover:bg-background/90"
      }`}
    >
      {theme === "light" ? (
        <Moon className="h-5 w-5" />
      ) : (
        <Sun className="h-5 w-5" />
      )}
    </Button>
  );
}
