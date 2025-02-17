import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = "AIzaSyCUzGFnVHznL5N0pmrrJGnLvBKRAGlnuAw";
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
  model: "gemini-2.0-flash",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 40,
  maxOutputTokens: 8192,
  responseMimeType: "text/plain",
};

async function runChat(prompt) {
  try {
    const chatSession = model.startChat({
      generationConfig,
      history: [],
    });

    const result = await chatSession.sendMessage(prompt);

    console.log("Full Response:", result); 

    if (result.response && typeof result.response.text === "function") {
      const responseText = await result.response.text(); 
      console.log(responseText);
      return responseText;
    } else {
      console.error("Unexpected API response format:", result);
      return "Error: Unexpected response format";
    }
  } catch (error) {
    console.error("Error in runChat:", error);
  }
}

export default runChat;
