import winston from "winston";

var logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  levels: {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
  },
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      level: "info",
      dirname: "./src/logs",
      filename: "combine.log",
    }),
    new winston.transports.File({
      level: "error",
      dirname: "./src/logs",
      filename: "error.log",
    }),
    new winston.transports.File({
      level: "http",
      dirname: "./src/logs",
      filename: "http.log",
    }),
  ],
});

export default logger;
