import request from "supertest";
import mongoose from "mongoose";
import initApp from "../index";
import User from "../models/authModel";
import { Express } from "express";

let app: Express;
let accessToken: string;
let userId: string;

beforeAll(async () => {
    app = await initApp();
    await User.deleteMany();

    const response = await request(app).post("/auth/register").send({
        username: "testuser",
        email: "test@test.com",
        password: "password123",
    });
    accessToken = response.body.accessToken;
    userId = response.body.userId;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe("User API", () => {
    test("Get All Users", async () => {
        const response = await request(app)
            .get("/users")
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(Array.isArray(response.body)).toBeTruthy();
    });

    test("Get User By ID", async () => {
        const response = await request(app)
            .get(`/users/${userId}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body.username).toBe("testuser");
    });

    test("Update User", async () => {
        const response = await request(app)
            .put(`/users/${userId}`)
            .set("Authorization", `Bearer ${accessToken}`)
            .send({ username: "updateduser" });
        expect(response.statusCode).toBe(200);
        expect(response.body.user.username).toBe("updateduser");
    });

    test("Delete User", async () => {
        const response = await request(app)
            .delete(`/users/${userId}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(200);
    });

    test("Get deleted user should fail", async () => {
        // Re-login or use existing token? 
        // Access token might still be valid JWT, but middleware checks User.findById.
        // So it should fail with 401 or 404 depending on middleware.
        // Middleware: "User no longer exists" -> 401
        const response = await request(app)
            .get(`/users/${userId}`)
            .set("Authorization", `Bearer ${accessToken}`);
        expect(response.statusCode).toBe(401);
    });
});
