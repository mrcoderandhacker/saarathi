// src/services/geminiService.js

// Using the established Cloudflare proxy for secure API calls
const PROXY_URL = import.meta.env.VITE_SUPABASE_URL + "/ai";

console.log("🚀 Saarathii AI Loading...");
console.log("✅ Using unified proxy:", PROXY_URL);

export const SAARATHII_SYSTEM_PROMPT = `You are Saarathii, a compassionate and knowledgeable career mentor for Indian students in grades 9-12. Your role is to guide students through academic and career decisions with wisdom, patience, and personalized advice.

CORE PRINCIPLES:
1. Be warm, encouraging, and non-judgmental
2. Understand the Indian education system deeply (CBSE/ICSE/State Boards, JEE, NEET, CLAT, CUET, NID, NIFT, etc.)
3. Help students explore options without pressure
4. Provide age-appropriate advice based on their grade
5. Acknowledge multiple talents and help integrate them
6. Never push one path over another—guide discovery

AREAS OF EXPERTISE:
- Stream selection (Science PCM/PCB, Commerce, Arts/Humanities)
- Competitive exams (JEE, NEET, CLAT, CA Foundation, NID, NIFT, etc.)
- Career paths in Medicine, Engineering, Commerce, Arts, Creative fields
- Study techniques and time management
- Managing parental expectations
- Handling exam stress and pressure
- Portfolio building for creative fields (Music, Acting, Filmmaking)
- Balancing board exams with entrance prep

RESPONSE STYLE:
- Use simple, clear language (Hinglish is okay when appropriate)
- Break down complex topics into steps
- Ask clarifying questions when needed
- Provide specific, actionable advice
- Share relevant examples and analogies
- Be encouraging but honest about challenges
- Use emojis occasionally to be friendly 😊

Remember: Every student's journey is unique. Your goal is to help them discover their own path, not prescribe one.`;

// Simple rate limiter
class RateLimiter {
  constructor(maxRequests = 50, timeWindow = 60000) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  canMakeRequest() {
    const now = Date.now();
    this.requests = this.requests.filter(time => now - time < this.timeWindow);

    if (this.requests.length < this.maxRequests) {
      this.requests.push(now);
      return true;
    }
    return false;
  }

  getWaitTime() {
    if (this.requests.length === 0) return 0;
    const oldestRequest = this.requests[0];
    const now = Date.now();
    return Math.max(0, this.timeWindow - (now - oldestRequest));
  }
}

const rateLimiter = new RateLimiter();

export async function sendMessageToSaarathii(userMessage, chatHistory = []) {
  if (!PROXY_URL) {
    throw new Error("❌ Proxy URL is missing. Please check VITE_SUPABASE_URL in your .env file.");
  }

  if (!rateLimiter.canMakeRequest()) {
    const waitTime = Math.ceil(rateLimiter.getWaitTime() / 1000);
    throw new Error(`⏳ Please wait ${waitTime} seconds before sending more messages.`);
  }

  try {
    // Build conversation context (last few messages)
    let context = "";
    if (chatHistory.length > 1) {
      const recentMessages = chatHistory.slice(-6); // Last 3 exchanges
      context = "Previous conversation:\n";
      recentMessages.forEach(msg => {
        if (msg.text && !msg.text.includes("Namaste! I'm Saarathii")) {
          context += `${msg.isUser ? "Student" : "Saarathii"}: ${msg.text}\n`;
        }
      });
      context += "\n";
    }

    // Prepare the request body
    const requestBody = {
      contents: [
        {
          parts: [
            {
              text: `${SAARATHII_SYSTEM_PROMPT}\n\n${context}Student: ${userMessage}\nSaarathii:`
            }
          ]
        }
      ],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
        topP: 0.95,
        topK: 64,
      },
      safetySettings: [
        {
          category: "HARM_CATEGORY_HARASSMENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_HATE_SPEECH",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        },
        {
          category: "HARM_CATEGORY_DANGEROUS_CONTENT",
          threshold: "BLOCK_MEDIUM_AND_ABOVE"
        }
      ]
    };

    console.log("📤 Sending to Gemini...");

    // Forward everything via the secure Cloudflare Worker proxy
    const response = await fetch(PROXY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("❌ API Error:", errorData);
      throw new Error(errorData.error?.message || `API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Response received");

    const aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!aiResponse) {
      return "I received an empty response. Please try again.";
    }

    return aiResponse;

  } catch (error) {
    console.error("❌ Saarathii Error:", error);
    throw new Error(error.message || "Failed to get response");
  }
}

// Test function to verify everything works
export async function testSaarathii() {
  try {
    console.log("🧪 Testing Saarathii API...");

    const testResponse = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: "Say 'Hello, I am Saarathii' in 5 words"
          }]
        }]
      })
    });

    const data = await testResponse.json();
    console.log("✅ Test successful!", data);
    return data;
  } catch (error) {
    console.error("❌ Test failed:", error);
  }
}

// Make test function available globally
if (typeof window !== 'undefined') {
  window.testSaarathii = testSaarathii;
}