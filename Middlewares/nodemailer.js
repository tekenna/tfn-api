const dotenv = require("dotenv");
const { createTransport } = require("nodemailer");
const {
  welcome_snippet,
  admin_welcome_snippet,
} = require("../Utils/mailConstants");

dotenv.config();

const mail_transport = createTransport({
  host: "smtp-relay.brevo.com",
  port: 2525,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "exquisitesoundpro@gmail.com", // generated ethereal user
    pass: process.env.BREVO_SMTP, // generated ethereal password
  },
});
const mailer = {
  sendmail: (email, token, info, isAdmin) => {
    const mail_options = {
      from: '"Clinton From Exquisite Sound Pro" info@exquisitesoundpro.com', // sender address
      to: email, // list of receivers
      subject: "Welcome to exquisite soundpro ✔", // Subject line
      text: `Welcome ${info.first_name}, Glad to have you on board, click the like to register.`,
      html: isAdmin
        ? admin_welcome_snippet(info, email, token)
        : welcome_snippet(info, email, token),
    };
    mail_transport.sendMail(mail_options, (error, info) => {
      if (error) {
        console.log(error);
        return {
          message: "failed",
          data: error,
        };
      } else {
        return {
          message: "success",
          data: info,
        };
      }
    });
  },
};

module.exports = mailer;
