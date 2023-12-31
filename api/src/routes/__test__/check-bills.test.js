const request = require("supertest");
const { app } = require("../../app");
const { authClient } = require("../../authClient");

jest.mock("../../authClient", () => ({
  authClient: {
    makeApiCall: jest.fn(),
    refresh: jest.fn(),
  },
}));

jest.mock("../../middleware/requireAuth", () => ({
  requireAuth: (req, res, next) => next(),
}));

describe("GET /check-bills", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 'No previous invocation' on first call", async () => {
    authClient.makeApiCall.mockResolvedValue({
      json: {
        QueryResponse: {
          Bill: [],
        },
      },
    });

    const res = await request(app).get("/api/check-bills");

    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "No previous invocation");
  });

  it("should return 'No changes detected' if no new or modified bills", async () => {
    authClient.makeApiCall.mockResolvedValue({
      json: {
        QueryResponse: {
          Bill: [],
        },
      },
    });

    const res = await request(app).get("/api/check-bills");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "No changes detected");
  });

  it("should return added bills", async () => {
    authClient.makeApiCall.mockResolvedValue({
      json: {
        QueryResponse: {
          Bill: [
            { Id: "1", MetaData: { LastUpdatedTime: "2023-01-01T00:00:00Z" } },
          ],
        },
      },
    });

    const res = await request(app).get("/api/check-bills");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "1 addition");
  });

  it("should return modified bills", async () => {
    authClient.makeApiCall.mockResolvedValue({
      json: {
        QueryResponse: {
          Bill: [
            { Id: "1", MetaData: { LastUpdatedTime: "2023-01-02T00:00:00Z" } },
          ],
        },
      },
    });

    const res = await request(app).get("/api/check-bills");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "1 change");
  });

  it("should handle multiple additions and modifications", async () => {
    authClient.makeApiCall.mockResolvedValue({
      json: {
        QueryResponse: {
          Bill: [
            { Id: "1", MetaData: { LastUpdatedTime: "2023-01-03T00:00:00Z" } },
            { Id: "2", MetaData: { LastUpdatedTime: "2023-01-03T00:00:01Z" } },
          ],
        },
      },
    });

    const res = await request(app).get("/api/check-bills");
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("message", "1 addition 1 change");
  });
});
