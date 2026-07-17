const React = require("react");

function formatCurrency(value) {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function PrintableBudgetDocument({ empresa, cliente, items, fecha, numero }) {
  const baseUrl =
    process.env.APP_URL || `http://localhost:${process.env.PORT || 3000}`;

  let logo = empresa.logo;

  if (logo?.startsWith("/")) {
    logo = `${baseUrl}${logo}`;
  }

  const total = items.reduce((a, i) => a + i.subtotal, 0);

  const fechaFormateada = fecha
    ? new Date(fecha).toLocaleDateString("es-AR")
    : "-";

  const color1 = empresa.primaryColor || "#f5cc00";
  const color2 = empresa.secondaryColor || "#1f2937";

  return (
    <div
      style={{
        width: "800px",
        margin: "0 auto",
        background: "#fff",
        borderRadius: 20,
        overflow: "hidden",
        fontFamily: "Arial",
      }}
    >
      {" "}
      <div
        style={{
          height: 10,
          background: `linear-gradient(90deg, ${color1}, ${color2})`,
        }}
      />
      <div style={{ padding: 35 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <div>
            {logo && (
              <img
                src={logo}
                alt=""
                style={{
                  height: 70,
                  marginBottom: 20,
                }}
              />
            )}
            <div
              style={{
                color: "#666",
                fontSize: 13,
                lineHeight: 1.7,
              }}
            >
              <div>{empresa.nombre}</div>

              <div>{empresa.direccion}</div>

              <div>
                {empresa.telefono} · {empresa.email}
              </div>
            </div>
          </div>

          <div style={{ textAlign: "right" }}>
            <div
              style={{
                display: "inline-block",
                padding: "12px 26px",
                borderRadius: 14,
                color: "#fff",
                fontWeight: "bold",
                background: `linear-gradient(90deg, ${color1}, ${color2})`,
              }}
            >
              PRESUPUESTO
            </div>

            <div
              style={{
                marginTop: 30,
                color: "#888",
                fontSize: 12,
              }}
            >
              <div>N° #{numero}</div>

              <div style={{ marginTop: 8 }}>{fechaFormateada}</div>
              <div
                style={{
                  marginTop: 30,
                  color: "#888",
                  fontSize: 12,
                }}
              ></div>
            </div>
          </div>
        </div>{" "}
        <div
          style={{
            marginTop: 35,
            paddingTop: 25,
            borderTop: "1px solid #e5e7eb",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#888",
              fontWeight: "bold",
              letterSpacing: 2,
              marginBottom: 10,
            }}
          >
            INFORMACIÓN DEL CLIENTE
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: "bold",
            }}
          >
            {cliente.nombre || "Consumidor Final"}
          </div>

          <div
            style={{
              marginTop: 8,
              color: "#666",
            }}
          >
            {cliente.telefono || "Sin teléfono registrado"}
          </div>
        </div>{" "}
        <table
          style={{
            width: "100%",
            marginTop: 40,
            borderCollapse: "collapse",
            border: "1px solid #e5e7eb",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr
              style={{
                background: color1,
                color: "#fff",
              }}
            >
              <th style={{ padding: 14, width: 70 }}>Cant.</th>

              <th
                style={{
                  padding: 14,
                  textAlign: "left",
                }}
              >
                Descripción
              </th>

              <th
                style={{
                  padding: 14,
                  textAlign: "right",
                  width: 160,
                }}
              >
                Unitario
              </th>

              <th
                style={{
                  padding: 14,
                  textAlign: "right",
                  width: 160,
                }}
              >
                Subtotal
              </th>
            </tr>
          </thead>

          <tbody>
            {items.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderTop: "1px solid #eee",
                }}
              >
                <td
                  style={{
                    padding: 14,
                    textAlign: "center",
                  }}
                >
                  {item.cantidad}
                </td>

                <td style={{ padding: 14 }}>
                  <div
                    style={{
                      fontWeight: "bold",
                    }}
                  >
                    {item.descripcion}
                  </div>

                  <div
                    style={{
                      marginTop: 4,
                      color: "#888",
                      fontSize: 12,
                    }}
                  >
                    {item.titulo}
                  </div>
                </td>

                <td
                  style={{
                    padding: 14,
                    textAlign: "right",
                  }}
                >
                  {formatCurrency(item.precioUnitario)}
                </td>

                <td
                  style={{
                    padding: 14,
                    textAlign: "right",
                    fontWeight: "bold",
                  }}
                >
                  {formatCurrency(item.subtotal)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>{" "}
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: 35,
          }}
        >
          <div
            style={{
              width: 340,
              padding: 24,
              borderRadius: 18,
              color: "#fff",
              background: `linear-gradient(135deg, ${color1}, ${color2})`,
            }}
          >
            <div
              style={{
                fontSize: 12,
                letterSpacing: 2,
                opacity: 0.8,
                marginBottom: 10,
              }}
            >
              TOTAL FINAL
            </div>

            <div
              style={{
                fontSize: 34,
                fontWeight: "bold",
              }}
            >
              {formatCurrency(total)}
            </div>
          </div>
        </div>{" "}
        <div
          style={{
            marginTop: 35,
            border: "1px solid #e5e7eb",
            borderRadius: 14,
            padding: 20,
          }}
        >
          <div
            style={{
              fontSize: 10,
              fontWeight: "bold",
              color: "#888",
              letterSpacing: 2,
              marginBottom: 12,
            }}
          >
            TÉRMINOS Y CONDICIONES
          </div>

          <div
            style={{
              color: "#666",
              lineHeight: 1.6,
              fontSize: 9,
            }}
          >
            • Validez del presupuesto: 7 días.
            <br />
            • Plazo de entrega: 10/15 días hábiles.
            <br />• Consultar envío / Los precios pueden variar sin previo
            aviso.
          </div>
        </div>{" "}
      </div>
    </div>
  );
}

module.exports = PrintableBudgetDocument;
