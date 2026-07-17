import { useEffect, useState } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { Button } from "./button";

export function FullscreenButton() {
  const [fullscreen, setFullscreen] = useState(
    !!document.fullscreenElement,
  );

  useEffect(() => {
    const handleChange = () => {
      setFullscreen(!!document.fullscreenElement);
    };

    document.addEventListener("fullscreenchange", handleChange);

    return () => {
      document.removeEventListener(
        "fullscreenchange",
        handleChange,
      );
    };
  }, []);

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch (error) {
      console.error("Error fullscreen:", error);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={toggleFullscreen}
      title={
        fullscreen
          ? "Salir de pantalla completa"
          : "Pantalla completa"
      }
    >
      {fullscreen ? (
        <Minimize2 className="h-4 w-4" />
      ) : (
        <Maximize2 className="h-4 w-4" />
      )}
    </Button>
  );
}