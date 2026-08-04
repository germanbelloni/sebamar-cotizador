import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Valor = "2_hojas" | "3_hojas_2_guias" | "3_hojas_3_guias";

type Props = {
  value: Valor;
  onChange: (value: Valor) => void;
};

export function ConstructionSection({ value, onChange }: Props) {
  return (
    <div className="space-y-2">
      <label className="mb-4 block text-base font-semibold">
        Tipo de construcción
      </label>

      <Select value={value} onValueChange={(value) => onChange(value as Valor)}>
        <SelectTrigger className="h-12">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          <SelectItem value="2_hojas">2 hojas</SelectItem>

          <SelectItem value="3_hojas_2_guias">3 hojas / 2 guías</SelectItem>

          <SelectItem value="3_hojas_3_guias">3 hojas / 3 guías</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
