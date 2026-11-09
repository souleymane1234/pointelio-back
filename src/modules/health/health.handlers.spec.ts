import type { Request, RequestHandler, Response } from "express";
import type Redis from "ioredis";
import type { PrismaService } from "../../infra/prisma/prisma.service";
import { createHealthHandlers } from "./health.handlers";

function mockResponse() {
  const res = {
    statusCode: 0,
    body: undefined as unknown,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(body: unknown) {
      res.body = body;
      return res;
    },
  };
  return res;
}

async function callReady(handler: RequestHandler) {
  const res = mockResponse();
  void handler({} as Request, res as unknown as Response, jest.fn());
  await new Promise((resolve) => setTimeout(resolve, 0));
  await new Promise((resolve) => setImmediate(resolve));
  return res;
}

describe("health handlers", () => {
  const queryRaw = jest.fn();
  const prisma = { $queryRaw: queryRaw } as unknown as PrismaService;
  const ping = jest.fn();
  const redis = { ping } as unknown as Redis;

  beforeEach(() => jest.resetAllMocks());

  it("is ready when database and redis respond", async () => {
    queryRaw.mockResolvedValue([{ "?column?": 1 }]);
    ping.mockResolvedValue("PONG");
    const { ready } = createHealthHandlers({ prisma, redis });

    const res = await callReady(ready);

    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({
      status: "ok",
      checks: { database: "up", redis: "up" },
    });
  });

  it("is not ready when the database is down", async () => {
    queryRaw.mockRejectedValue(new Error("connection refused"));
    ping.mockResolvedValue("PONG");
    const { ready } = createHealthHandlers({ prisma, redis });

    const res = await callReady(ready);

    expect(res.statusCode).toBe(503);
    expect(res.body).toMatchObject({ checks: { database: "down" } });
  });

  it("stops accepting traffic once shutdown starts", async () => {
    queryRaw.mockResolvedValue([]);
    ping.mockResolvedValue("PONG");
    const handlers = createHealthHandlers({ prisma, redis });
    handlers.markShuttingDown();

    const res = await callReady(handlers.ready);

    expect(res.statusCode).toBe(503);
    expect(res.body).toEqual({ status: "shutting_down" });
  });
});
