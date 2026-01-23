
import request from 'supertest';
import initApp from '../index';
import { Express } from 'express';
import Comment from '../models/commentModel';
import Post from '../models/postModel';
import User from '../models/authModel';
import mongoose from 'mongoose';
import { commentsList, userData, postsList } from './utils';

let app: Express;
let token: string;
let userId: string;
let postId: string;

beforeAll(async () => {
    app = await initApp();
    await Comment.deleteMany({});
    await Post.deleteMany({});
    await User.deleteMany({});

    // 1. Register and Login
    const registerRes = await request(app).post("/auth/register").send(userData);
    userId = registerRes.body.userId;
    token = registerRes.body.accessToken;

    // 2. Create a Post to comment on
    const postRes = await request(app)
        .post('/posts')
        .set("Authorization", "Bearer " + token)
        .send({ ...postsList[0], userId });
    postId = postRes.body._id;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Comments Test Suite', () => {

    test('Create Comments', async () => {
        for (const comment of commentsList) {
            const response = await request(app)
                .post(`/posts/${postId}/comments`)
                .set("Authorization", "Bearer " + token)
                .send({ ...comment, userId });

            expect(response.statusCode).toBe(201);
            expect(response.body.content).toBe(comment.content);
            expect(response.body.post).toBe(postId);
            expect(response.body.userId).toBe(userId);
        }
    });

    test('get all comments for post', async () => {
        const response = await request(app)
            .get(`/posts/${postId}/comments`)
            .set("Authorization", "Bearer " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(commentsList.length);
    });

    test('update comment (and check security)', async () => {
        // Get a comment to update
        const comments = await request(app).get(`/posts/${postId}/comments`).set("Authorization", "Bearer " + token);
        const firstComment = comments.body[0];

        const updatedContent = 'This is my updated comment';
        const spoofedId = "000000000000000000000000";

        const response = await request(app)
            .put(`/posts/${postId}/comments/${firstComment._id}`)
            .set("Authorization", "Bearer " + token)
            .send({
                content: updatedContent,
                userId: spoofedId // <--- Attempt to spoof
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.content).toBe(updatedContent);
        // Security Check
        expect(response.body.userId).toBe(userId);
        expect(response.body.userId).not.toBe(spoofedId);
    });

    test('delete comment', async () => {
        const comments = await request(app).get(`/posts/${postId}/comments`).set("Authorization", "Bearer " + token);
        const firstComment = comments.body[0];

        const response = await request(app)
            .delete(`/posts/${postId}/comments/${firstComment._id}`)
            .set("Authorization", "Bearer " + token);

        expect(response.statusCode).toBe(204); // Controller returns 204 for success
    });
});