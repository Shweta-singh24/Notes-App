//controllers/notesController.js
import Note from "../models/Note.js";

export async function createNote(req, res) {
  try {
    const { title, content, tags } = req.body;
    if (!title) return res.status(400).json({ message: "Title is required" });

    const note = await Note.create({
      owner: req.user._id,
      title,
      content: content || "",
      tags: Array.isArray(tags) ? tags : [],
    });

    return res.status(201).json({ note });
  } catch (err) {
    console.error("Create note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getNotes(req, res) {
  try {
    const userId = req.user._id;
    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Number(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const filter = { owner: userId };
    if (req.query.archived !== undefined) {
      filter.isArchived = req.query.archived === "true";
    }
    if (req.query.tag) {
      filter.tags = req.query.tag;
    }
    if (req.query.search) {
      const q = req.query.search;
      filter.$or = [
        { title: { $regex: q, $options: "i" } },
        { content: { $regex: q, $options: "i" } },
      ];
    }

    const [total, notes] = await Promise.all([
      Note.countDocuments(filter),
      Note.find(filter).sort({ isPinned: -1, updatedAt: -1 }).skip(skip).limit(limit),
    ]);

    return res.json({
      meta: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
      notes,
    });
  } catch (err) {
    console.error("Get notes error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getNoteById(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (String(note.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    return res.json({ note });
  } catch (err) {
    console.error("Get note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function updateNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (String(note.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    const updates = {};
    ["title", "content", "tags", "isArchived", "isPinned"].forEach(key => {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    });

    Object.assign(note, updates);
    await note.save();

    return res.json({ note });
  } catch (err) {
    console.error("Update note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (String(note.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    await note.remove(); // hard delete; change to soft-delete if desired
    return res.status(204).send();
  } catch (err) {
    console.error("Delete note error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function togglePin(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (String(note.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    note.isPinned = !note.isPinned;
    await note.save();
    return res.json({ note });
  } catch (err) {
    console.error("Toggle pin error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function toggleArchive(req, res) {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    if (String(note.owner) !== String(req.user._id)) return res.status(403).json({ message: "Forbidden" });

    note.isArchived = !note.isArchived;
    await note.save();
    return res.json({ note });
  } catch (err) {
    console.error("Toggle archive error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function stats(req, res) {
  try {
    const owner = req.user._id;
    const total = await Note.countDocuments({ owner });
    const pinned = await Note.countDocuments({ owner, isPinned: true });
    const archived = await Note.countDocuments({ owner, isArchived: true });

    const tagsAgg = await Note.aggregate([
      { $match: { owner } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    return res.json({ total, pinned, archived, tags: tagsAgg });
  } catch (err) {
    console.error("Stats error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}
