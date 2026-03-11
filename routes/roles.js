var express = require('express');
var router = express.Router();
let roleModel = require('../schemas/role');
let userModel = require('../schemas/user');

// GET all roles
router.get('/', async function (req, res, next) {
    try {
        let roles = await roleModel.find({ isDeleted: false });
        res.send(roles);
    } catch (error) {
        res.status(500).send(error);
    }
});

// GET role by ID
router.get('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
        if (!result || result.isDeleted) {
            res.status(404).send({ message: "Role NOT FOUND" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(404).send({ message: "Role NOT FOUND" });
    }
});

// 4) GET all users by role id
router.get('/:id/users', async function (req, res, next) {
    try {
        let roleId = req.params.id;
        let role = await roleModel.findById(roleId);
        if (!role || role.isDeleted) {
            return res.status(404).send({ message: "Role NOT FOUND" });
        }
        let users = await userModel.find({ role: roleId, isDeleted: false });
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
});

// CREATE a role
router.post('/', async function (req, res, next) {
    try {
        let newRole = new roleModel({
            name: req.body.name,
            description: req.body.description
        });
        await newRole.save();
        res.send(newRole);
    } catch (error) {
        res.status(400).send(error);
    }
});

// UPDATE a role
router.put('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findByIdAndUpdate(
            id,
            req.body,
            { new: true }
        );
        if (!result || result.isDeleted) {
            res.status(404).send({ message: "Role NOT FOUND" });
        } else {
            res.send(result);
        }
    } catch (error) {
        res.status(400).send(error);
    }
});

// DELETE (soft delete) a role
router.delete('/:id', async function (req, res, next) {
    try {
        let id = req.params.id;
        let result = await roleModel.findById(id);
        if (!result || result.isDeleted) {
            res.status(404).send({ message: "Role NOT FOUND" });
        } else {
            result.isDeleted = true;
            await result.save();
            res.send(result);
        }
    } catch (error) {
        res.status(404).send({ message: "Role NOT FOUND" });
    }
});

module.exports = router;
