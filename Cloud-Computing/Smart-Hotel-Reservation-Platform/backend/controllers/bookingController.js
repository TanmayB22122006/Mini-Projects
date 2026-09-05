const db = require("../database/db");

// CREATE BOOKING
exports.createBooking = (req, res) => {

    const {
        guest_name,
        email,
        room_id,
        check_in,
        check_out
    } = req.body;


    // CHECK DATE
    if (check_in >= check_out) {
        return res.status(400).json({
            message: "Check-out date must be after check-in date"
        });
    }


    // CHECK ROOM
    const roomSql =
        "SELECT * FROM rooms WHERE id=?";

    db.query(
        roomSql,
        [room_id],
        (err, rooms) => {

            if (err) {
                return res.status(500).json(err);
            }


            if (rooms.length === 0) {
                return res.status(404).json({
                    message: "Room not found"
                });
            }


            const room = rooms[0];


            // CHECK ROOM AVAILABILITY
            if (room.status !== "Available") {
                return res.status(400).json({
                    message: "Room is not available"
                });
            }


            // CREATE BOOKING
            const bookingSql =
                "INSERT INTO bookings(guest_name,email,room_id,check_in,check_out,status) VALUES(?,?,?,?,?,?)";


            db.query(
                bookingSql,
                [
                    guest_name,
                    email,
                    room_id,
                    check_in,
                    check_out,
                    "Confirmed"
                ],
                (err, result) => {

                    if (err) {
                        return res.status(500).json(err);
                    }


                    // UPDATE ROOM STATUS
                    const updateRoomSql =
                        "UPDATE rooms SET status='Booked' WHERE id=?";


                    db.query(
                        updateRoomSql,
                        [room_id],
                        (err) => {

                            if (err) {
                                return res.status(500).json(err);
                            }


                            res.json({
                                message: "Booking created successfully",
                                booking_id: result.insertId
                            });

                        }
                    );

                }
            );

        }
    );
};


// GET ALL BOOKINGS
exports.getBookings = (req, res) => {

    const sql = `
        SELECT
            bookings.id,
            bookings.guest_name,
            bookings.email,
            bookings.room_id,
            rooms.room_number,
            rooms.room_type,
            rooms.price,
            bookings.check_in,
            bookings.check_out,
            bookings.status
        FROM bookings
        JOIN rooms ON bookings.room_id = rooms.id
    `;


    db.query(sql, (err, result) => {

        if (err) {
            return res.status(500).json(err);
        }

        res.json(result);

    });
};


// GET SINGLE BOOKING
exports.getBookingById = (req, res) => {

    const sql = `
        SELECT
            bookings.id,
            bookings.guest_name,
            bookings.email,
            bookings.room_id,
            rooms.room_number,
            rooms.room_type,
            rooms.price,
            bookings.check_in,
            bookings.check_out,
            bookings.status
        FROM bookings
        JOIN rooms ON bookings.room_id = rooms.id
        WHERE bookings.id=?
    `;


    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }


            if (result.length === 0) {
                return res.status(404).json({
                    message: "Booking not found"
                });
            }


            res.json(result[0]);

        }
    );
};


// UPDATE BOOKING STATUS
exports.updateBooking = (req, res) => {

    const { status } = req.body;


    const sql =
        "UPDATE bookings SET status=? WHERE id=?";


    db.query(
        sql,
        [
            status,
            req.params.id
        ],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }


            res.json({
                message: "Booking updated successfully"
            });

        }
    );
};


// DELETE BOOKING
exports.deleteBooking = (req, res) => {

    const sql =
        "DELETE FROM bookings WHERE id=?";


    db.query(
        sql,
        [req.params.id],
        (err, result) => {

            if (err) {
                return res.status(500).json(err);
            }


            res.json({
                message: "Booking deleted successfully"
            });

        }
    );
};  