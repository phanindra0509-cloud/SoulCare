import OpenAI from "openai";

const client = new OpenAI({
  apiKey: "YOUR_API_KEY_HERE", // Replace this with your actual API key!
});

async function healthChat(userInput) {
  try {
    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: `You are a helpful health assistant. Give safe, general advice only. User: ${userInput}`,
    });

    console.log("Chatbot Response:");
    console.log(response.output[0].content[0].text);
  } catch (error) {
    if (error.message.includes("apiKey") || error.message.includes("401")) {
      console.error("\n❌ ERROR: You need to replace 'YOUR_API_KEY_HERE' in this file with your actual OpenAI API key first!\n");
    } else {
      console.error("\n❌ API ERROR:", error.message);
    }
  }
}

// Example
healthChat("I have a headache, what should I do?");
