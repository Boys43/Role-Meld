import SibApiV3Sdk from 'sib-api-v3-sdk';
import 'dotenv/config'; // or require('dotenv').config();

console.log("BREVO_API_KEY:", process.env.BREVO_API_KEY?.slice(0, 6)); 

// Configure Brevo client
const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications['api-key'];
apiKey.apiKey = process.env.BREVO_API_KEY;

const tranEmailApi = new SibApiV3Sdk.TransactionalEmailsApi();

export async function sendEmail(to, subject, htmlContent) {
  try {
    const sendSmtpEmail = {
      sender: { name: "Alfa Career", email: "movietrendmaker2244@gmail.com" },
      to: [{ email: to }],
      subject,
      htmlContent,
    };

    const response = await tranEmailApi.sendTransacEmail(sendSmtpEmail);
    console.log("Email sent successfully:", response.messageId);
    return true;
  } catch (error) {
    console.error("Email sending error:", error.response?.body || error);
    return false;
  }
}

await sendEmail(
  "nt50616849@gmail.com", 
  "Welcome to Alfa Career 🎉", 
  "<p>Thanks for signing up!</p>"
);
