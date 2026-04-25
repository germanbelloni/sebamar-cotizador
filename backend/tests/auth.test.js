const request = require("supertest");
const app = require("../app");
const { connectDB, closeDB } = require("../setup/testDB");

// ⚙️ ENV
process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testsecret";
process.env.MONGODB_URI =
  "mongodb+srv://sebamar_test:1234test@cluster0.fqvtvdh.mongodb.net/test_db";

// ⏱ TIMEOUT
jest.setTimeout(20000);

// 🔌 DB
beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());

describe("AUTH", () => {
  it("deberia registrar un usuario", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "jest_user_" + Date.now(),
        password: "1234",
      });

    expect(res.statusCode).toBe(201);
  });

  it("no deberia permitir usuario duplicado", async () => {
    const nombre = "jest_user_dup_" + Date.now();

    await request(app).post("/api/auth/register").send({
      nombre,
      password: "1234",
    });

    const res = await request(app).post("/api/auth/register").send({
      nombre,
      password: "1234",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Usuario ya existe");
  });

  it("deberia loguear y devolver token", async () => {
    const nombre = "jest_user_login_" + Date.now();

    await request(app).post("/api/auth/register").send({
      nombre,
      password: "1234",
    });

    const res = await request(app).post("/api/auth/login").send({
      nombre,
      password: "1234",
    });

    expect(res.body.token).toBeDefined();
  });
});

