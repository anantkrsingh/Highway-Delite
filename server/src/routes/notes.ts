import express from "express";
import { verifyUser } from "../middlewares/auth";
import { createNote, deleteNote, getNotes, updateNote } from "../controllers/notes";
const router = express.Router();



router.post("/create", verifyUser, createNote);
router.get("/all", verifyUser, getNotes);
router.delete("/delete/:id", verifyUser, deleteNote);
router.put("/update/:id", verifyUser, updateNote);
module.exports = router;