const express = require("express");
const { registerUser, loginUser } = require("../controllers/userControllers");
const {approveUser } = require('../controllers/AdminController')


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.put("/approve", approveUser);

module.exports = router;
