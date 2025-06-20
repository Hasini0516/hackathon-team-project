// services/hfService.js
const axios = require('axios');
require('dotenv').config();

const HF_TOKEN = process.env.HF_TOKEN;
if (!HF_TOKEN) {
  console.error('HF_TOKEN not set in environment');
}

const HF_MODEL = 'HuggingFaceH4/zephyr-7b-beta'; // or whichever

async function callHuggingFace(prompt) {
  const url = `https://api-inference.huggingface.co/models/${HF_MODEL}`;
  try {
    const response = await axios.post(
      url,
      { inputs: prompt, parameters: { max_new_tokens: 512, temperature: 0.7 } },
      {
        headers: {
          Authorization: `Bearer ${HF_TOKEN}`,
          'Content-Type': 'application/json',
        },
        timeout: 120000, // adjust as needed
      }
    );
    
    if (Array.isArray(response.data) && response.data.length > 0) {
      return response.data[0].generated_text;
    }
    // In some cases response.data might be a string or object
    if (typeof response.data === 'string') {
      return response.data;
    }
    if (response.data.generated_text) {
      return response.data.generated_text;
    }
    // fallback
    return JSON.stringify(response.data);
  } catch (err) {
    console.error('Error calling Hugging Face API:', err.response?.data || err.message);
    throw new Error('Hugging Face inference failed');
  }
}

function buildPrompt(question) {
  // replicate your Python prompt logic
  const roadmapKeywords = [
    'career','path','become','field','developer','engineer','data','learn','AI','switch','job','intern','roadmap'
  ];
  const isSpecific = roadmapKeywords.some(word =>
    question.toLowerCase().includes(word.toLowerCase())
  );

  if (isSpecific) {
    return `<|system|>You are a Senior Career Coach.<|end|>
<|user|>I'm a professional asking: "${question}"
Please answer in this format:
1. Month 1–3: Learn [X] via [Y]
2. Month 4–6: Apply [Z] via [W]
3. Key skills: ...
4. Resource links: ...
5. Salary range: ...
6. Success rate: ...%<|end|>
<|assistant|>`;
  } else {
    return `<|system|>You are a Senior Career Coach.<|end|>
<|user|>${question}<|end|>
<|assistant|>`;
  }
}

async function getCareerAdvice(question) {
  const prompt = buildPrompt(question);
  const text = await callHuggingFace(prompt);

  const assistantTag = '<|assistant|>';
  let response = text;
  if (text.includes(assistantTag)) {
    response = text.split(assistantTag).pop().trim();
  }
  return response;
}

module.exports = { getCareerAdvice };
