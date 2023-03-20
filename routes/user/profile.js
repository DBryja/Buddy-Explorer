import express from "express";

import { dbService } from "../../repositories/dbservice.js";
import { handleErrors } from "../../tools/middlewares.js";

const router = express.Router();

router.get("/guide/profile", async (req, res) => {
  const db = dbService.getDbServiceInstance();
  if (!req.session.guideId) {
    res.redirect("/guide/signin");
  } else {
    const guide = await db.showGuide(req.session.guideId);
    guide.guideId = req.session.guideId;
    res.render("user/profileTemplate.ejs", { guide: guide, libs: ["tools"] });
  }
});

router.get("/guide/signout", async (req, res) => {
  req.session.guideId = false;
  console.log("logged out");
  res.redirect("/guide/signin");
});

router.post("/guide/profile", handleErrors, async (req, res) => {
  const db = dbService.getDbServiceInstance();
  const { nickname, fullname, desc } = req.body;
  // if (nickname) console.log(nickname);
  // if (fullname) console.log(fullname);
  // if (desc) console.log(desc);

  res.redirect("back");
});

export const guideProfileRouter = router;
