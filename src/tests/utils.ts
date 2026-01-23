export const userData = {
    username: "testuser",
    email: "test@user.com",
    password: "testpassword",
    token: "",
    _id: ""
};

export const postsList = [
    {
        title: "First Post",
        content: "This is the first post content",
        userId: "" // Will be populated dynamically
    },
    {
        title: "Second Post",
        content: "This is the second post content",
        userId: ""
    }
];

export const commentsList = [
    {
        content: "First Comment",
        postId: "", // Will be populated
        userId: ""
    },
    {
        content: "Second Comment",
        postId: "",
        userId: ""
    }
];
