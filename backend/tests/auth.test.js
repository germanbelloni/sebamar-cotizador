const request = require("supertest");
const app = require("../app");
const { connectDB, closeDB, clearDB } = require("../setup/testDB");

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testsecret";

jest.setTimeout(20000);

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await clearDB(); // 🔥 clave: test aislados
});

afterAll(async () => {
  await closeDB();
});

describe("🔐 AUTH", () => {
  it("registra usuario correctamente", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({
        nombre: "user_" + Date.now(),
        password: "1234",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("usuario");
  });

  it("no permite duplicados", async () => {
    const nombre = "dup_" + Date.now();

    await request(app).post("/api/auth/register").send({
      nombre,
      password: "1234",
    });

    const res = await request(app).post("/api/auth/register").send({
      nombre,
      password: "1234",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toMatch(/existe/i);
  });

  it("login devuelve token válido", async () => {
    const nombre = "login_" + Date.now();

    await request(app).post("/api/auth/register").send({
      nombre,
      password: "1234",
    });

    const res = await request(app).post("/auth/login").send({
      nombre,
      password: "1234",
    });

    expect(res.statusCode).toBe(200);
    expect(res.body.token).toBeDefined();
    expect(typeof res.body.token).toBe("string");
  });

  it("login falla con password incorrecto", async () => {
    const nombre = "fail_" + Date.now();

    await request(app).post("/api/auth/register").send({
      nombre,
      password: "1234",
    });

    const res = await request(app).post("/auth/login").send({
      nombre,
      password: "wrong",
    });

    expect(res.statusCode).toBe(401);
  });
});
