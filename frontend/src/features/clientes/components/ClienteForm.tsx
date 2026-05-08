import type { Cliente } from "../types";

import { Input } from "@/components/ui/input";

interface ClienteFormProps {
  cliente: Cliente;
  setCliente: React.Dispatch<React.SetStateAction<Cliente>>;
}

export function ClienteForm({ cliente, setCliente }: ClienteFormProps) {
  const handleChange =
    (field: keyof Cliente) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setCliente((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  return (
    <div className="flex items-center gap-3">
      <Input
        type="text"
        placeholder="Nombre y apellido"
        value={cliente.nombre}
        onChange={handleChange("nombre")}
        className="h-9 w-[240px] text-sm"
      />

      <Input
        type="text"
        inputMode="tel"
        placeholder="Teléfono"
        value={cliente.telefono}
        onChange={handleChange("telefono")}
        className="h-9 w-[180px] text-sm"
      />
    </div>
  );
}
