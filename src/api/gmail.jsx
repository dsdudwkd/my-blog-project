

// const gmailConfig = {
//     gmailUser: process.env.REACT_APP_GMAIL_OAUTH_USER,
//     gmailClientId: process.env.REACT_APP_GMAIL_OAUTH_CLIENT_ID,
//     gmailClientSecret: process.env.REACT_APP_GAMIL_OAUTH_CLIENT_SECRET,
//     gmailRefreshToken: process.env.REACT_APP_GAMIL_OAUTH_REFRESH_TOKEN,
// }

// const nodemailer = require("nodemailer");

// export async function sendEmail(){
//     try {
//         // ... 회원가입 관련 로직들
//         const transporter = nodemailer.createTransport({
//           service: "gmail",
//           host: "smtp.gmail.com",
//           port: 587,
//           secure: true,
//           auth: {
//             type: "OAuth2",
//             user: gmailConfig.gmailUser,
//             clientId: gmailConfig.gmailClientId,
//             clientSecret: gmailConfig.gmailClientSecret,
//             refreshToken: gmailConfig.gmailRefreshToken,
//           },
//         });
    
//         const mailOptions = {
//           to: `${gmailConfig.user}`,
//           subject: "[Annalog] 회원가입 이메일 인증 메일입니다.",
//           html: `<h2>인증 메일입니다.</h2>`,
//         };
    
//         await transporter.sendMail(mailOptions);
//       } catch (error) {
//         console.error(error)
//       }
// }