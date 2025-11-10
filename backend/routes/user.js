const express = require("express");
const router = express.Router();
const zod = require("zod");
const { db } = require("../db");
const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config");
const { authMiddleware } = require("../authMiddleware");
const { OAuth2Client } = require('google-auth-library');
const bcrypt = require('bcrypt');
const multer = require("multer");

const signUpBody = zod.object({
  username: zod.string().email().refine(
    (email) => {
      const validDomainPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
      const commonEmailProviders = /@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/i;
      const disposableEmailPattern = /@(tempmail\.com|throwawaymail\.com|temp-mail\.org)$/i;
      
      return validDomainPattern.test(email) && 
             (commonEmailProviders.test(email) || !disposableEmailPattern.test(email));
    },
    { message: "Please provide a valid email address from a recognized email provider" }
  ),
  firstName: zod.string(),
  lastName: zod.string(),
  password: zod.string()
});

const upload = multer({
  limits: {fileSize: 5 * 1024 * 1024 },
  fileFilter (req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png|pdf)$/)) {
      return cb(new Error('only image and PDFs allowed'));
    }
    cb(null, true);
  },
});

const googleClient = new OAuth2Client();

router.post("/google", async (req, res) => {
  try {
    if (!process.env.GOOGLE_CLIENT_ID) {
      throw new Error('Google Client ID not configured');
    }

    const { credential } = req.body;
    if (!credential) {
      return res.status(400).json({
        message: "No credential provided"
      });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    }).catch(error => {
      console.error('Error verifying Google token:', error);
      throw new Error('Invalid Google token');
    });

    const payload = ticket.getPayload();
    if (!payload) {
      return res.status(400).json({
        message: "Invalid Google ID token"
      });
    }

    const { email, name, given_name, family_name } = payload;

    let user = await db.users.findOne({ username: email });

    if (!user) {
      user = await db.users.create({
        username: email,
        first_name: given_name || name.split(' ')[0],
        last_name: family_name || name.split(' ')[1] || '',
        password: await bcrypt.hash(Math.random().toString(36).slice(-8), 10),
      });

      await db.accounts.create({ user_id: user.id });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.username, name: user.first_name + ' ' + user.last_name },
      JWT_SECRET,
      { expiresIn: '7d'}
    );

    res.status(200).json({ token, message: 'Authentication successful' });
  } catch (error) {
    console.error('Error in Google authentication:', error);
    res.status(500).json({
      message: "Error processing Google authentication",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.post('/upload', upload.single('file'), (req, res) => {
  if(!req.file) {
    return res.status(400).json({ message: 'Invalid file type or size.' });
  }

  res.status(200).json({ message: 'File uploaded successfully', file: req.file });
});

router.post("/signup", async (req, res) => {
  const result = signUpBody.safeParse(req.body)
  if (!result.success) {
    return res.status(400).json({
      message: "Invalid input format",
      errors: result.error.errors
    })
  }

  const existingUser = await db.users.findOne({
    username: req.body.username
  })

  if (existingUser) {
    return res.status(409).json({
      message: "Email already taken"
    })
  }

  try {
    const user = await db.users.create({
      username: req.body.username,
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      password: await bcrypt.hash(req.body.password, 10)
    })

    const userId = user.id;

    await db.accounts.create({
      user_id: userId,
    })

    const token = jwt.sign({
      userId
    }, JWT_SECRET,
      { expiresIn: '12h' }
    );

    res.status(201).json({
      message: "User created successfully!",
      token: token
    })
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      message: "Error creating user",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

const signinBody = zod.object({
  username: zod.string().email().refine(
    (email) => {
      const validDomainPattern = /^[^@]+@[^@]+\.[a-zA-Z]{2,}$/;
      const commonEmailProviders = /@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com)$/i;
      const disposableEmailPattern = /@(tempmail\.com|throwawaymail\.com|temp-mail\.org)$/i;
      
      return validDomainPattern.test(email) && 
             (commonEmailProviders.test(email) || !disposableEmailPattern.test(email));
    },
    { message: "Please provide a valid email address from a recognized email provider" }
  ),
  password: zod.string()
})

router.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body)

  if (!success) {
    return res.status(400).json({
      message: "Email already taken/Incorrect inputs.",
    })
  }

  const user = await db.users.findOne({
    username: req.body.username
  });

  if (!user) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const isPasswordValid = await bcrypt.compare(req.body.password, user.password);

  if (!isPasswordValid) {
    return res.status(401).json({
      message: "Invalid credentials"
    });
  }

  const token = jwt.sign({
    userId: user.id
  }, JWT_SECRET);

  res.json({
    token: token
  });
})

const updateBody = zod.object({
  password: zod.string().optional(),
  firstName: zod.string().optional(),
  lastName: zod.string().optional(),
});

router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await db.users.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.json({
      user: {
        firstName: user.first_name,
        lastName: user.last_name,
        username: user.username
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user information",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

router.put("/", authMiddleware, async (req, res) => {
  try {
    const { success, data, error } = updateBody.safeParse(req.body);
    if (!success) {
      return res.status(400).json({
        message: "Invalid input data",
        errors: error.errors
      });
    }

    const user = await db.users.findById(req.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const updateData = {};
    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    if (data.firstName) {
      updateData.first_name = data.firstName;
    }
    if (data.lastName) {
      updateData.last_name = data.lastName;
    }

    const updatedUser = await db.users.findByIdAndUpdate(req.userId, updateData);

    res.json({
      message: "Profile updated successfully",
      user: {
        firstName: updatedUser.first_name,
        lastName: updatedUser.last_name,
        username: updatedUser.username
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating profile",
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

module.exports = router;