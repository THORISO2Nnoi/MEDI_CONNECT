const express = require("express");
const router = express.Router();
const staffController = require("../controllers/staffcontroller");
const multer = require("multer");
const path = require("path");

// Storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "profilePic") cb(null, "uploads/profile_pics/");
    else cb(null, "uploads/certificates/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// CRUD routes
router.post(
  "/",
  upload.fields([
    { name: "profilePic", maxCount: 1 },
    { name: "certificates", maxCount: 5 }
  ]),
  staffController.addStaff
);

router.get("/", staffController.getStaff);
router.put("/:id", staffController.updateStaff);
router.delete("/:id", staffController.deleteStaff);

module.exports = router;
