const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

async function sendVarificationEmail(email,verificationLink){
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Verify your DevFlow account",
        html:
            `<h1>Welcome to DevFlow</h1>
            <p>Click the link below to verify your account.</p>
            <a href="${verificationLink}">Verify Email</a>`
    });
}

async function sendPassResetEmail(email,verificationLink){
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:"Verify your DevFlow account",
        html:
            `<h1>Welcome to DevFlow</h1>
            <p>Click the link below to verify your account.</p>
            <p>This is for your password reset process and don't click if it is not authorized by you.</p>
            <a href="${verificationLink}">Verify Email</a>`
    });
}

module.exports={sendVarificationEmail,sendPassResetEmail};