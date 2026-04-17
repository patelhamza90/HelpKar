const express = require("express");
const { signUpValidation, signInValidation, workerSignUpValidation, workerSignInValidation } = require("../Middlewares/AuthValidator");
const upload = require("../Middlewares/upload");
const emailAndPassVerify = require("../Middlewares/emailAndPassVerify");
const { workerSignUp, workerForgotPassword, verifyWorkerForPasswordReset, workerSignIn } = require("../Controllers/workerAuthContoller");
const { userSignIn, userSignUp } = require("../Controllers/userAuthController");
const router = express.Router()

/* ========== User Authentication ============ */
router.post('/user/signup', signUpValidation, userSignUp);
router.post('/user/signin', signInValidation, userSignIn);
 
/* ========== Worker Authentication ============ */
router.post('/worker/signup', upload.single('idProof'), workerSignUpValidation, workerSignUp);
router.post('/worker/signin', workerSignInValidation, workerSignIn);
router.post('/worker/signin/forgot-password', emailAndPassVerify, workerForgotPassword);
router.post('/worker/signin/verify-uid', emailAndPassVerify, verifyWorkerForPasswordReset);

module.exports = router;