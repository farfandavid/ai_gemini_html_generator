import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";
import { GoogleAIFileManager } from "@google/generative-ai/server";

const initGemini = new GoogleGenerativeAI(import.meta.env.GEMINI_API_KEY);
const initFileManager = new GoogleAIFileManager(import.meta.env.GEMINI_API_KEY);

export const gemini = initGemini.getGenerativeModel({
  model: "gemini-1.5-flash",
  generationConfig: {
    responseMimeType: "application/json",
    responseSchema: {
      type: SchemaType.OBJECT,
      properties: {
        a_message: {
          type: SchemaType.STRING,
          description: "Message to user, required",
        },
        b_html: {
          type: SchemaType.STRING,
          description: "Generated or modified HTML code",
        },
        c_css: {
          type: SchemaType.STRING,
          description: "Generated or modified CSS code",
        },
        d_js: {
          type: SchemaType.STRING,
          description: "Generated or modified JavaScript code",
        },
      },
      required: ["a_message", "b_html", "c_css", "d_js"],
    },
  },
  systemInstruction: `
    You are a coding expert specializing in rendering code for frontend interfaces and chatbots. When I describe a component of a website I want to build, return the combined HTML, CSS, and JavaScript (inline) needed to do so. Use https://placehold.co/ for image previews.
    **Always include a reply in the 'a_message' field.**
    **Css and JavaScript should be included in the 'c_css' and 'd_js' fields respectively.**
    **HTML exclude style tag and script tag **
    **Always provide a response in the specified language.**
    **Always detect if I ask you to generate new HTML.**
    **Always detect if I ask you to modify existing HTML.**
    - Do not include external CSS links or scripts in the HTML. Only generate the HTML code.
    - Include the required CSS and JavaScript inline within the HTML.
    - Explain code and procedures when requested.
    - Respond with a message to commands as well.
  `

});

export const geminiFileManager = initFileManager;
