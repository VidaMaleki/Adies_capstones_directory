import nodemailer from "nodemailer";
// npm i nodemailer handlebars  
import * as handlebars from "handlebars";
// npm i --include=dev @types/nodemailer


export default async function sendMail(
    to: string,
    name: string,
    image: string,
    url: string,
    subject: string,
    template: string,
    message: string,
    feedbackEmail: string,
){
    const {MAILING_EMAIL, MAILING_PASSWORD, SMTP_EMAIL, SMTP_HOST, SMTP_PASSWORD, SMTP_PORT} = process.env;

    let transporter = await nodemailer.createTransport({
        service: "gmail",
        auth:{
            user: MAILING_EMAIL,
            pass: MAILING_PASSWORD
        }

        // port: Number(SMTP_PORT),
        // host:SMTP_HOST,
        // auth: {
        //     user: SMTP_EMAIL,
        //     pass:SMTP_PASSWORD
        // }
    });
    // ---- html replacement
    const data = handlebars.compile(template);
    const replacements = {
        fullName: name,
        email_link : url,
        image: image,
        message: message,
        feedbackEmail: feedbackEmail,
    };
    const html = data(replacements);
    // -------verify connection config
    await new Promise((resolve, reject) => {
        transporter.verify((error, success)=>{
            if(error){
                console.log(error);
                reject(error)
            } else{
                console.log("server is listening ")
                resolve(success)
            }
        });
    });
    //--------send email
    const options = {
        from: MAILING_EMAIL, 
        to,
        subject,
        html
    };
    await new Promise((resolve, reject) =>{
        transporter.sendMail(options,  (err, info) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log(info);
                resolve(info);
            }
        });
    });
}