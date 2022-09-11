const nodemailer = require("nodemailer");
const { ApplicationError } = require("../utils/errors.util");

const transporter = nodemailer.createTransport({
    host: process.env.MAILHOG_CONTAINER_NAME,
    port: process.env.FORWARD_MAILHOG_PORT,
});

async function sendMail(subject, to, bodyHTML, bodyPlain) {
    const obj = await transporter.sendMail({
        from: "<noreply@startupinvestor.app>",
        to: to,
        subject: subject,
        text: bodyPlain,
        html: bodyHTML,
    });  
    if (!obj) {
        throw new ApplicationError("Error sending email", 500);
    }
}

module.exports = {
    sendMail,
};
