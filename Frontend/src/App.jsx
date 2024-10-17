import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [seatCount, setSeatCount] = useState(1);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [seatMap, setSeatMap] = useState(Array(80).fill(null));
  const [avilableseats, setavailableseats] = useState(0);
  const [Err, seterror] = useState("");
  console.log("Err", Err);
  const bookSeats = async () => {
    if (seatCount < 1) {
      const errmsg = "mnimum number of seats required is 1";
      seterror(errmsg);
      setTimeout(() => {
        alert(errmsg);
      }, 0);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/reserve", {
        seatsRequested: seatCount,
      });
      console.log(response.data);
      if (response.data.error === "Not enough seats available.") {
        seterror(response.data.error);
        alert("Not enough seats available.");
        setBookedSeats([]);
      } else {
        setBookedSeats(response.data.bookedSeats);
        setSeatMap(response.data.seats);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const fetchavailableseats = async () => {
    try {
      const response = await axios.get("http://localhost:3000/seatsremaining");
      setavailableseats(response.data.availableSeats);
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchavailableseats();
  }, [bookSeats]);

  return (
    <>
      <div className="container">
        <h1>Train Seat Reservation</h1>
        <label>
          Number of Seats:
          <input
            type="number"
            value={seatCount}
            onChange={(e) => {
              setSeatCount(e.target.value);
              if (e.target.value > 7) {
                setTimeout(() => {
                  alert("you can only book up to 7 seats");
                }, 0);
              }
            }}
          />
        </label>
        <button onClick={bookSeats}>Book Seats</button>

        <div className="coach">
          {seatMap &&
            seatMap.map((seat, index) => (
              <div
                key={index}
                className={`seat ${index >= 77 ? "last-three-seats" : " "} ${
                  seat === "Booked" ? "booked" : "available"
                }`}
              >
                {index + 1}
              </div>
            ))}
        </div>

        <h2>Booked Seats: {bookedSeats.length>0 ? bookedSeats.join(", ") : "--"}</h2>
        <h2>Available Seats: {avilableseats}</h2>
      </div>
    </>
  );
}

export default App;
