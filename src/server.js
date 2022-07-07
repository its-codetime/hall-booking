import express from "express";
import volleyball from "volleyball";
import api from "./api/api.js";
import { NotFoundHandler, ErrorHandler } from "./errorHandlers.js";

const app = express();

// http request response logger
app.use(volleyball);

// body parser
app.use(express.json());

// root
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to the hall booking server📚📂📝✅",
  });
});

// add api route
app.use("/api", api);

// error handlers
app.use(NotFoundHandler);
app.use(ErrorHandler);

export default app;
