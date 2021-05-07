import path from "path";
import express from "express";
import session from "express-session";
import longpoll from "express-longpoll";
import { out, colors, getRandomInt } from "./lib/utils.js";
import { type } from "os";
import { PRIORITY_LOW } from "constants";

const app = express();
const poll = longpoll(app);
const PORT = process.env.PORT || 3000;

process.argv.forEach((val, index) => {
  console.log(`${index}: ${val}`);
});

out.checkColors(); // Check if terminal supports colored output
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: "blue-squares",
    resave: false,
    cookie: {},
  })
);
// Endpoints below
app.post("/login", (req, res) => {
  out.debug("test");
  if (!req.session.name) {
    req.session.name = req.body.name;
    req.session.color = `hsl(${getRandomInt(0, 360)}, 90%, 40%)`; // `hsl(${getRandomInt(0, 100)}%,100%,50%)`;
  }
  res.sendStatus(200);
});

poll
  .create("/poll")
  .then(() => {
    console.log("Created new poll");
  })
  .catch((err) => {
    console.log(err);
  });

app.get("/chat", (req, res) => {
  if (!req.session.name) return res.redirect("/");
  setTimeout(() => {
    poll.publish("/poll", { type: "system", content: `User ${req.session.name} joined chat` });
  }, 200);
  out.printStatus(colors.blue, "CHAT", "INFO", `User ${req.session.name} joined chat`);
  res.sendFile(path.join(path.resolve(), "/public/chat.html"));
});

app.post("/message", (req, res) => {
  poll.publish("/poll", {
    type: "message",
    content: req.body.message,
    color: req.session.color,
    name: req.session.name,
  });
  res.end();
});

app.listen(PORT, () => {
  out.printStatus(colors.blue, "SERVER", "INFO", `Started listening on port ${PORT}`);
});
