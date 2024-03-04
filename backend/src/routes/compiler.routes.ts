import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import { deleteCode, editCode, getAllCodes, getUserCodes, loadCode, saveCode, } from "../controllers/compiler.controller";
import { upload } from "../middlewares/multer.middleware";

const router = Router();

router.route("/all-codes").get(getAllCodes); // Get all codes in the database

// secured routes
router.route("/save-code").post(verifyJWT, upload.single("template"), saveCode);
router.route("/fetch-code/:username").get(getUserCodes);
router.route("/load-code").post(loadCode);
router.route("/delete-code").delete(verifyJWT, deleteCode)
router.route("/edit-code/:codeId").patch(verifyJWT, upload.single("template"), editCode)

export default router;