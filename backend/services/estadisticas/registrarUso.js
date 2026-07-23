const EstadisticaUso = require("../../models/EstadisticaUso");

async function registrarUso(userId, accion) {
  if (!userId || !accion) return;

  const fecha = new Date().toISOString().slice(0, 10);

  await EstadisticaUso.findOneAndUpdate(
    {
      userId,
      fecha,
    },
    {
      $inc: {
        [accion]: 1,
      },
      $set: {
        ultimaActividad: new Date(),
      },
    },
    {
      upsert: true,
      returnDocument: "after",
      setDefaultsOnInsert: true,
    },
  );
}

module.exports = registrarUso;
