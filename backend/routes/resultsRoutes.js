const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const { getMyResults, getResultsByRoll } = require("../controllers/resultsController");

const router = express.Router();

router.get("/me", protect, getMyResults);
router.get("/:hlno", protect, getResultsByRoll);

module.exports = router;
