const express = require("express");
const fs = require("fs");
const { OpenAI } = require("openai");
const cors = require("cors");

const corsOptions = {
  origin: "*",
  credentials: true,
  optionSuccessStatus: 200,
};

require("dotenv").config();

const app = express();
const PORT = 5555;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(express.json());
app.use(cors(corsOptions));

app.get("/getGeneratedArticle", async (_req, res) => {
  const generatedArticle = fs.readFileSync("artykul.html", "utf8");
  res.send(generatedArticle);
});

app.post("/generateArticle", async (req, res) => {
  try {
    const baseArticle = fs.readFileSync("baseArticle.txt", "utf8");
    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content: `
              Here I have an article: ${baseArticle}. I want to format it into code so that I can place it between the <body> tags in the html file.
              Use tags like h, p, span etc, tags that are used to write such articles. In the places where you think it fits to insert the photo, place the <img/> tag with src=“image_placeholder.jpg”,
              and as the alt value, insert the prompt that is needed to generate this particular photo using the model from openAI. Add descriptions to the images, use figure and figcaption.
              Start the prompt with the words: Generate image showing: . Do not use js code, css and head and body tags. Return only the code that should be placed between the body tags, without any additional text, do not wrap it into any kind of bracket.
            `,
        },
      ],
      model: "gpt-4o-mini",
    });

    const htmlContent = chatCompletion.choices[0].message.content;
    fs.writeFileSync("artykul.html", htmlContent, "utf8");

    res.json("Successfully created html file");
  } catch (error) {
    console.error(error);
    res.status(500).send("Something went wrong!");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port: ${PORT}`);
});
