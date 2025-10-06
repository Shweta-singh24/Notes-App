// src/routes/noteRoutes.js
import express from "express";
import { body, validationResult } from "express-validator";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  createNote,
  getNotes,
  getNoteById,
  updateNote,
  deleteNote,
  togglePin,
  toggleArchive,
  stats,
} from "../controllers/noteController.js";

const router = express.Router();

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  next();
};

// All routes protected
router.use(authMiddleware);

router.get("/", getNotes);
router.get("/stats", stats);

router.post(
  "/",
  [
    body("title").isLength({ min: 1 }).withMessage("Title required"),
    body("content").optional().isString(),
    body("tags").optional().isArray(),
  ],
  handleValidation,
  createNote
);

router.get("/:id", getNoteById);

router.put(
  "/:id",
  [
    body("title").optional().isString(),
    body("content").optional().isString(),
    body("tags").optional().isArray(),
    body("isArchived").optional().isBoolean(),
    body("isPinned").optional().isBoolean(),
  ],
  handleValidation,
  updateNote
);

router.delete("/:id", deleteNote);

router.patch("/:id/pin", togglePin);
router.patch("/:id/archive", toggleArchive);

export default router;





