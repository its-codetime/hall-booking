import express from "express";
import { nanoid } from "nanoid";
const router = express.Router();

let halls = [
  {
    id: 1,
    hallName: "hall1",
    noSeats: 30,
    pricePerHour: 1000,
    amenities: ["WiFi"],
    bookings: [
      {
        hallId: 2,
        customerName: "sachin",
        date: "12/01/22",
        startTime: 10,
        endTime: 13,
        noHours: 3,
      },
    ],
  },
  {
    id: 2,
    hallName: "hall2",
    noSeats: 60,
    pricePerHour: 3000,
    amenities: ["Digital Projector", "WiFi"],
    bookings: [],
  },
  {
    id: 3,
    hallName: "hall1",
    noSeats: 100,
    pricePerHour: 10000,
    amenities: ["AC", "Digital Projector", "WiFi"],
    bookings: [],
  },
];

router.get("/", (req, res) => {
  res.json({ message: "hall booking api route" });
});

router.post("/create", (req, res, next) => {
  // create hall
  // hallName, noSeats, pricePerHour, amenities
  const { hallName, noSeats, pricePerHour, amenities } = req.body;
  if (!hallName || !noSeats || !pricePerHour || !amenities) {
    res.status(400);
    next(new Error("hallName, noSeats, pricePerHour, amenities required"));
    return;
  }
  const id = nanoid();
  halls.push({ id, ...req.body, bookings: [] });
  res.json({ message: "new hall added" });
});

router.get("/halls", (req, res) => {
  // list all halls
  // # TODO add bookings data to halls
  res.json(halls);
});

router.get("/bookings", (req, res) => {
  // list bookings data
  const bookings = halls
    .filter((hall) => hall.bookings.length !== 0)
    .map((hall) => ({
      hallId: hall.id,
      hallName: hall.hallName,
      bookings: hall.bookings,
    }));
  res.json(bookings);
});

// book hall
// hallId, customerName, date, startTime, endTime
router.post("/bookHall", (req, res, next) => {
  // get hall id, customer name, date, startTime, endTime from body
  // get hall bookings
  // if bookings array empty, add booking
  // if bookings not empty, check each booking if it overlaps
  // if it doesn't overlap, add booking
  const { hallId, customerName, date, startTime, noHours } = req.body;
  const endTime = startTime + noHours;
  if (!hallId || !customerName || !date || !startTime || !noHours) {
    res.status(400);
    next(new Error("hallId, customerName, date, startTime, noHours required"));
    return;
  }
  if (startTime < 9 || startTime > 19) {
    res.status(400);
    next(new Error("booking start time should be between 9 and 19 hours"));
    return;
  }
  if (noHours > 3 || noHours < 1) {
    res.status(400);
    next(new Error("maximum number of hours is 3 and minimum is 1"));
    return;
  }
  const hallBookings = halls.find((hall) => hall.id === hallId).bookings;
  if (hallBookings.length !== 0) {
    for (const booking of hallBookings) {
      const bookingOverlap = checkIfBookingOverlaps(
        [date, startTime, endTime],
        [booking.date, booking.startTime, booking.endTime]
      );
      if (bookingOverlap) {
        next(new Error("booking time not available"));
        return;
      }
    }
  }
  // add to bookings
  const newBooking = {
    hallId,
    customerName,
    date,
    startTime,
    endTime,
    noHours,
  };
  hallBookings.push(newBooking);

  halls = halls.map((hall) => {
    if (hall.id === hallId) return { ...hall, bookings: hallBookings };
    return hall;
  });

  res.json(hallBookings);
});

function checkIfBookingOverlaps(time1, time2) {
  const [date1, startTime1, endTime1] = time1; // new booking time
  const [date2, startTime2, endTime2] = time2;
  if (date1 !== date2) return false;
  // conditions to check
  // startTime2 < startTime1 < endTime2;
  // startTime2 < endTime1 < endTime2;
  const isStartOverlapping = isTimeInBetween(startTime2, endTime2, startTime1);
  const isEndOverlapping = isTimeInBetween(startTime2, endTime2, endTime1);
  if (isStartOverlapping || isEndOverlapping) return false;
  return true;
}

function isTimeInBetween(start, end, time) {
  if (time > start && time < end) return true;
  return false;
}

export default router;
