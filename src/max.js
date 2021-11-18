// to be called from a node-script object within max
// otherwise, the 'max-api' package won't exist
const Max = require('max-api');
const OpenAI = require('openai-api');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

// Use the 'addHandler' function to register a function for a particular message
Max.addHandler('bang', async () => {
  const gptResponse = await openai.answers({
    documents: ['Puppy A is happy.', 'Puppy B is sad.'],
    question: 'which puppy is happy?',
    search_model: 'ada',
    model: 'curie',
    examples_context: 'In 2017, U.S. life expectancy was 78.6 years.',
    examples: [
      ['What is human life expectancy in the United States?', '78 years.'],
    ],
    max_tokens: 5,
    stop: ['\n', '<|endoftext|>'],
  });

  Max.post(gptResponse.data);
});
