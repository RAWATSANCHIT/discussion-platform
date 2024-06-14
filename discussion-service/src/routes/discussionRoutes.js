const express = require('express');
const router = express.Router();
const discussionController = require('../controllers/discussionController');
const { upload } = require('../middlewares/multer.js');
const authMiddleware = require('../middlewares/authMiddleware.js');


router.post('/', authMiddleware,upload.single('image'),discussionController.createDiscussion);
router.get('/', authMiddleware,discussionController.getDiscussions);
router.get('/:id',authMiddleware, discussionController.getDiscussionById);
router.put('/:id',authMiddleware, upload.single('image'),discussionController.updateDiscussion);
router.delete('/:id',authMiddleware, discussionController.deleteDiscussion);
router.get('/tags/:tag',authMiddleware, discussionController.getDiscussionsByTag);
router.get('/search/:text',authMiddleware, discussionController.searchDiscussions);

// routes for comments

router.post('/:discussionId/comments',authMiddleware, discussionController.addComment);
router.post('/:discussionId/like',authMiddleware, discussionController.likeDiscussion);
router.post('/:discussionId/view',authMiddleware, discussionController.incrementViewCount);
router.post('/:discussionId/comments/:commentId/like',authMiddleware, discussionController.likeComment);
router.post('/:discussionId/comments/:commentId/replies',authMiddleware, discussionController.replyToComment);
router.delete('/:discussionId/comments/:commentId',authMiddleware, discussionController.deleteComment);
router.put('/:discussionId/comments/:commentId',authMiddleware, discussionController.updateComment);

module.exports = router;
