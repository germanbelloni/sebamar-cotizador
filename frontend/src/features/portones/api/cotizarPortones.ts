// import api from "@/lib/api";

// import type { PortonesConfig } from "../types";

// type CotizacionPortonesResponse = {
//   descripcion: string;

//   precioVenta: number;
// };

// export async function cotizarPortones(config: PortonesConfig) {
//   const { data } = await api.post<CotizacionPortonesResponse>(
//     "/portones",
//     config,
//   );

//   return data;
// }

// import api from "@/lib/api";
// import type { PortonesConfig } from "../types";

// type CotizacionPortonesResponse = {
//   descripcion: string;
//   precioVenta: number;
// };

// export async function cotizarPortones(config: PortonesConfig) {
//   console.log("BODY PORTONES =>", config);

//   const { data } = await api.post<CotizacionPortonesResponse>(
//     "/portones",
//     config,
//   );

//   return data;
// }
import api from "@/lib/api";
import type { PortonesConfig } from "../types";

type CotizacionPortonesResponse = {
  descripcion: string;
  precioVenta: number;
};

export async function cotizarPortones(config: PortonesConfig) {
  console.log("=================================");
  console.log("CONFIG ENVIADO A BACKEND");
  console.log(config);
  console.log("MODELO:", config.modelo);
  console.log("=================================");

  const { data } = await api.post<CotizacionPortonesResponse>(
    "/portones",
    config,
  );

  return data;
}
