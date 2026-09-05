import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API = "http://localhost:5000/api";

function App() {
  const [rooms, setRooms] = useState([]);
  const [page, setPage] = useState("home");

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [user, setUser] = useState(null);

  const [selectedRoom, setSelectedRoom] = useState(null);

  const [booking, setBooking] = useState({
    guest_name: "",
    email: "",
    check_in: "",
    check_out: "",
  });

  const [bookings, setBookings] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    loadRooms();
  }, []);

  const loadRooms = () => {
    axios
      .get(`${API}/rooms`)
      .then((response) => {
        setRooms(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();

    axios
      .post(`${API}/users/register`, {
        ...registerData,
        role: "guest",
      })
      .then((response) => {
        alert(response.data.message);
        setRegisterData({
          name: "",
          email: "",
          password: "",
        });
        setPage("login");
      })
      .catch(() => {
        alert("Registration failed");
      });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post(`${API}/users/login`, loginData)
      .then((response) => {
        localStorage.setItem("token", response.data.token);

        axios.get(`${API}/users`).then((usersResponse) => {
          const loggedUser = usersResponse.data.find(
            (item) => item.email === loginData.email
          );

          if (loggedUser) {
            setUser(loggedUser);

            if (loggedUser.role === "admin") {
              setPage("admin");
            } else {
              setPage("home");
            }
          }
        });
      })
      .catch(() => {
        alert("Invalid email or password");
      });
  };

  const handleBooking = (room) => {
    if (!user) {
      alert("Please login first");
      setPage("login");
      return;
    }

    setSelectedRoom(room);

    setBooking({
      guest_name: user.name,
      email: user.email,
      check_in: "",
      check_out: "",
    });
  };

  const submitBooking = (e) => {
    e.preventDefault();

    axios
      .post(`${API}/bookings`, {
        ...booking,
        room_id: selectedRoom.id,
      })
      .then((response) => {
        alert(response.data.message);

        setSelectedRoom(null);
        loadRooms();
      })
      .catch(() => {
        alert("Booking failed");
      });
  };

  const loadAdminData = () => {
    axios.get(`${API}/bookings`).then((response) => {
      setBookings(response.data);
    });

    axios.get(`${API}/users`).then((response) => {
      setUsers(response.data);
    });
  };

  useEffect(() => {
    if (page === "admin") {
      loadAdminData();
    }
  }, [page]);

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setPage("home");
  };

  return (
    <div className="app">

      <nav className="navbar">
        <h2>Smart Hotel</h2>

        <div className="nav-links">
          <button onClick={() => setPage("home")}>Home</button>
          <button onClick={() => setPage("rooms")}>Rooms</button>

          {!user && (
            <>
              <button onClick={() => setPage("login")}>Login</button>
              <button onClick={() => setPage("register")}>Register</button>
            </>
          )}

          {user && (
            <>
              <span>Hi, {user.name}</span>

              {user.role === "admin" && (
                <button onClick={() => setPage("admin")}>
                  Admin
                </button>
              )}

              <button onClick={logout}>Logout</button>
            </>
          )}
        </div>
      </nav>

      {page === "home" && (
        <>
          <section className="hero-section">
            <div className="hero-content">
              <h1>Welcome to Smart Hotel</h1>

              <p>
                Book your comfortable stay with our simple and
                smart hotel reservation platform.
              </p>

              <button
                className="primary-button"
                onClick={() => setPage("rooms")}
              >
                Explore Rooms
              </button>
            </div>
          </section>

          <section className="about-section">
            <h2>About Smart Hotel</h2>

            <p>
              Smart Hotel is a cloud-based hotel reservation and
              guest service platform for simple room booking and
              hotel services.
            </p>
          </section>
        </>
      )}

      {page === "rooms" && (
        <section className="rooms-section">
          <h2>Available Rooms</h2>

          <div className="room-container">

            {rooms.map((room) => (
              <div className="room-card" key={room.id}>

                <h3>Room {room.room_number}</h3>

                <p>Type: {room.room_type}</p>

                <h4>₹{room.price} / night</h4>

                <p>Status: {room.status}</p>

                {room.status === "Available" ? (
                  <button onClick={() => handleBooking(room)}>
                    Book Now
                  </button>
                ) : (
                  <button disabled>
                    Not Available
                  </button>
                )}

              </div>
            ))}

          </div>
        </section>
      )}

      {page === "login" && (
        <section className="form-section">
          <h2>Login</h2>

          <form onSubmit={handleLogin}>

            <input
              type="email"
              placeholder="Email"
              value={loginData.email}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={loginData.password}
              onChange={(e) =>
                setLoginData({
                  ...loginData,
                  password: e.target.value,
                })
              }
              required
            />

            <button type="submit">
              Login
            </button>

          </form>
        </section>
      )}

      {page === "register" && (
        <section className="form-section">
          <h2>Create Account</h2>

          <form onSubmit={handleRegister}>

            <input
              type="text"
              placeholder="Name"
              value={registerData.name}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  name: e.target.value,
                })
              }
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={registerData.email}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  email: e.target.value,
                })
              }
              required
            />

            <input
              type="password"
              placeholder="Password"
              value={registerData.password}
              onChange={(e) =>
                setRegisterData({
                  ...registerData,
                  password: e.target.value,
                })
              }
              required
            />

            <button type="submit">
              Register
            </button>

          </form>
        </section>
      )}

      {selectedRoom && (
        <section className="form-section">

          <h2>Book Room {selectedRoom.room_number}</h2>

          <form onSubmit={submitBooking}>

            <input
              type="text"
              value={booking.guest_name}
              readOnly
            />

            <input
              type="email"
              value={booking.email}
              readOnly
            />

            <label>Check In</label>

            <input
              type="date"
              value={booking.check_in}
              onChange={(e) =>
                setBooking({
                  ...booking,
                  check_in: e.target.value,
                })
              }
              required
            />

            <label>Check Out</label>

            <input
              type="date"
              value={booking.check_out}
              onChange={(e) =>
                setBooking({
                  ...booking,
                  check_out: e.target.value,
                })
              }
              required
            />

            <button type="submit">
              Confirm Booking
            </button>

            <button
              type="button"
              onClick={() => setSelectedRoom(null)}
            >
              Cancel
            </button>

          </form>
        </section>
      )}

      {page === "admin" && user?.role === "admin" && (
        <section className="admin-section">

          <h1>Admin Dashboard</h1>

          <div className="admin-box">

            <h2>Rooms</h2>

            {rooms.map((room) => (
              <p key={room.id}>
                Room {room.room_number} - {room.room_type} -
                ₹{room.price} - {room.status}
              </p>
            ))}

          </div>

          <div className="admin-box">

            <h2>Bookings</h2>

            {bookings.length === 0 ? (
              <p>No bookings available.</p>
            ) : (
              bookings.map((booking) => (
                <p key={booking.id}>
                  {booking.guest_name} - Room {booking.room_id} -
                  {booking.status}
                </p>
              ))
            )}

          </div>

          <div className="admin-box">

            <h2>Users</h2>

            {users.map((item) => (
              <p key={item.id}>
                {item.name} - {item.email} - {item.role}
              </p>
            ))}

          </div>

        </section>
      )}

      <footer>
        <p>© 2026 Smart Hotel Reservation Platform</p>
      </footer>

    </div>
  );
}

export default App;