const mongoose = require("mongoose");

// 🔌 CONNECT
const connectDB = async () => {
  await mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

// 🧹 LIMPIAR DB (🔥 CLAVE)
const clearDB = async () => {
  const collections = mongoose.connection.collections;

  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

// ❌ CLOSE
const closeDB = async () => {
  await mongoose.connection.close();
};

module.exports = {
  connectDB,
  clearDB,
  closeDB,
};
