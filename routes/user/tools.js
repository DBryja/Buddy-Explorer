import express from "express";

import { dbService } from "../../repositories/dbservice.js";

const router = express.Router();

router.get("/get_counties", async function (req, res) {
  const db = dbService.getDbServiceInstance();
  const string = req.query.counties;
  if (string.length > 1) {
    const result = await db.getCounties(string);
    res.send(result);
  }
});
router.get("/get_cities", async function (req, res) {
  const db = dbService.getDbServiceInstance();
  const string = req.query.cities;
  if (string.length > 1) {
    const result = await db.getCities(string);
    res.send(result);
  }
});

export const toolsRouter = router;
