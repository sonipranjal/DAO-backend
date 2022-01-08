import { Router } from 'express';
import jwt from 'express-jwt';
import { check } from 'express-validator';
import dotenv from 'dotenv';

const router = Router();
dotenv.config();
import {
  createUser,
  getAllUsers,
  getCurrentUser,
  getUserByPublicAddress,
  updateCurrentUser,
} from '../controllers/user';

const config = {
  algorithms: ['HS256'],
  secret: process.env.JWT_SECRET,
};

router.post(
  '/',
  check('publicAddress', 'public address is required').isEthereumAddress(),
  createUser
);
router.get('/', getUserByPublicAddress);

router.get('/all', jwt(config), getAllUsers);

/** GET /api/users/:userId */
/** Authenticated route */
router.get('/:userId', jwt(config), getCurrentUser);

router.put('/:userId', jwt(config), updateCurrentUser);

// router.delete('/', deleteUserByAddress);

export default router;
