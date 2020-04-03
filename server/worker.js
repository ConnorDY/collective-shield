const mongoose = require('mongoose');
const dbConfig = require('./config.js');
const courseSchema = require('./schemas/course');
const parser = require('cron-parser');
const moment = require('moment');
const Config = require('../src/config');
const fetch = require('node-fetch');

mongoose.connect(
  dbConfig.mongoUri,
  { useNewUrlParser: true, useUnifiedTopology: true },
  (err) => {
    if (err) {
      console.error(err.message);
      console.error(err);
    }
  }
);

const promises = [];

const dates = [moment().startOf('day'), moment().add(1, 'days').endOf('day')];
courseSchema.Course.find({}).exec((err, results) => {
  if (err) {
    console.error(err);
  }
  const events = [];
  results.forEach((r) => {
    r.events.forEach((e) => {
      if (moment(e.start).isBetween(dates[0], dates[1])) {
        const event = Object.assign({}, e.toObject());
        event.course = Object.assign({}, r.toObject());
        delete event.course.events;
        events.push(event);
      }
    });
  });

  Promise.all(promises).then(() => process.exit(0));
});
