const request = require('supertest');
const express = require('express');
const {authenticated} = require('../router/auth_users.js');
const usersdb = require('../router/usersdb.js');

const app = express();
app.use(express.json());
app.use('/', authenticated);

describe('POST /login', () => {
    it('should return 200 and a token when valid credentials are provided', async () => {
        const user = {user: "1", password: "1"};
        const response = await request(app).post('/login').query(user);
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
        expect(response.body.message).toBe('User logged in successfully');
    });

    it('should return 401 when invalid credentials are provided', async () => {
        const user = {user: 'invalid', password: 'invalid'};
        const response = await request(app).post('/login').send(user);

        expect(response.status).toBe(401);
        expect(response.body.message).toBe('Invalid credentials');
    });
});

describe('PUT /auth/review', () => {

    it('should return 200 when token is provided with isbn', async () => {
        const user = {user: "1", password: "1"};
        const loginResponse = await request(app).post('/login').query(user);
        const token = loginResponse.body.token; // Get the token from the login response
        const isbn = {isbn: "12325465345"};
        const  review = {review: "This is a test review"};
        const response = await request(app)
            .put('/auth/review')
            .set('Authorization', token)
            .query(isbn)
            .query(review);
        expect(response.status).toBe(200);
        expect(response.body.message).toBe('Review added successfully');
    });

});
describe('PUT /auth/review', () => {
    it('should return 400 when token provided but no isbn inside request', async () => {
        // First, make a successful login request to get a valid token
        const user = {user: "1", password: "1"};
        const loginResponse = await request(app).post('/login').query(user);

        const token = loginResponse.body.token; // Get the token from the login response

        // Now, make the PUT request with the valid token
        const response = await request(app)
            .put('/auth/review')
            .set('Authorization', token);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('ISBN and review are required');
    });

    it('should return 403 when no token is provided', async () => {
        const response = await request(app)
            .put('/auth/review');

        expect(response.status).toBe(403);
    });
});
