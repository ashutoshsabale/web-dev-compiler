import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { getAllCodes, loadCode, saveCode } from "../controllers/compiler.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/all-codes").get(getAllCodes); // Get all codes in the database

// secured routes
router.route("/save-code").post(verifyJWT, upload.single("template"), saveCode);
router.route("/load-code").post(loadCode);

export default router;