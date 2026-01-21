import initApp from "./index";
import type { Express } from "express";

const port = process.env.PORT || 3000;

initApp().then((app: Express) => {
    console.log("after initApp");   
    app.listen(port, () => {
        console.log(`Server is running on port http://localhost:${port}`);
    });
});
