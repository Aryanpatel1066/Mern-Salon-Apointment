const { Queue } = require("bullmq");
const connection = require("../config/redis");
//create a queue 
const emailQueue = new Queue("emailQueue", {
  connection,
});

module.exports = emailQueue;