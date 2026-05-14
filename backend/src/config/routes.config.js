const express = require("express");
const router = express.Router();

// --- AGRUPAMOS TODAS LAS LLAMADAS DE LA APLICACION ---
const authController = require("../controllers/auth.controller");
const usersController = require("../controllers/user.controller");
const matchesController = require("../controllers/match.controller");

const { authenticateToken } = require("../middlewares/auth.middleware");


// AUTH
// ------------------------------------------------------------------
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/profile", authenticateToken, authController.getProfile);
router.post("/refresh-token", authenticateToken, authenticateToken, authController.refreshToken);
        
// USERS 
// ------------------------------------------------------------------
router.delete("/user/:id", authenticateToken, usersController.deleteUser);
router.patch("/user/:id", authenticateToken, usersController.updateUser);

// MTCHES
// ------------------------------------------------------------------
router.post("/save", authenticateToken, matchesController.saveMatch);
router.get("/matches", authenticateToken, matchesController.getMatches);
router.delete("/matches/:id", authenticateToken, matchesController.deleteMatch);

module.exports = router;
