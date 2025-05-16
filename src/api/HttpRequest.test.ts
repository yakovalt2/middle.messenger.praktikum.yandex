import { expect } from "chai";
import sinon from "sinon";
import { HttpRequest } from "./HttpRequest.ts";
import type { ApiError } from "./HttpRequest.ts";

if (!globalThis.fetch) {
  globalThis.fetch = () => Promise.resolve(new Response());
}

describe("HttpRequest", () => {
  let fetchStub: sinon.SinonStub;

  beforeEach(() => {
    fetchStub = sinon.stub(global, "fetch");
  });

  afterEach(() => {
    fetchStub.restore();
  });

  it("отправляет GET-запрос и получает результат", async () => {
    fetchStub.resolves(
      new Response(JSON.stringify({ data: "ok" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const result = await HttpRequest.get("/test");
    expect(result).to.deep.equal({ data: "ok" });
    expect(fetchStub.calledOnce).to.equal(true);
  });

  it("отправляет POST-запрос с телом", async () => {
    fetchStub.resolves(
      new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );

    const body = { name: "Alice" };
    const result = await HttpRequest.post<typeof body, { success: boolean }>(
      "/users",
      body,
    );
    expect(result).to.deep.equal({ success: true });
    expect(fetchStub.calledOnce).to.equal(true);
    const requestBody = JSON.parse(fetchStub.firstCall.args[1].body);
    expect(requestBody).to.deep.equal(body);
  });

  it("обрабатывает ошибку с JSON-ответом", async () => {
    fetchStub.resolves(
      new Response(JSON.stringify({ reason: "Not Found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      }),
    );

    try {
      await HttpRequest.get("/not-found");
      throw new Error("Ожидалась ошибка");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      expect(apiError.status).to.equal(404);
      expect(apiError.reason).to.equal("Not Found");
      expect(apiError.message).to.include("Ошибка 404");
    }
  });

  it("обрабатывает ошибку без JSON-ответа", async () => {
    fetchStub.resolves(
      new Response("Internal Server Error", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      }),
    );

    try {
      await HttpRequest.get("/fail");
      throw new Error("Ожидалась ошибка");
    } catch (error: unknown) {
      const apiError = error as ApiError;
      expect(apiError.status).to.equal(500);
      expect(apiError.reason).to.equal("Internal Server Error");
      expect(apiError.message).to.include("Ошибка 500");
    }
  });
});
