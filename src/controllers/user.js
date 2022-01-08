import { validationResult } from 'express-validator';
import { User } from '../models/user';

export const createUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  try {
    const user = new User(req.body);
    const userResponse = await user.save();
    return res.json(userResponse);
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      err: 'not able to save user in db',
    });
  }
};

export const getUserByPublicAddress = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }
  const { publicAddress } = req.query;
  try {
    const user = await User.findOne({ publicAddress });
    if (!user) {
      return res.status(403).json({
        error: `user doesn't exist`,
      });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    return res.status(400).json({
      error: `user doesn't exist`,
    });
  }
};

export const getAllUsers = async (_, res) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (error) {
    res.status(400).json('not able to get users');
    console.error(error, 'error finding student');
  }
};

// export const deleteUserByAddress = async (req, res) => {
//   try {
//     const { publicAddress } = req.body;
//     await User.deleteOne({ publicAddress });
//     return res.json('deleted successfully');
//   } catch (error) {
//     return console.log('Unable to delete');
//   }
// };

export const getCurrentUser = async (req, res) => {
  // AccessToken payload is in req.user.payload, especially its `id` field
  // UserId is the param in /users/:userId
  // We only allow user accessing herself, i.e. require payload.id==userId
  if (req.user.payload.id !== req.params.userId) {
    return res.status(401).send({ error: 'You can can only access yourself' });
  }

  try {
    const user = await User.findById(req.params.userId);
    return res.json(user);
  } catch (error) {
    res.status(400).json('not able to get user');
    console.error(error, 'error finding student');
  }
};

export const updateCurrentUser = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(422).json({
      error: errors.array()[0].msg,
    });
  }

  // Only allow to fetch current user
  if (req.user.payload.id !== req.params.userId) {
    return res.status(401).send({ error: 'You can can only access yourself' });
  }
  try {
    const user = await User.findById(req.params.userId);
    Object.assign(user, req.body);
    const updatedUser = await user.save();
    return res.json(updatedUser);
  } catch (error) {
    console.log(error);
    return res.status(401).send({
      error: `User with publicAddress ${req.params.userId} is not found in database`,
    });
  }
};
