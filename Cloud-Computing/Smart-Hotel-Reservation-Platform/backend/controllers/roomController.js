const db = require("../database/db");

// CREATE ROOM
exports.createRoom = (req, res) => {

    const {
        room_number,
        room_type,
        price,
        status
    } = req.body;

    const sql =
        "INSERT INTO rooms(room_number,room_type,price,status) VALUES(?,?,?,?)";

    db.query(
        sql,
        [
            room_number,
            room_type,
            price,
            status
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Room created successfully",
                room_id: result.insertId
            });

        }
    );
};


// GET ALL ROOMS
exports.getRooms = (req, res) => {

    const sql = "SELECT * FROM rooms";

    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });
};


// GET SINGLE ROOM
exports.getRoomById = (req, res) => {

    const sql =
        "SELECT * FROM rooms WHERE id=?";

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }

            res.json(result[0]);

        }
    );
};


// UPDATE ROOM
exports.updateRoom = (req, res) => {

    const {
        room_type,
        price,
        status
    } = req.body;

    const sql =
        "UPDATE rooms SET room_type=?, price=?, status=? WHERE id=?";

    db.query(
        sql,
        [
            room_type,
            price,
            status,
            req.params.id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Room updated successfully"
            });

        }
    );
};


// DELETE ROOM
exports.deleteRoom = (req, res) => {

    const sql =
        "DELETE FROM rooms WHERE id=?";

    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }

            res.json({
                message: "Room deleted successfully"
            });

        }
    );
};