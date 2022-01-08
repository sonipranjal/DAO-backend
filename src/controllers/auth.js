import { recoverPersonalSignature } from '@metamask/eth-sig-util';
import { bufferToHex } from 'ethereumjs-util';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const authorizeUser = async (req, res) => {
  const { signature, publicAddress } = req.body;

  if (!signature || !publicAddress) {
    return res
      .status(400)
      .send({ error: 'Request should have signature and publicAddress' });
  }

  try {
    const user = await User.findOne({ publicAddress });

    const msg = `I am signing my one-time nonce: ${user.nonce}`;

    // We now are in possession of msg, publicAddress and signature. We
    // will use a helper from eth-sig-util to extract the address from the signature
    const msgBufferHex = bufferToHex(Buffer.from(msg, 'utf8'));
    const address = recoverPersonalSignature({
      data: msgBufferHex,
      signature: signature,
    });

    // The signature verification is successful if the address found with
    // sigUtil.recoverPersonalSignature matches the initial publicAddress
    if (address.toLowerCase() !== publicAddress.toLowerCase()) {
      return res.status(401).send({
        error: 'Signature verification failed',
      });
    }

    user.nonce = Math.floor(Math.random() * 10000);
    await user.save();

    const accessToken = jwt.sign(
      {
        payload: {
          id: user._id,
          publicAddress,
        },
      },
      process.env.JWT_SECRET
    );

    res.json({ accessToken });
  } catch (err) {
    console.log(err);
    res.status(401).send({
      error: `User with publicAddress ${publicAddress} is not found in database`,
    });
  }
};
