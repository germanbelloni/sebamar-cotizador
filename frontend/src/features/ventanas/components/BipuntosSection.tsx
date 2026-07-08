import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Valor = "ninguno" | "normal" | "llave";

type Props = {
  izquierda: Valor;
  derecha: Valor;
  onChangeIzquierda: (v: Valor) => void;
  onChangeDerecha: (v: Valor) => void;
};

export function BipuntosSection({
  izquierda,
  derecha,
  onChangeIzquierda,
  onChangeDerecha,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
      <div className="space-y-2">
        <label className="text-base font-semibold">
          Bipunto hoja izquierda
        </label>

        <Select
          value={izquierda}
          onValueChange={(value) => onChangeIzquierda(value as Valor)}
        >
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ninguno">Ninguno</SelectItem>

            <SelectItem value="normal">Bipunto</SelectItem>

            <SelectItem value="llave">Bipunto con llave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <label className="text-base font-semibold">Bipunto hoja derecha</label>

        <Select
          value={derecha}
          onValueChange={(value) => onChangeDerecha(value as Valor)}
        >
          <SelectTrigger className="h-12 text-base">
            <SelectValue placeholder="Seleccionar" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="ninguno">Ninguno</SelectItem>

            <SelectItem value="normal">Bipunto</SelectItem>

            <SelectItem value="llave">Bipunto con llave</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
