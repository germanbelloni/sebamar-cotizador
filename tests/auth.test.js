process.env.JWT_SECRET = "testsecret";
jest.setTimeout(20000); // 👈 20 segundos

process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testsecret";
const request = require("supertest");
const app = require("../backend/app");
const { connectDB, closeDB } = require("../setup/testDB");

beforeAll(async () => await connectDB());
afterAll(async () => await closeDB());


process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testsecret";
process.env.MONGODB_URI = "mongodb+srv://sebamar_test:1234test@cluster0.fqvtvdh.mongodb.net/test_db";
describe("AUTH", () => {
  it("deberia registrar un usuario", async () => {
    const res = await request(app).post("/api/auth/register").send({
      nombre: "jest_user_" + Date.now(),
      password: "1234",
    });

    expect(res.statusCode).toBe(201);
  });

  it("no deberia permitir usuario duplicado", async () => {
    await request(app).post("/api/auth/register").send({
      nombre: "jest_user_2",
      password: "1234",
    });

    const res = await request(app).post("/api/auth/register").send({
      nombre: "jest_user_2",
      password: "1234",
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.error).toBe("Usuario ya existe");
  });

  it("deberia loguear y devolver token", async () => {
    await request(app).post("/api/auth/register").send({
      nombre: "jest_user_3",
      password: "1234",
    });

    const res = await request(app).post("/api/auth/login").send({
      nombre: "jest_user_3",
      password: "1234",
    });

    expect(res.body.token).toBeDefined();
  });
});
