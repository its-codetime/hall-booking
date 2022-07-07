export const NotFoundHandler = (req, res, next) => {
  const error = new Error("route not found");
  res.status(404); // set status to 404
  next(error); // pass error to next error handler
};

export const ErrorHandler = (error, req, res, next) => {
  // set status code to 500 if its 200 or if its not set
  if (res.statusCode === 200 || !res.statusCode) res.status(500);
  res.json({ message: error.message });
};
