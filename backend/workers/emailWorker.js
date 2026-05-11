require("dotenv").config();
const { Worker } = require("bullmq");
const connection = require("../config/redis");
const { transporter } = require("../utils/sendEmail");
const worker = new Worker(
  "emailQueue",
  async (job) => {

    const { to, subject, text, html } = job.data;

    await transporter.sendMail({
      from: `"SalonBlis" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log("Email sent:", to);
  },
  {
    connection,
  }
);

worker.on("completed", (job) => {
  console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
  console.log(`Job ${job.id} failed`, err.message);
});