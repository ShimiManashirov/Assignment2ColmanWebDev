
import request from "supertest";
import initApp from "../index";
import { Express } from "express";
import User from "../models/authModel";
import mongoose from "mongoose";
import { userData, postsList } from "./utils";

let app: Express;

beforeAll(async () => {
  app = await initApp();
  await User.deleteMany();
});

afterAll(async () => {
  await mongoose.connection.close();
});

describe("Test Auth Suite", () => {
  test("Test post created without token fails", async () => {
    const postData = postsList[0];
    const response = await request(app).post("/posts").send(postData);
    expect(response.status).toBe(401);
  });

  test("Test Registration", async () => {
    const { email, password, username } = userData;
    const response = await request(app).post("/auth/register").send(
      { email, password, username }
    );
    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty("accessToken"); // Changed from token to accessToken based on controller
    userData.token = response.body.accessToken;
    userData._id = response.body.userId;
  });

  test("create a post with token succeeds", async () => {
    const postData = { ...postsList[0], userId: userData._id };
    const response = await request(app)
      .post("/posts")
      .set("Authorization", "Bearer " + userData.token)
      .send(postData);
    expect(response.status).toBe(201);
  });

  test("create a post with compromised token fails", async () => {
    const postData = postsList[0];
    const compromizedToken = userData.token + "a";
    const response = await request(app)
      .post("/posts")
      .set("Authorization", "Bearer " + compromizedToken)
      .send(postData);
    expect(response.status).toBe(403); // authMiddleware returns 403 on catch
  });

  test("Test Login", async () => {
    const { username, password } = userData;
    const response = await request(app).post("/auth/login").send(
      { username, password }
    );
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty("accessToken");
    expect(response.body).toHaveProperty("refreshToken");
  });
});
