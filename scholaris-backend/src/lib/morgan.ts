import morgan from "morgan";
import logger from "./winston.js";

const morganMiddleware = morgan("combined", {
  stream: {
    write: (msg) => {
      logger.http(msg.trim());
    },
  },
});

export default morganMiddleware;
