// components/Footer.tsx
import { Separator } from "@/components/ui/separator";

export default function Footer() {
  return (
    <footer
      className="text-xs text-center py-4 w-full text-white"
      style={{ backgroundColor: "#1a1a1a" }}
    >
      <Separator className="mb-2 bg-zinc-700" />
      <p>
        Desarrollado por el equipo de <strong className="font-semibold">Sistemas · Grupo Tarahumara</strong>
      </p>
    </footer>
  );
}
