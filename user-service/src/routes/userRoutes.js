const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/signup', userController.signup);
router.post('/login', userController.login);
router.get('/', authMiddleware, userController.getUsers);
router.get('/:id', authMiddleware, userController.getUserById);
router.put('/:id', authMiddleware, userController.updateUser);
router.delete('/:id', authMiddleware, userController.deleteUser);
router.get('/search/:name', authMiddleware, userController.searchUser);
router.post('/follow/:id', authMiddleware, userController.followUser);
router.post('/unfollow/:id', authMiddleware, userController.unfollowUser);

module.exports = router;
