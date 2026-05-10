const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const { signup, signupPost, login, loginPost, logout } = require("../constrollers/user.js");



//signup routes
router
.route("/signup")
.get(signup)
.post(wrapAsync(signupPost));


// router.get("/signup", (req, res) => {
//   res.render("users/signup.ejs");
// });
// router.post("/signup", wrapAsync(signup));


//login routes
router
.route("/login")
.get(login)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  loginPost,
)


// router.get("/login", login);

// router.post(
//   "/login",
//   saveRedirectUrl,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   loginPost,
// );


//logout route
router.get("/logout", logout);

module.exports = router;
