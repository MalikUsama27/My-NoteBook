const express = require('express');
const router = express.Router();
var fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');

// Router 1: Get all the nodes Using GET:"/api/notes/getuser"
router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Note.find({ user: req.user.id });
        res.json(notes)

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Enternal Server Error");
    }
})

// Router 2: Add a new note Using POST:"/api/notes/addnote"
router.post('/addnote', fetchuser, [
    body('title', 'Entre a valid title ').isLength({ min: 4 }),
    body('description', 'Description must be 5 characters').isLength({ min: 5 }),
], async (req, res) => {
    try {
        const { title, description, tag } = req.body;
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Note({
            title, description, tag, user: req.user.id
        })
        const saveNote = await note.save()
        res.json(saveNote)
    }
    catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Router 3:Update a Existing note Using PUT:"/api/notes/updatenote"
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    const { title, description, tag } = req.body;
    try {
        //Create a new note Object
        const newNote = {};
        if (title) { newNote.title = title };
        if (description) { newNote.description = description };
        if (tag) { newNote.tag = tag };

        //Find the note to be updated and update it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true })
        res.json({ note });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

// Router 4:Del a note Using DEl:"/api/notes/delnote"
router.delete('/delnote/:id', fetchuser, async (req, res) => {
    try {
        //Find the note to be del and del it
        let note = await Note.findById(req.params.id);
        if (!note) { return res.status(404).send("Not Found") };

        if (note.user.toString() !== req.user.id) {
            return res.status(401).send("Not Allowed");
        }
        note = await Note.findByIdAndDelete(req.params.id)
        res.json({ "Success": "Note has been Deleted" });

    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
})

module.exports = router