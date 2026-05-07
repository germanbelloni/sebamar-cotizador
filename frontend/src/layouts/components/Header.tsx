import { Moon, Sun } from "lucide-react";

import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function Header() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <header className="flex items-center justify-between border-b border-border bg-card/30 px-6 py-4 backdrop-blur">
      <div>
        <h2 className="text-2xl font-bold">Ventanas Herrero</h2>

        <p className="text-sm text-muted-foreground">
          Configuración y cotización
        </p>
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => setTheme(isDark ? "light" : "dark")}
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </header>
  );
}
