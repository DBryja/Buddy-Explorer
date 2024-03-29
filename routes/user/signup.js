import express from "express";
import { validationResult } from "express-validator";
import multer from "multer";

import { dbService } from "../../repositories/dbservice.js";
import { guideValidation } from "../../tools/validators.js";
import { handleErrors } from "../../tools/middlewares.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/guide/signup", async (req, res) => {
  if (req.session.guideId) {
    res.redirect("/guide/profile");
  } else {
    res.render("user/signupTemplate.ejs", { libs: ["tools"] });
  }
});

router.post("/guide/signup", upload.single("profile_pic"), guideValidation, handleErrors, async (req, res) => {
  if (validationResult(req).isEmpty()) {
    const db = dbService.getDbServiceInstance();
    const { email, password, nickname, county, city, fullname } = req.body;
    let profile_pic;
    if (req.file) {
      profile_pic = req.file.buffer.toString("base64");
    } else {
      profile_pic = false;
    }
    await db.createGuide(email, password, nickname, county, city, profile_pic, fullname);
    res.redirect("/guide/profile");
  }
});

export const guideSignUpRouter = router;
