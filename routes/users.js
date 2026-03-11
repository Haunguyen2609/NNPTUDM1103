var express = require('express');
var router = express.Router();
let userModel = require('../schemas/user');

// GET all users
router.get('/', async function (req, res, next) {
  try {
    let users = await userModel.find({ isDeleted: false }).populate('role');
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
});

// 2) POST /enable
router.post('/enable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userModel.findOne({ email: email, username: username, isDeleted: false });
    if (!user) {
      return res.status(404).send({ message: "User not found or information is incorrect" });
    }
    user.status = true;
    await user.save();
    res.send({ message: "User enabled", user });
  } catch (error) {
    res.status(500).send(error);
  }
});

// 3) POST /disable
router.post('/disable', async function (req, res, next) {
  try {
    let { email, username } = req.body;
    let user = await userModel.findOne({ email: email, username: username, isDeleted: false });
    if (!user) {
      return res.status(404).send({ message: "User not found or information is incorrect" });
    }
    user.status = false;
    await user.save();
    res.send({ message: "User disabled", user });
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET user by ID
router.get('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findById(id).populate('role');
    if (!result || result.isDeleted) {
      res.status(404).send({ message: "User NOT FOUND" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(404).send({ message: "User NOT FOUND" });
  }
});

// CREATE a user
router.post('/', async function (req, res, next) {
  try {
    let newUser = new userModel(req.body);
    await newUser.save();
    res.send(newUser);
  } catch (error) {
    res.status(400).send(error);
  }
});

// UPDATE a user
router.put('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    if (!result || result.isDeleted) {
      res.status(404).send({ message: "User NOT FOUND" });
    } else {
      res.send(result);
    }
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE (soft delete) a user
router.delete('/:id', async function (req, res, next) {
  try {
    let id = req.params.id;
    let result = await userModel.findById(id);
    if (!result || result.isDeleted) {
      res.status(404).send({ message: "User NOT FOUND" });
    } else {
      result.isDeleted = true;
      await result.save();
      res.send(result);
    }
  } catch (error) {
    res.status(404).send({ message: "User NOT FOUND" });
  }
});

module.exports = router;
