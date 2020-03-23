const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const dbConfig = require("./server/config.js");
const Maker = require("./server/schemas/maker");
const Request = require("./server/schemas/request");
const moment = require('moment');

const portNumber = process.env.PORT || 3050;
const app = express();

const server = require("http").Server(app);

mongoose.connect(dbConfig.mongoUri, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
  if (err) {
    console.error(err.message);
    console.error(err);
  }
  else {
    console.log("Connected to MongoDb");
  }
});

if (process.env.NODE_ENV === "development") {
  process.on("SIGTERM", () => process.kill(process.pid, "SIGINT"));
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "*");
    next();
  });
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'build')))

server.listen(portNumber, () => {
  console.log(`Express web server started: http://localhost:${portNumber}`);
});

app.get("/api/makers", (req, res) => {
  Maker.Maker
    .find({})
    .exec((err, results) => {
      if (err) {
        console.error(err)
      }
      return res.send(results)
    })
})

app.get("/api/makers/:id", (req, res) => {
  Maker.Maker
    .findById(req.params.id)
    .exec((err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.put("/api/makers/:id", (req, res) => {
  Maker.Maker
    .findOneAndUpdate({ _id: req.params.id }, req.body, (err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.get("/api/requests", (req, res) => {
  Request.Request
    .find({})
    .exec((err, results) => {
      if (err) {
        console.error(err)
      }
      return res.send(results)
    })
})

app.post("/api/requests", (req, res) => {
  Request.Request
    .create(req.body, (err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.get("api/requests/:id", (req, res) => {
  Request.Request
    .findById(req.params.id)
    .exec((err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

app.put("api/requests/:id", (req, res) => {
  Request.Request
    .findOneAndUpdate({ _id: req.params.id }, req.body, (err, result) => {
      if (err) {
        console.error(err)
      }
      return res.send(result)
    })
})

// app.get("/api/district", (req, res) => {
//   District
//     .findOne((err, results) => {
//       if (err) {
//         console.error(err);
//       }
//       // results.forEach((r) => {
//       //   console.log(parser.parseExpression(r.schedule).next().toString());
//       // });
//       return res.send(results);
//     });
// });

// app.get("/api/classroom/:id", (req, res) => {
//   EventStudent
//     .findOne({ meetingId: req.params.id })
//     .exec((err, result) => {
//       if (err) {
//         console.error(err);
//       }

//       return res.send(result);
//     });
// });

// app.get("/api/events", (req, res) => {
//   let date = moment();
//   if (req.query.date != null) {
//     date = moment(req.query.date);
//   }
//   Course
//     .find({})
//     .exec((err, results) => {
//       if (err) {
//         console.error(err);
//       }
//       const events = [];
//       results.forEach((r) => {
//         r.events.forEach((e) => {
//           if (moment(e.start).isSame(date, 'day')) {
//             const event = Object.assign({}, e.toObject());
//             event.course = Object.assign({}, r.toObject());
//             event.start = new Date(event.start);
//             event.end = new Date(event.end);
//             delete event.course.events;
//             events.push(event);
//           }
//         })
//       })

//       events.sort((a, b) => a.start - b.start)

//       return res.send(events);
//     });
// });

// app.get("/api/schedules/:id", (req, res) => {
//   scheduleSchema.Schedule
//     .findById(req.params.id)
//     .exec((err, result) => {
//       if (err) {
//         console.error(err);
//       }
//       return res.send(result);
//     });
// });

// app.post("/api/schedules", (req, res) => {
//   scheduleSchema.Schedule
//     .create(req.body, (err, result) => {
//       if (err) {
//         console.error(err);
//       }
//       return res.send(result);
//     });
// });


// app.put("/api/schedules/:id", (req, res) => {
//   scheduleSchema.Schedule
//     .findOneAndUpdate({ _id: req.params.id }, req.body, (err, result) => {
//       if (err) {
//         console.error(err);
//       }
//       console.log(result);
//       return res.send(result);
//     });
// });

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname + '/build/index.html'));
});