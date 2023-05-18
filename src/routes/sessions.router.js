import passport from "passport";
import { Router } from "express";
import uploader from "../services/upload.js";
import sessionController from "../controllers/session.controller.js";
const router = Router();
router.post('/register', uploader.single('avatar'), sessionController.registro);
router.post('/', passport.authenticate('login', {failureRedirect: "/api/sessions/fail", session: false}), sessionController.createToken);
router.get("/fail", sessionController.fail);
router.get('/logout', sessionController.clearAndRedirect);
export default router;