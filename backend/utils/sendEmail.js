const nodeMailer = require("nodemailer")

const sendEmail = async (options)=>{
    const tranceporter = nodeMailer.createTransport({
        host:"smpt.gmail.com",
        port:465,
        service:process.env.SMPT_SERVICE,
        auth:{
            user:process.env.SMPT_MAIL,
            pass:process.env.SMPT_PASSWORD,
        }
    });

    const mailOptions = {
        from:process.env.SMPT_MAIL,
        to:options.email,
        subject:options.subject,
        text:options.message
    }

    await tranceporter.sendMail(mailOptions)

}

module.exports = sendEmail;