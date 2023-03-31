import { validationResult } from "express-validator";
import { dbService } from "../repositories/dbservice.js";

export const handleErrors = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    return res.render("user/signupTemplate.ejs", { errors: errors.array(), libs: ["tools"] });
  }
  await next();
};

export const handleErrorsProfile = async (req, res, next) => {
  const db = dbService.getDbServiceInstance();
  const guide = await db.showGuide(req.session.guideId);
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // return res.status(400).json({ errors: errors.array() });
    return res.render("user/profileTemplate.ejs", { guide: guide, libs: ["tools"], errors: errors.array() });
  }
  await next();
};
