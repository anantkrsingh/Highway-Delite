import Note from "../models/Notes";
import { Request, Response } from "express";
export async function createNote(req: Request, res: Response) {
    const { title, content } = req.body;
    if (!title || !content) {
        return res.status(400).json({ message: "Title and content are required" });
    }
    try {
        const newNote = await Note.create({ title, content, user: req.user._id });
        res.status(201).json(newNote);
    } catch (error) {
        res.status(500).json({ message: "Failed to create note", error });
    }
}
export async function getNotes(req: Request, res: Response) {
    try {
        const notes = await Note.find({ user: req.user?._id });
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: "Failed to retrieve notes", error });
    }
}
export async function deleteNote(req: Request, res: Response) {
    try {
        const { id } = req.params;
        await Note.findOneAndDelete({ _id: id, user: req.user?._id });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: "Failed to delete note", error });
    }
}
export async function updateNote(req: Request, res: Response) {
    try {
        const { title, content } = req.body;
        const note = await Note.findOneAndUpdate({ _id: req.params.id, user: req.user?._id }, { title, content }, { new: true });
        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({ message: "Failed to update note", error });
    }
}