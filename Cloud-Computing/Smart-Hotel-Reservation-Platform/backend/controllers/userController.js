const db = require("../database/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// REGISTER USER

exports.registerUser = (req, res) => {

    const {
        name,
        email,
        password,
        role
    } = req.body;


    bcrypt.hash(password, 10, (err, hashedPassword) => {

        if (err) {
            return res.status(500).json(err);
        }


        const sql =
            "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)";


        db.query(
            sql,
            [
                name,
                email,
                hashedPassword,
                role
            ],
            (err, result) => {

                if (err) {
                    return res.status(500).json(err);
                }


                res.json({
                    message: "User registered successfully",
                    user_id: result.insertId
                });

            }
        );

    });

};



// LOGIN USER

exports.loginUser = (req, res) => {

    const {
        email,
        password
    } = req.body;


    const sql =
        "SELECT * FROM users WHERE email=?";


    db.query(
        sql,
        [email],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }


            if (result.length === 0) {

                return res.status(404).json({
                    message: "User not found"
                });

            }


            const user = result[0];


            bcrypt.compare(
                password,
                user.password,
                (err, isMatch) => {

                    if (err) {
                        return res.status(500).json(err);
                    }


                    if (!isMatch) {

                        return res.status(401).json({
                            message: "Invalid password"
                        });

                    }


                    const token = jwt.sign(
                        {
                            id: user.id,
                            role: user.role
                        },
                        process.env.JWT_SECRET,
                        {
                            expiresIn: "1h"
                        }
                    );


                    res.json({

                        message: "Login successful",
                        token: token

                    });

                }
            );


        }
    );

};



// GET ALL USERS

exports.getUsers = (req, res) => {

    const sql =
        "SELECT id,name,email,role FROM users";


    db.query(
        sql,
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }


            res.json(result);

        }
    );

};



// UPDATE USER

exports.updateUser = (req, res) => {

    const {
        name,
        role
    } = req.body;


    const sql =
        "UPDATE users SET name=?, role=? WHERE id=?";


    db.query(
        sql,
        [
            name,
            role,
            req.params.id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }


            res.json({

                message: "User updated successfully"

            });

        }
    );

};



// DELETE USER

exports.deleteUser = (req, res) => {

    const sql =
        "DELETE FROM users WHERE id=?";


    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }


            res.json({

                message: "User deleted successfully"

            });

        }
    );

};