const router = require('express').Router()
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../model/User')
const ApiError = require('../utils/ApiError.class')


// POST api/v1/auth/login
router.post('/login', async (req, res, next) => {
  const { email, password } = req.body;

  try {
    // find user
    const user = await User.findOne({ email }).exec();
    if (!user) throw new ApiError(401, 'User not found')

    // verify password
    const match = await bcrypt.compare(password, user.password)
    if (!match) throw new ApiError(401, 'Wrong credentials')

    // create JWTs
    const accessToken = jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '15s' })

    // adding refreshtoken to user
    user.refreshToken = refreshToken;
    await user.save()

    res.cookie('jwt', refreshToken, { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 })
    res.status(200).json({ username: user.username, email: user.email, isLoggedIn: true, accessToken })

  } catch (err) {
    next(err);
  }
});

// POST api/v1/auth/register
router.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    // check for duplicate users
    const existingUser = await User.findOne({ email }).exec();
    if (existingUser) throw new ApiError(409, 'User already exists')

    // encrypt the password
    const hashedPassword = await bcrypt.hash(password, 10)

    // create and save the user
    await User.create({
      username,
      email,
      password: hashedPassword
    })

    res.status(201).json({ message: "User created" })

  } catch (err) {
    next(err);
  }
});

// GET api/v1/auth/refresh
router.get('/refresh', async (req, res, next) => {
  try {
    const cookies = req.cookies
    if (!cookies?.jwt) throw new ApiError(401, 'Unauthorized access - cookie not found')

    // verify the token
    jwt.verify(cookies.jwt, process.env.REFRESH_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.sendStatus(403);
      }

      // find user
      const user = await User.findOne({ email: decoded.email }).exec();
      if (!user) throw new ApiError(403, 'Forbidden access - no user found with this email in token')

      // create new access token
      const accessToken = jwt.sign({ email: user.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' })

      res.status(200).json({ accessToken })
    })

  } catch (err) {
    next(err);
  }
});

// GET api/v1/auth/logout
router.post('/logout', async (req, res, next) => {
  try {
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);

    // find token in db
    const user = await User.findOne({ refreshToken: cookies.jwt }).exec();
    if (user) {
      user.refreshToken = ''
      await user.save()
    }

    res.clearCookie('jwt', { httpOnly: true, maxAge: 60 * 60 * 24 * 1000 })
    return res.sendStatus(204);

  } catch (err) {
    next(err);
  }
});

module.exports = router