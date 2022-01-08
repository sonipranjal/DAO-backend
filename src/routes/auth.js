import express from 'express';
const router = express.Router();

import { check } from 'express-validator';

import { authorizeUser } from '../controllers/auth';

router.post(
  '/',
  check('publicAddress', 'public address is required').isEthereumAddress(),
  authorizeUser
);

export default router;
