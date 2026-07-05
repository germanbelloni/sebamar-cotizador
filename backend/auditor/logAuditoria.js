const fs = require("fs");
const path = require("path");

const LOG_DIR = path.join(__dirname, "..", "logs", "auditor");

if (!fs.existsSync(LOG_DIR)) {
  fs.mkdirSync(LOG_DIR, { recursive: true });
}

function logAuditoria(modulo, usuario, request, resultado, auditoria) {
  if (auditoria.valido) return;

  const fecha = new Date();

  const archivo = `auditor-${fecha.toISOString().slice(0, 10)}.jsonl`;

  const file = path.join(LOG_DIR, archivo);

  const registro = {
    fecha: fecha.toISOString(),

    modulo,

    usuario: {
      id: usuario?._id,
      nombre: usuario?.nombre,
      empresa: usuario?.empresa,
      perfil: usuario?.perfil,
    },

    request,

    resultado,

    auditoria,
  };

  fs.appendFileSync(file, JSON.stringify(registro) + "\n");

  console.log("📝 Auditoría registrada:", file);
}

module.exports = logAuditoria;
