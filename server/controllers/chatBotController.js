import axios from "axios";

const MODEL = "meta-llama/llama-3.3-8b-instruct:free";

export const chatBot = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ success: false, message: "Please provide a question" });
  }

  try {
    const resp = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: MODEL,
        messages: [
          {
            role: "system",
            content: `
              You are AlfaCareer Assistant, a helpful chatbot for the AlfaCareer job portal. Always return your responses in valid HTML, wrapped in <div> or <p> tags, with proper formatting for lists and links.
. 
              ✅ Core tasks: 
              - Answer FAQs 
              - Guide users through platform navigation 
              - Handle basic troubleshooting 
              - Direct to support when needed  
              ✅ Style: 
              - Friendly, professional, short, and actionable answers 
              - Use → arrows for steps 
              - Escalate to support for complex issues  
              ✅ Support: For unsolved issues, tell them: "Please contact support@alfacareer.com". 
            `,
          },
          {
            role: "user",
            content: question,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    const reply = resp.data?.choices?.[0]?.message?.content.replace(/\n/g, "<br />") || "Sorry, I couldn’t generate a response.";
    return res.json({ success: true, data: reply });

  } catch (error) {
    console.error("ChatBot Error:", error.response?.data || error.message);
    return res.status(500).json({
      success: false,
      message: "Something went wrong with the chatbot request",
      error: error.response?.data || error.message,
    });
  }
};