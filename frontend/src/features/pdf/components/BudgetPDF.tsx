import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

import type { Cliente } from "@/features/clientes/types";

import type { VentanaItem } from "@/features/ventanas/types";

import { formatCurrency } from "@/features/ventanas/utils/formatCurrency";

import type { Empresa } from "@/features/empresa/types";
type Props = {
  empresa: Empresa;
  cliente: Cliente;

  items: VentanaItem[];
};

const styles = StyleSheet.create({
  page: {
    padding: 32,

    fontSize: 11,

    fontFamily: "Helvetica",

    color: "#111",
  },

  header: {
    marginBottom: 24,
  },

  title: {
    fontSize: 22,

    fontWeight: 700,

    marginBottom: 4,
  },

  subtitle: {
    fontSize: 11,

    color: "#666",
  },

  section: {
    marginBottom: 20,
  },

  sectionTitle: {
    fontSize: 12,

    fontWeight: 700,

    marginBottom: 8,
  },

  clientText: {
    marginBottom: 4,
  },

  item: {
    borderBottom: "1 solid #ddd",

    paddingBottom: 10,

    marginBottom: 10,
  },

  itemDescription: {
    fontSize: 11,

    marginBottom: 4,
  },

  itemRow: {
    flexDirection: "row",

    justifyContent: "space-between",
  },

  totalBox: {
    marginTop: 24,

    paddingTop: 12,

    borderTop: "2 solid #111",

    flexDirection: "row",

    justifyContent: "space-between",
  },

  totalLabel: {
    fontSize: 14,

    fontWeight: 700,
  },

  totalValue: {
    fontSize: 14,

    fontWeight: 700,
  },
});

export function BudgetPDF({ empresa, cliente, items }: Props) {
  const total = items.reduce(
    (acc, item) => acc + item.subtotal * item.cantidad,
    0,
  );

  const today = new Date();

  const formattedDate = today.toLocaleDateString("es-AR");

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* HEADER */}

        <View style={styles.header}>
          <Text style={styles.title}>{empresa.nombre}</Text>

          <Text style={styles.subtitle}>Presupuesto de aberturas</Text>
        </View>

        {/* CLIENTE */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CLIENTE</Text>

          <Text style={styles.clientText}>Nombre: {cliente.nombre || "-"}</Text>

          <Text style={styles.clientText}>
            Teléfono: {cliente.telefono || "-"}
          </Text>

          <Text style={styles.clientText}>Fecha: {formattedDate}</Text>
        </View>

        {/* ITEMS */}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PRODUCTOS</Text>

          {items.map((item, index) => (
            <View key={index} style={styles.item}>
              <Text style={styles.itemDescription}>{item.description}</Text>

              <View style={styles.itemRow}>
                <Text>Cantidad: {item.cantidad}</Text>

                <Text>{formatCurrency(item.subtotal * item.cantidad)}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* TOTAL */}

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>TOTAL</Text>

          <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
        </View>
      </Page>
    </Document>
  );
}
