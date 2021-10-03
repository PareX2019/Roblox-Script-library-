const nm = require('nodemailer');
module.exports = async({to, subject, html}) => {
  const transp = nm.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    auth: {
      user: process.env.EMAIL_ADDRESS,
      pass: process.env.EMAIL_PASSWORD
    }
  })
  await transp.sendMail({from: `"${process.env.EMAIL_NAME}" <${process.env.EMAIL_ADDRESS}>`, to, subject, html });
}