import { body, check, validationResult } from "express-validator";
import { dbService } from "../repositories/dbservice.js";
import { intoArray } from "./helpers.js";

const db = dbService.getDbServiceInstance();

export function validateRequestSchema(res, req, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.sendStatus(400).json({ errors: errors.array() });
  }
  console.log(errors);
  next();
}

const checkTag = (item) => {
  if (item.includes("<") || item.includes(">")) {
    throw new Error("Oj, ten znacznik(<, >) może być groźny :^)");
  } else return true;
};

const validators = {
  requireNickname: check("nickname")
    .trim()
    .isLength({ min: 5, max: 16 })
    .withMessage("Must be between 5 and 16 characters")
    .custom((item) => checkTag(item)),
  requireFullname: check("fullname")
    .trim()
    .isLength({ min: 3, max: 64 })
    .withMessage("Musi zawierać conajmniej 3 znaki, maksymalnie 64")
    .optional({ checkFalsy: true })
    .custom((item) => checkTag(item)),
  requireDesc: check("desc")
    .trim()
    .isLength({ max: 256 })
    .withMessage("Musi zawierać maksymalnie 256 znaków")
    .optional({ checkFalsy: true })
    .custom((item) => checkTag(item)),

  requirePrice: check("price").trim().toFloat().isFloat({ min: 1 }).withMessage("Must be a number greater or equal 1"),
  requireEmail: body("email")
    .trim()
    .normalizeEmail()
    .isEmail()
    .withMessage("Must be a valid email")
    .custom(async (email) => {
      const existingUser = await db.getGuideByEmail(email);
      if (existingUser) {
        throw new Error("Email in use");
      } else {
        return true;
      }
    })
    .withMessage("This email is in use")
    .custom((item) => checkTag(item)),

  requirePassword: check("password")
    .trim()
    .isLength({ min: 8, max: 32 })
    .withMessage("Must be between 8 and 32 characters")
    .custom((item) => checkTag(item)),

  requireConfirm: check("passwordConfirmation")
    .trim()
    .custom((passwordConfirmation, { req }) => {
      if (passwordConfirmation !== req.body.password) {
        throw new Error("Passwords must match");
      } else return true;
    })
    .custom((item) => checkTag(item)),

  requireCity: check("city")
    .custom(async (city) => {
      const cities = intoArray(city);
      async function checkAll() {
        let arr = [];
        for (let element of cities) {
          arr.push(await db.getCity(element));
          if (arr.length === cities.length) {
            return arr.every((item) => item === true);
          }
        }
      }
      const result = await checkAll();
      if (result === false) {
        throw new Error("City does not exist");
      } else {
        return true;
      }
    })
    .withMessage("Must provide a valid city")
    .custom((item) => checkTag(item)),

  requireCounty: check("county")
    .custom(async (county) => {
      let counties = intoArray(county);
      async function checkAll() {
        let arr = [];
        for (let element of counties) {
          arr.push(await db.getCounty(element));
          if (arr.length === counties.length) {
            return arr.every((item) => item === true);
          }
        }
      }
      const result = await checkAll();
      if (result === false) {
        throw new Error("County does not exist");
      } else {
        return true;
      }
    })
    .withMessage("Must provide a valid county")
    .custom((item) => checkTag(item)),
};

export const guideValidation = [
  validators.requireEmail,
  validators.requireNickname,
  // validators.requirePrice,
  validators.requirePassword,
  validators.requireConfirm,
  validators.requireCounty,
  validators.requireCity,
];

export const updateValidation = [
  validators.requireNickname.optional({ checkFalsy: true }),
  validators.requireFullname.optional({ checkFalsy: true }),
  validators.requireDesc.optional({ checkFalsy: true }),
  validators.requirePassword.optional({ checkFalsy: true }),
  validators.requireConfirm.optional({ checkFalsy: true }),
];

export const {
  requireConfirm,
  requireEmail,
  requireEmailExists,
  requirePassword,
  requirePrice,
  requireTitle,
  requireValidUsersPasswords,
  requireNickname,
} = validators;
