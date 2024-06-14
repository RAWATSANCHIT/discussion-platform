// src/models/Discussion.js

const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    content: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    replies: [{
        content: { type: String, required: true },
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
        likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    }],
}, { timestamps: true });

const discussionSchema = new mongoose.Schema({
    text: { type: String, required: true },
    image: { type: String },
    hashtags: [{ type: String }],
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    viewCount: { type: Number, default: 0 },
    comments: [commentSchema],
}, { timestamps: true });

module.exports = mongoose.model('Discussion', discussionSchema);
