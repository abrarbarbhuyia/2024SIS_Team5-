const express = require('express');
const router = express.Router();
const Note = require('../models/noteModel');
const databaseMaster = require('../databaseMaster');

/* Get all notes associated with a userId */
router.get('/getNotes/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        await databaseMaster.dbOp('find', 'NoteDetails', { query: { userId: userId } }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Get all notes associated with a restaurantId from a given userId */
router.get('/getNotesRestaurant/:userId/:restaurantId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const restaurantId = req.params.restaurantId;
        const query = { userId: userId, restaurantId: restaurantId }
        await databaseMaster.dbOp('find', 'NoteDetails', { query: query }).then(data => {
            res.json(data);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Create a note */
router.post('/createNote', async (req, res) => {
    try {
        const note = new Note({
            noteId: req.body.noteId,
            date: req.body.date,
            content: req.body.content,
            restaurantId: req.body.restaurantId,
            userId: req.body.userId
        });
        await databaseMaster.dbOp('insert', 'NoteDetails', { docs: [note] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Update the content of a given note (noteId) */
router.put('/editNote/:noteId', async (req, res) => {
    try {
        const { date, content } = req.body;
        const query = { noteId : req.params.noteId }
        const docs = { $set: { date: date, content: content } };
        await databaseMaster.dbOp('update', 'NoteDetails', { query, docs });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

/* Delete a note */
router.delete('/deleteNote/:noteId', async (req, res) => {
    try {
        const noteId = req.params.noteId;
        await databaseMaster.dbOp('delete', 'NoteDetails', { query: { noteId: noteId } } );
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;