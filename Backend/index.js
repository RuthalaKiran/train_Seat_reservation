const express = require("express");
// const bodyparser = require("body-parser");
const cors = require("cors");
const app = express();
app.use(express.json());
// app.use(bodyparser.json());
app.use(cors());

let seats = Array(80).fill(null); // Null indicates available seat

// Function to book seats
function bookSeats(requestedSeats) {
  let seatNumbers = [];
  let seatsLeft = requestedSeats;

  // Try to book full rows first
  for (let i = 0; i < 12 && seatsLeft > 0; i++) {
    let rowStart = i * 7;
    let rowEnd = i === 11 ? 80 : rowStart + 7; // handling last row with 3 seats
    let availableSeatsInRow = seats
      .slice(rowStart, rowEnd)
      .filter((s) => s === null).length;

    if (availableSeatsInRow >= seatsLeft) {
      // Book seats in this row
      for (let j = rowStart; j < rowEnd && seatsLeft > 0; j++) {
        if (seats[j] === null) {
          seats[j] = "Booked";
          seatNumbers.push(j + 1);
          seatsLeft--;
        }
      }
    }
  }

  // If seats are not booked fully in rows, assign nearby seats
  if (seatsLeft > 0) {
    for (let i = 0; i < 80 && seatsLeft > 0; i++) {
      if (seats[i] === null) {
        seats[i] = "Booked";
        seatNumbers.push(i + 1);
        seatsLeft--;
      }
    }
  }
  return seatNumbers;
}

// Endpoint to reserve seats
app.post("/reserve", (req, res) => {
  const { seatsRequested } = req.body;
  if (seatsRequested < 1 || seatsRequested > 7) {
    return res.json({ error: "You can book 1 to 7 seats only." });
  }

  const availableSeats = seats.filter((s) => s === null).length;
  if (seatsRequested > availableSeats) {
    return res.json({ error: "Not enough seats available." });
  }

  const bookedSeats = bookSeats(seatsRequested);
  res.json({bookedSeats, seats });
});

app.get("/seatsremaining", (req, res) => {
  const availableSeats = seats.filter((s) => s === null).length;
  res.json({ availableSeats });
});

app.listen(3000, () => console.log("Server is running on port 3000"));
