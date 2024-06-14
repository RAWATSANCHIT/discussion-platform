const Discussion = require('../models/discussionModel');
const User = require('../models/userModel')

exports.createDiscussion = async (req, res) => {
    const { text, hashtags } = req.body;
    const image = req.file ? req.file.path : null;

    try {
        const newDiscussion = new Discussion({
            user: req.user.userId,
            text,
            image,
            hashtags: hashtags ? hashtags.split(',') : []
        });
        await newDiscussion.save();
        res.status(201).json(newDiscussion);
    } catch (error) {
        res.status(500).json({ message: 'Error creating discussion' });
    }
};

exports.getDiscussions = async (req, res) => {
    try {
        const discussions = await Discussion.find().populate('user').populate('comments.user').populate('comments.replies.user');
        res.status(200).json(discussions);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching discussions' });
    }
};

exports.getDiscussionById = async (req, res) => {
    try {
        const discussion = await Discussion.findById(req.params.id).populate('user').populate('comments.user').populate('comments.replies.user');
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }
        res.status(200).json(discussion);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching discussion' });
    }
};

exports.updateDiscussion = async (req, res) => {
    const { text, hashtags } = req.body;
    const image = req.file ? req.file.path : null;
    try {
        const discussion = await Discussion.findById(req.params.id);
        if (!discussion) {
            return res.status(404).json({ msg: 'Discussion not found' });
        }

        if (discussion.user.toString() !== req.user.userId) {
            return res.status(403).json({ msg: 'Not authorized to update this discussion' });
        }

        discussion.text = text || discussion.text;
        discussion.hashtags = hashtags ? hashtags.split(',') : discussion.hashtags;
        if (image) {
            discussion.image = image;
        }

        await discussion.save();
        res.json({ msg: 'Discussion updated successfully', discussion });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

exports.deleteDiscussion = async (req, res) => {
    try {
        const discussion = await Discussion.findByIdAndDelete(req.params.id);
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }
        res.status(200).json({ message: 'Discussion deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting discussion' });
    }
};

exports.getDiscussionsByTag = async (req, res) => {
    try {
        const discussions = await Discussion.find({ hashtags: req.params.tag }).populate('user').populate('comments.user').populate('comments.replies.user');
        res.status(200).json(discussions);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error fetching discussions by tag' });
    }
};

exports.searchDiscussions = async (req, res) => {
    try {
        console.log(req.params)
        console.log(req.query)
        const discussions = await Discussion.find({ text: new RegExp(req.params.text, 'i') }).populate('user').populate('comments.user').populate('comments.replies.user');
        res.status(200).json(discussions);
    } catch (error) {
        res.status(500).json({ message: 'Error searching discussions' });
    }
};

exports.addComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { discussionId } = req.params;

        if (!content) {
            return res.status(400).json({ message: 'Content is required for adding a comment' });
        }

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        const comment = {
            content: content,
            user: req.user.userId
        };

        discussion.comments.push(comment);
        await discussion.save();

        res.status(201).json(comment);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error adding comment' });
    }
};

exports.likeDiscussion = async (req, res) => {
    try {
        const userId = req.user.userId;
        const { discussionId } = req.params;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        if (!discussion.likes.includes(userId)) {
            discussion.likes.push(userId);
            await discussion.save();
        }

        res.status(200).json(discussion);
    } catch (error) {
        res.status(500).json({ message: 'Error liking discussion' });
    }
};

exports.incrementViewCount = async (req, res) => {
    try {
        const { discussionId } = req.params;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        discussion.viewCount += 1;
        await discussion.save();

        res.status(200).json(discussion);
    } catch (error) {
        res.status(500).json({ message: 'Error incrementing view count' });
    }
};

exports.likeComment = async (req, res) => {
    try {
        const { userId } = req.body;
        const { discussionId, commentId } = req.params;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        const comment = discussion.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        if (!comment.likes.includes(userId)) {
            comment.likes.push(userId);
            await discussion.save();
        }

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error liking comment' });
    }
};

exports.replyToComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { discussionId, commentId } = req.params;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        const comment = discussion.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        const reply = {
            content,
            user:req.user.userId
        };

        comment.replies.push(reply);
        await discussion.save();

        res.status(201).json(reply);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error replying to comment' });
    }
};

exports.deleteComment = async (req, res) => {
    try {
        const { discussionId, commentId } = req.params;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        const comment = discussion.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.deleteOne()
        await discussion.save();

        res.status(200).json({ message: 'Comment deleted' });
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Error deleting comment' });
    }
};

exports.updateComment = async (req, res) => {
    try {
        const { content } = req.body;
        const { discussionId, commentId } = req.params;

        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ message: 'Discussion not found' });
        }

        const comment = discussion.comments.id(commentId);
        if (!comment) {
            return res.status(404).json({ message: 'Comment not found' });
        }

        comment.content = content;
        await discussion.save();

        res.status(200).json(comment);
    } catch (error) {
        res.status(500).json({ message: 'Error updating comment' });
    }
};