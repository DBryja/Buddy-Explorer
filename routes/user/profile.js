import express from "express";
import multer from "multer";

import { dbService } from "../../repositories/dbservice.js";
import { handleErrorsProfile } from "../../tools/middlewares.js";
import { updateValidation } from "../../tools/validators.js";
import { intoArray } from "../../tools/helpers.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get("/guide/profile", async (req, res) => {
  const db = dbService.getDbServiceInstance();
  if (!req.session.guideId) {
    res.redirect("/guide/signin");
  } else {
    const guide = await db.showGuide(req.session.guideId);
    guide.guideId = req.session.guideId;
    res.render("user/profileTemplate.ejs", { guide: guide, libs: ["tools"], errors: [] });
  }
});

router.get("/guide/signout", async (req, res) => {
  req.session.guideId = false;
  console.log("logged out");
  res.redirect("/guide/signin");
});

router.post(
  "/guide/profile/:type",
  upload.single("profile_pic"),
  updateValidation,
  handleErrorsProfile,
  async (req, res) => {
    const db = dbService.getDbServiceInstance();
    const errors = [];

    const { guide_id: id } = req.body;
    const type = req.params.type;
    switch (type) {
      case "nickname":
      case "fullname":
      case "desc":
        db.updateData(eval("req.body." + type), type, id);
        break;

      case "password":
        db.updatePassword(id, password);
        break;

      case "city":
      case "county":
        const { county, city } = req.body;
        let arr;
        if (type === "county") {
          arr = intoArray(county);
        } else {
          arr = intoArray(city);
        }
        db.updatePlaces(id, type, arr);
        break;

      case "profile_pic":
        let image = req.file.buffer.toString("base64");
        db.updateImage(id, image);
        break;

      case "delete":
        await db.deleteGuide(req.body.guide_id);
        res.redirect("/");
        return;
    }

    if (!errors[0]) {
      res.redirect("/guide/profile");
      return;
    }

    const guide = await db.showGuide(req.session.guideId);
    res.render("user/profileTemplate.ejs", { guide: guide, libs: ["tools"], errors: errors });
  }
);

export const guideProfileRouter = router;

// UPDATE `guides_data` SET `desc` = 'Bardzo fajny opis' WHERE `guides_data`.`id` = 64
// UPDATE guides_data SET desc = 'Bardzo fajny i ciekawy opis' WHERE guides_data.guide_id = "86"
// UPDATE guides_data SET fullname = 'Testowy Test3' WHERE guides_data.guide_id = '86'

// Cześć, jestem Dawid.
// Od kilku lat jestem lokalnym przewodnikiem.
// Poza zwiedzaniem uwielbiam folklor.
// Chętnie Cię oprowadzę i opowiem o moich okolicach :)
