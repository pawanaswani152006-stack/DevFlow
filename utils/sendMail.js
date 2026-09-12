const dns=require("dns");
dns.setDefaultResultOrder("ipv4first");
const nodemailer=require("nodemailer");

const transporter=nodemailer.createTransport({
    host:"smtp.gmail.com",
    port:465,
    secure:true,
    family:4,
    auth:{
        user:process.env.EMAIL_USER,
        pass:process.env.EMAIL_PASS
    }
});

async function sendVarificationEmail(email,verificationLink){
    const response=await fetch("https://api.resend.com/emails",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            from:"DevFlow <onboarding@resend.dev>",
            to:email,
            subject:"Verify your DevFlow account",
            html:
                `<h1>Welcome to DevFlow</h1>
                <p>Click the link below to verify your account.</p>
                <a href="${verificationLink}">Verify Email</a>`
        })
    })
    if(!response.ok){
        const error=await response.text();
        throw new Error(`Resend error:${error}`);
    }
    // await transporter.sendMail({
    //     from:process.env.EMAIL_USER,
    //     to:email,
    //     subject:"Verify your DevFlow account",
    //     html:
    //         `<h1>Welcome to DevFlow</h1>
    //         <p>Click the link below to verify your account.</p>
    //         <a href="${verificationLink}">Verify Email</a>`
    // });
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