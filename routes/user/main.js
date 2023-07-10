import express from "express";
import { dbService } from "../../repositories/dbservice.js";
import { handleErrors } from "../../tools/middlewares.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("user/homepageTemplate.ejs", { libs: ["tools"] });
});

router.get("/search", async (req, res) => {
  const db = dbService.getDbServiceInstance();
  const guidesID = [];
  const guides = [];
  (await db.getAllGuides()).forEach((row) => {
    guidesID.push(row.guide_id);
  });
  // console.log(guidesID);
  // console.log(guides);
  for (let id of guidesID) {
    const result = await db.showGuide(id);
    guides.push(result);
  }
  res.render("user/searchTemplate.ejs", { guides: guides, error: false, libs: ["tools", "clipboard.min"] });
});

router.post("/search", async (req, res) => {
  const db = dbService.getDbServiceInstance();
  const guidesID = [];
  const guides = [];
  (await db.getGuideBy(req.body)).forEach((row) => {
    guidesID.push(row.guide_id);
  });
  for (let id of guidesID) {
    // const result = await db.showGuide(id);
    guides.push(await db.showGuide(id));
  }
  // console.log(guides[0]);
  if (!guides[0]) {
    res.render("user/searchTemplate.ejs", { guides: guides, error: true, libs: ["tools", "clipboard.min"] });
  } else {
    res.render("user/searchTemplate.ejs", { guides: guides, error: false, libs: ["tools", "clipboard.min"] });
  }
});

export const mainRouter = router;
