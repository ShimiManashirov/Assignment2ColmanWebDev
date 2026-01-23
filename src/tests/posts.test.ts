
import request from 'supertest';
import initApp from '../index';
import Post from '../models/postModel';
import User from '../models/authModel';
import { Express } from 'express';
import mongoose from 'mongoose';
import { postsList, userData } from './utils';

let app: Express;
let token: string;
let userId: string;

beforeAll(async () => {
    app = await initApp();
    await Post.deleteMany({});
    await User.deleteMany({});

    // Register and Login to get token
    const registerRes = await request(app).post("/auth/register").send(userData);
    userId = registerRes.body.userId;
    token = registerRes.body.accessToken;
});

afterAll(async () => {
    await mongoose.connection.close();
});

describe('Posts Test Suite', () => {

    test('get all posts empty', async () => {
        const response = await request(app)
            .get('/posts')
            .set("Authorization", "Bearer " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual([]);
    });

    test('create a new post', async () => {
        for (const post of postsList) {
            const response = await request(app)
                .post('/posts')
                .set("Authorization", "Bearer " + token)
                .send({ ...post, userId });
            expect(response.statusCode).toBe(201);
            expect(response.body.title).toBe(post.title);
            expect(response.body.content).toBe(post.content);
            expect(response.body.userId).toBe(userId);
        }
    });

    test('get all posts', async () => {
        const response = await request(app)
            .get('/posts')
            .set("Authorization", "Bearer " + token);
        expect(response.statusCode).toBe(200);
        expect(response.body.length).toBe(postsList.length);
    });

    //get post by id
    test('get post by id', async () => {
        const posts = await request(app).get('/posts').set("Authorization", "Bearer " + token);
        const firstPost = posts.body[0];

        const response = await request(app)
            .get('/posts/' + firstPost._id)
            .set("Authorization", "Bearer " + token);

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(firstPost.title);
        expect(response.body._id).toBe(firstPost._id);
    });

    test('update post (and verify security against spoofing)', async () => {
        const posts = await request(app).get('/posts').set("Authorization", "Bearer " + token);
        const firstPost = posts.body[0];

        const updatedTitle = 'Inception Updated';
        const spoofedId = "000000000000000000000000";

        const response = await request(app)
            .put('/posts/' + firstPost._id)
            .set("Authorization", "Bearer " + token)
            .send({
                title: updatedTitle,
                userId: spoofedId // <--- Attempt to spoof
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.title).toBe(updatedTitle);
        // Security Verification: userId should NOT change
        expect(response.body.userId).toBe(userId);
        expect(response.body.userId).not.toBe(spoofedId);
    });

    test('delete post', async () => {
        const posts = await request(app).get('/posts').set("Authorization", "Bearer " + token);
        const firstPost = posts.body[0];

        const response = await request(app)
            .delete('/posts/' + firstPost._id)
            .set("Authorization", "Bearer " + token);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toBe('Post deleted successfully');

        const getResponse = await request(app)
            .get('/posts/' + firstPost._id)
            .set("Authorization", "Bearer " + token);
        expect(getResponse.statusCode).toBe(404);
    });
});