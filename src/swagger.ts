import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Assignment 2 API',
            version: '1.0.0',
            description: 'API for User, Post, and Comment management with Authentication',
            contact: {
                name: 'Developer',
            },
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 3000}`,
                description: 'Development server',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        username: { type: 'string', example: 'john_doe' },
                        email: { type: 'string', example: 'john@example.com' },
                    },
                },
                Post: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cb' },
                        title: { type: 'string', example: 'My First Post' },
                        content: { type: 'string', example: 'This is the content.' },
                        userId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                    },
                },
                Comment: {
                    type: 'object',
                    properties: {
                        _id: { type: 'string', example: '60d0fe4f5311236168a109cc' },
                        content: { type: 'string', example: 'Nice post!' },
                        userId: { type: 'string', example: '60d0fe4f5311236168a109ca' },
                        post: { type: 'string', example: '60d0fe4f5311236168a109cb' },
                    },
                },
            },
        },
    },
    apis: [],
};

const manualPaths = {
    '/auth/register': {
        post: {
            tags: ['Authentication'],
            summary: 'Register a new user',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['email', 'password', 'username'],
                            properties: {
                                email: { type: 'string' },
                                password: { type: 'string' },
                                username: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                201: { description: 'User registered successfully' },
                400: { description: 'Error' }
            }
        }
    },
    '/auth/login': {
        post: {
            tags: ['Authentication'],
            summary: 'Login',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['username', 'password'],
                            properties: {
                                username: { type: 'string' },
                                password: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Login successful' },
                401: { description: 'Invalid credentials' }
            }
        }
    },
    '/auth/logout': {
        post: {
            tags: ['Authentication'],
            summary: 'Logout',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['refreshToken'],
                            properties: {
                                refreshToken: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'Logged out' },
                400: { description: 'Error' }
            }
        }
    },
    '/auth/refresh': {
        post: {
            tags: ['Authentication'],
            summary: 'Refresh Token',
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['refreshToken'],
                            properties: {
                                refreshToken: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: {
                200: { description: 'New Access Token' },
                401: { description: 'Invalid Token' }
            }
        }
    },
    '/users': {
        get: {
            tags: ['Users'],
            summary: 'Get all users',
            security: [{ bearerAuth: [] }],
            responses: { 200: { description: 'List of users' } }
        }
    },
    '/users/{id}': {
        get: {
            tags: ['Users'],
            summary: 'Get user by ID',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'User data' } }
        },
        put: {
            tags: ['Users'],
            summary: 'Update user',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                username: { type: 'string' },
                                email: { type: 'string' },
                                password: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'User updated' } }
        },
        delete: {
            tags: ['Users'],
            summary: 'Delete user',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'User deleted' } }
        }
    },
    '/posts': {
        get: {
            tags: ['Posts'],
            summary: 'Get all posts',
            responses: { 200: { description: 'List of posts' } }
        },
        post: {
            tags: ['Posts'],
            summary: 'Create post',
            security: [{ bearerAuth: [] }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['title', 'content'],
                            properties: {
                                title: { type: 'string' },
                                content: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: { 201: { description: 'Post created' } }
        }
    },
    '/posts/{id}': {
        get: {
            tags: ['Posts'],
            summary: 'Get post by ID',
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Post data' } }
        },
        put: {
            tags: ['Posts'],
            summary: 'Update post',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                title: { type: 'string' },
                                content: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Post updated' } }
        },
        delete: {
            tags: ['Posts'],
            summary: 'Delete post',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'Post deleted' } }
        }
    },
    '/posts/{postId}/comments': {
        get: {
            tags: ['Comments'],
            summary: 'Get comments for post',
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            responses: { 200: { description: 'List of comments' } }
        },
        post: {
            tags: ['Comments'],
            summary: 'Add comment',
            security: [{ bearerAuth: [] }],
            parameters: [{ name: 'postId', in: 'path', required: true, schema: { type: 'string' } }],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            required: ['content'],
                            properties: {
                                content: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: { 201: { description: 'Comment created' } }
        }
    },
    '/posts/{postId}/comments/{commentId}': {
        put: {
            tags: ['Comments'],
            summary: 'Update comment',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'postId', in: 'path', required: true, schema: { type: 'string' } },
                { name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }
            ],
            requestBody: {
                content: {
                    'application/json': {
                        schema: {
                            type: 'object',
                            properties: {
                                content: { type: 'string' }
                            }
                        }
                    }
                }
            },
            responses: { 200: { description: 'Comment updated' } }
        },
        delete: {
            tags: ['Comments'],
            summary: 'Delete comment',
            security: [{ bearerAuth: [] }],
            parameters: [
                { name: 'postId', in: 'path', required: true, schema: { type: 'string' } },
                { name: 'commentId', in: 'path', required: true, schema: { type: 'string' } }
            ],
            responses: { 200: { description: 'Comment deleted' } }
        }
    }
};

const completeOptions: swaggerJsdoc.Options = {
    definition: {
        openapi: '3.0.0',
        info: options.definition!.info!,
        servers: options.definition!.servers,
        components: options.definition!.components,
        paths: manualPaths
    },
    apis: []
};

const swaggerSpec = swaggerJsdoc(completeOptions);

export { swaggerUi, swaggerSpec };
