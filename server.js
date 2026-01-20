const initApp = require("./index");
const port = process.env.PORT;

initApp().then((app) => {
    console.log("after initApp");   
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
});