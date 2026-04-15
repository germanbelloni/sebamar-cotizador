process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testsecret";
process.env.MONGODB_URI =
  "mongodb+srv://sebamar_test:1234test@cluster0.fqvtvdh.mongodb.net/test_db";

const request = require("supertest");
const app = require("../backend/app");
const { connectDB, closeDB } = require("../setup/testDB");

let tokenUser1;
let tokenUser2;
let presupuestoId;

beforeAll(async () => {
  await connectDB();

  // USER 1
  const nombre1 = "user1_" + Date.now();

  await request(app).post("/api/auth/register").send({
    nombre: nombre1,
    password: "1234",
  });

  const login1 = await request(app).post("/api/auth/login").send({
    nombre: nombre1,
    password: "1234",
  });

  tokenUser1 = login1.body.token;

  // USER 2
  const nombre2 = "user2_" + Date.now();

  await request(app).post("/api/auth/register").send({
    nombre: nombre2,
    password: "1234",
  });

  const login2 = await request(app).post("/api/auth/login").send({
    nombre: nombre2,
    password: "1234",
  });

  tokenUser2 = login2.body.token;
});

afterAll(async () => await closeDB());

describe("SEGURIDAD PRESUPUESTOS", () => {
  it("no deberia acceder sin token", async () => {
    const res = await request(app).get("/api/presupuestos");
    expect(res.statusCode).toBe(401);
  });

  it("user1 crea presupuesto", async () => {
    await request(app)
      .post("/api/presupuestos/nuevo")
      .set("Authorization", `Bearer ${tokenUser1}`);

    const res = await request(app)
      .post("/api/presupuestos")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        cliente: "cliente test",
        fecha: "2026-01-01",
        items: [{ descripcion: "item", cantidad: 1, precio: 100 }],
        total: 100,
      });

    presupuestoId = res.body._id;

    expect(res.statusCode).toBe(200);
  });

  it("user2 NO debe ver presupuestos de user1", async () => {
    const res = await request(app)
      .get("/api/presupuestos")
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(res.body.length).toBe(0);
  });

  it("user2 NO debe acceder al PDF de user1 (403)", async () => {
    const res = await request(app)
      .get(`/api/presupuestos/${presupuestoId}/pdf`)
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(res.statusCode).toBe(403);
  });
});
