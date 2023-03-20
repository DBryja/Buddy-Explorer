import express from "express";
import bodyParser from "body-parser";
import cookieSession from "cookie-session";

import { dbService } from "./repositories/dbservice.js";
import { adminRouter } from "./routes/admin/admin.js";
import { mainRouter } from "./routes/user/main.js";
import { toolsRouter } from "./routes/user/tools.js";
import { guideSignInRouter } from "./routes/user/signin.js";
import { guideSignUpRouter } from "./routes/user/signup.js";
import { guideProfileRouter } from "./routes/user/profile.js";

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  cookieSession({
    keys: ["jgfsaduigibs1243"],
  })
);

app.use(adminRouter);
app.use(guideSignInRouter);
app.use(guideSignUpRouter);
app.use(guideProfileRouter);
app.use(mainRouter);
app.use(toolsRouter);

app.set("view engine", "ejs");

app.listen(3000, () => {
  console.log("listening");
});
