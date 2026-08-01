# Formato de Descripciones Comerciales

## Objetivo

Las descripciones comerciales representan el producto que recibe el cliente.

Son utilizadas por múltiples componentes del sistema, por lo que deben mantenerse consistentes entre todos los módulos.

Una descripción incorrecta puede generar confusión aunque el precio sea correcto.

---

# Dónde se utilizan

Las descripciones aparecen en:

- Carrito
- Presupuestos
- PDF
- WhatsApp
- Historial
- Base de datos
- Edición de presupuestos

Por este motivo existe un único estándar.

---

# Filosofía

Las descripciones deben ser:

- claras;
- consistentes;
- reutilizables;
- fáciles de leer;
- fáciles de buscar.

Nunca deben depender del módulo que las muestra.

---

# Formato interno

Las descripciones siempre se almacenan en formato normal.

Ejemplo:

Ventana 120x110 aluminio blanco Herrero vidrio DVH 4+9+4

---

# Formato de presentación

| Lugar         | Formato    |
| ------------- | ---------- |
| Carrito       | Normal     |
| WhatsApp      | Normal     |
| Presupuesto   | MAYÚSCULAS |
| PDF           | MAYÚSCULAS |
| Base de datos | Normal     |
| Debug         | Normal     |

---

# Regla general

Siempre respetar el siguiente orden:

Producto

↓

Medida

↓

Material

↓

Color

↓

Línea

↓

Vidrio

↓

Extras

---

# Material

Actualmente todos los productos utilizan:

aluminio

No deben aparecer variantes distintas.

---

# Ventanas

Formato:

Ventana {ancho}x{alto} aluminio {color} {linea} vidrio {vidrio} {extras}

Ejemplo:

Ventana 120x110 aluminio blanco Herrero vidrio DVH 4+9+4 c/guía c/mosquitero

Extras posibles:

- c/guía
- c/mosquitero
- PVC
- cortina aluminio
- c/premarco
- c/contramarco
- vidrio repartido

---

# Ventanas de Abrir

Formato:

Ventana de abrir {ancho}x{alto} aluminio {color} {linea} vidrio {vidrio} {extras}

Ejemplo:

Ventana de abrir 120x110 aluminio blanco Modena vidrio 4mm c/mosquitero

Extras:

- c/mosquitero
- c/premarco
- c/contramarco
- herrajes blancos

---

# Puertas

Formato:

Puerta {ancho}x{alto} aluminio {color} {linea} {mano} modelo {modelo} vidrio {vidrio} {extras}

Ejemplo:

Puerta 80x200 aluminio negro Modena derecha modelo 4 vidrio 3mm barral recto

---

# Puerta doble

Formato:

Puerta doble {ancho}x{alto} aluminio {color} {linea} modelo {modelo} vidrio {vidrio} {extras}

---

# Puerta y media

Formato:

Puerta y media {ancho}x{alto} aluminio {color} {linea} {mano} modelo {modelo} media {modeloMedia} vidrio {vidrio}

---

# Portones

Formato:

Portón {ancho}x{alto} aluminio {color} {linea} {hojas} hojas {tipo} modelo {modelo} vidrio {vidrio}

Extras:

- barral recto
- barral curvo
- media manija
- picaporte
- doble travesaño
- cartel prohibido

---

# Postigos

Siempre escribir:

Postigo

Nunca:

Postigón

Formato:

Postigo {ancho}x{alto} aluminio {color} {hojas} hojas {tipo} cierre {cierre}

Extras:

- tablillas microperforadas
- herrajes blancos

---

# Patagónicas

Formato:

Patagónica {ancho}x{alto} aluminio {color} {linea} vidrio {vidrio} ({composición}) {extras}

Ejemplos:

Patagónica 150x120 aluminio blanco Modena vidrio 4mm (Raja izquierda 40 + Paño fijo 110)

Patagónica 200x120 aluminio blanco Modena vidrio DVH (Raja izquierda 50 + Paño fijo 100 + Raja derecha 50)

Reglas:

Si la bisagra está a la izquierda:

Raja → Paño fijo

Si la bisagra está a la derecha:

Paño fijo → Raja

---

# Rajas

Formato:

Raja 40x120 aluminio blanco bisagra izquierda Herrero vidrio 4mm

---

# Mosquiteros

Corredizo

Mosquitero corredizo para ventana 120x110 aluminio blanco

Fijo

Mosquitero fijo 120x110 aluminio blanco

Puerta Mosquitera

Puerta mosquitera 80x200 aluminio blanco bisagra derecha

No poseen línea.

---

# Paños Fijos

Formato:

Paño fijo 120x110 aluminio blanco Herrero vidrio laminado 3+3

---

# Puertas Placa

Tradicional

Puerta placa 70x200x15 marco finger derecha

Embutir

Puerta embutir 70x200x15 marco finger

Marco aluminio

Puerta placa 70x200 marco aluminio derecha

Granero

Puerta granero 70x200 estilo Z

---

# Premarco y Contramarco

Como producto independiente:

Premarco aluminio blanco para 120x110

Contramarco aluminio blanco para 120x110

Como extra:

c/premarco

c/contramarco

Siempre deben ubicarse al final de la descripción.

---

# Regla Modena

Todo producto Modena que permita:

- premarco
- contramarco

debe agregarlos al final de la descripción.

---

# Incorporación de nuevos extras

Cada vez que un módulo incorpore un nuevo extra:

1. actualizar este documento;
2. mantener el orden establecido;
3. reutilizar las abreviaturas existentes;
4. evitar crear nuevas abreviaturas sin documentarlas.

---

# Objetivo Final

Todas las descripciones del sistema deben seguir un formato uniforme, independientemente del módulo que las genere, garantizando consistencia entre el carrito, los presupuestos, WhatsApp, los PDF y cualquier futura integración.
