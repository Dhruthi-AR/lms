require('dotenv').config();
const { HfInference } = require('@huggingface/inference');
const hf = new HfInference(process.env.HF_ACCESS_TOKEN);

async function test(modelId) {
  try {
    const response = await hf.chatCompletion({
      model: modelId,
      messages: [
        { role: "system", content: "You are a helpful AI tutor." },
        { role: "user", content: "What is SQL?" }
      ],
      max_tokens: 50,
      temperature: 0.7
    });
    console.log(`Success with ${modelId}:`, response.choices[0].message.content.substring(0, 50));
  } catch(err) {
    console.error(`HF failed with ${modelId}:`, err.message);
  }
}

async function run() {
  await test("mistralai/Mistral-7B-Instruct-v0.3");
  await test("google/gemma-7b-it");
  await test("Qwen/Qwen2.5-72B-Instruct");
  await test("microsoft/Phi-3-mini-4k-instruct");
}
run();
