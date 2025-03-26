// exports.passwordResetEmail = (url, duration) => {
//   return `
//   <!DOCTYPE html>
// <html lang="en">
//   <head>
//     <meta charset="UTF-8" />
//     <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//     <title>Password Reset</title>
//     <style>
//       body {
//         font-family: Arial, sans-serif;
//         background: linear-gradient(to bottom, #ffffff, #d3d3d3);
//         margin: 0;
//         padding: 0;
//         display: flex;
//         flex-direction: column;
//         align-items: center;
//         justify-content: center;
//         height: 100vh;
//       }
//       .email-container {
//         background-color: white;
//         padding: 30px;
//         border-radius: 8px;
//         box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
//         max-width: 450px;
//         width: 100%;
//         text-align: left;
//       }
//       .logo {
//         font-size: 22px;
//         font-weight: bold;
//         color: #333;
//         text-align: center;
//         margin-bottom: 10px;
//       }
//       h2 {
//         font-size: 18px;
//         font-weight: bold;
//         color: #000;
//       }
//       p {
//         font-size: 14px;
//         color: #555;
//         margin: 10px 0;
//       }
//       .btn-container {
//         text-align: left;
//       }
//       .btn {
//         display: inline-block;
//         padding: 10px 20px;
//         margin: 10px 0;
//         text-decoration: none;
//         background-color: #333;
//         color: white;
//         border-radius: 5px;
//         font-size: 14px;
//         font-weight: bold;
//         border: none;
//       }
//       .btn:hover {
//         background-color: #555;
//       }
//       .footer {
//         font-size: 12px;
//         color: #777;
//         margin-top: 15px;
//       }
//       .footer a {
//         color: #007bff;
//         text-decoration: none;
//         word-break: break-word;
//       }
//       .footer a:hover {
//         text-decoration: underline;
//       }
//       hr {
//         border: 0;
//         height: 1px;
//         background: #ccc;
//         margin: 5px 0;
//       }
//       .ff{
//         font-size: 8px; margin-top: 10px
//       }
//     </style>
//   </head>
//   <body>
//     <h5 class="logo">${process.env.APP_NAME}</h5>
//     <div class="email-container">
//       <h2>Hello!</h2>
//       <p>
//         You are receiving this email because we received a password reset
//         request for your account.
//       </p>
//       <br />
//       <div class="btn-container">
//         <center><a class="btn" href="${url}">Reset Password</a></center>
//         <br />
//       </div>
//       <p>This password reset link will expire in ${duration} minutes.</p>
//       <br />
//       <p>
//         If you did not request a password reset, no further action is required.
//       </p>
//       <br />
//       <br />
//       <p>Regards,<br /> ${process.env.APP_NAME}</p>
//       <br />
//       <hr />
//       <br />
//       <p class="footer">
//         If you're having trouble clicking the "Reset Password" button, copy and
//         paste the URL below into your web browser: <br />
//         <a href="${url}">${url}</a>
//       </p>
//     </div>
//      <footer class="ff">
//       © ${new Date().getFullYear()} ${process.env.APP_NAME} All rights reserved.
//     </footer>
//       </body>
// </html>
//   `
// };

exports.passwordResetEmail = (url, duration) => {
  return `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Password Reset</title>
  </head>
  <body style="margin: 0; padding: 0; background-color: #f2f2f2;">
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
      <tr>
        <td align="center" style="padding: 40px 0;">
          <!-- Outer container -->
          <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 480px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <!-- Header -->
            <tr>
              <td align="center" style="padding: 20px; font-family: Arial, sans-serif; font-size: 22px; font-weight: bold; color: #333333;">
              ${process.env.APP_NAME}
              </td>
            </tr>
            <!-- Content -->
            <tr>
              <td style="padding: 0 30px 20px 30px; font-family: Arial, sans-serif; font-size: 14px; color: #555555;">
                <p style="margin: 0 0 15px 0;"><strong>Hello!</strong></p>
                <p style="margin: 0 0 15px 0;">You are receiving this email because we received a password reset request for your account.</p>

                <!-- Button -->
                <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 20px 0;">
                  <tr>
                    <td align="center">
                      <a href="${url}" target="_blank" style="background-color: #333333; color: #ffffff; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-size: 14px; font-weight: bold; display: inline-block;">
                        Reset Password
                      </a>
                    </td>
                  </tr>
                </table>

                <p style="margin: 0 0 15px 0;">This password reset link will expire in ${duration}  minutes.</p>
                <p style="margin: 0 0 15px 0;">If you did not request a password reset, no further action is required.</p>

                <p style="margin: 20px 0 0 0;">Regards,<br />${
                  process.env.APP_NAME
                }</p>

                <hr style="margin: 30px 0; border: none; border-top: 1px solid #cccccc;" />

                <!-- Fallback link -->
                <p style="font-size: 12px; color: #777777; margin: 0 0 5px 0;">
                  If you're having trouble clicking the "Reset Password" button, copy and paste the URL below into your web browser:
                </p>
                <a href="${url}" target="_blank" style="font-size: 12px; color: #007bff; word-break: break-word;">${url}</a>

                <!-- Footer -->
                <p style="font-size: 10px; color: #aaaaaa; text-align: center; margin-top: 30px;">© ${new Date().getFullYear()} ${
    process.env.APP_NAME
  } All rights reserved.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
  `;
};
