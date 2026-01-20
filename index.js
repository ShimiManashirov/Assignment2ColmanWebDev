const express = require("express");
const app = express();
const mongoose =  require("mongoose");

app.use(express.json());
const postRoute = require('./routes/postRoute.js');
const commentRoute = require('./routes/commentRoute.js');
app.use("/posts", postRoute); 
app.use("/posts/:postId/comments", commentRoute); 


const initApp = async () => { 
    const pr = new Promise((resolve) => {
            mongoose
            .connect(process.env.DATABASE_URL)
            .then(() => {
                console.log("Mongoose connected");
                resolve(app);
            })
            const db = mongoose.connection;
            db.on("error", (error) => console.error(error));
            db.once("open", () => console.log("Connected to Database"));

      });
    return pr;
    };


module.exports = initApp;