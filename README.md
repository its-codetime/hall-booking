# Hall Booking

## routes

- /api/create - POST
  - create new hall
  - hallName, noSeats, pricePerHour, amenities
- /api/halls - GET
  - list all halls
- /api/bookings - GET
  - list all bookings
- /api/bookHall - POST
  - book new hall
  - hallId, customerName, date(mm/dd/yy), startTime(9-19 hours), noHours(1-3)
