process.env.NODE_ENV = "test";
process.env.JWT_SECRET = "testsecret";

const request = require("supertest");
const app = require("../app");
const { connectDB, closeDB, clearDB } = require("../setup/testDB");

jest.setTimeout(20000);

let tokenUser1;
let tokenUser2;
let presupuestoId;

beforeAll(async () => {
  await connectDB();
});

beforeEach(async () => {
  await clearDB();

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

afterAll(async () => {
  await closeDB();
});

describe("📄 PRESUPUESTOS - SEGURIDAD", () => {
  it("bloquea acceso sin token", async () => {
    const res = await request(app).get("/api/presupuestos");

    expect(res.statusCode).toBe(401);
  });

  it("user1 crea presupuesto correctamente", async () => {
    const res = await request(app)
      .post("/api/presupuestos")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        cliente: "cliente test",
        fecha: "2026-01-01",
        items: [{ descripcion: "item", cantidad: 1, precio: 100 }],
        total: 100,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("_id");

    presupuestoId = res.body._id;
  });

  it("user2 NO ve presupuestos de user1", async () => {
    await request(app)
      .post("/api/presupuestos")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        cliente: "cliente test",
        fecha: "2026-01-01",
        items: [{ descripcion: "item", cantidad: 1, precio: 100 }],
        total: 100,
      });

    const res = await request(app)
      .get("/api/presupuestos")
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(0);
  });

  it("user2 NO accede al PDF de user1", async () => {
    const create = await request(app)
      .post("/api/presupuestos")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        cliente: "cliente test",
        fecha: "2026-01-01",
        items: [{ descripcion: "item", cantidad: 1, precio: 100 }],
        total: 100,
      });

    const id = create.body._id;

    const res = await request(app)
      .get(`/api/presupuestos/${id}/pdf`)
      .set("Authorization", `Bearer ${tokenUser2}`);

    expect(res.statusCode).toBe(403);
  });

  it("no crea presupuesto inválido", async () => {
    const res = await request(app)
      .post("/api/presupuestos")
      .set("Authorization", `Bearer ${tokenUser1}`)
      .send({
        cliente: "",
        items: [],
      });

    expect(res.statusCode).toBeGreaterThanOrEqual(400);
  });
});
