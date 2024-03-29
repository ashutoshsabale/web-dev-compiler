import { Router } from "express"
import { changeCurrentPassword, getAllUsers, getCurrentUser, getUser, logOutUser, loginUser, refreshAccessToken, registerUser, updateAccountDetails, updateUserAvatar } from "../controllers/user.controller";
import { upload } from "../middlewares/multer.middleware";
import { verifyJWT } from "../middlewares/auth.middleware";

const router = Router();

router.route("/register").post(
    upload.single('avatar'), // use fields for multiple file uploads
    registerUser
);

router.route("/login").post(loginUser);
router.route("/all-users").get(getAllUsers)
router.route("/get-user/:username").get(getUser)

// secured routes
router.route("/logout").post(verifyJWT, logOutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-current-password").patch(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)
router.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)

export default router;