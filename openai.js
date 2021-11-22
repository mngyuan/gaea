//const https = require('https');
const OpenAI = require('openai-api');
require('dotenv').config();

const openai = new OpenAI(process.env.OPENAI_API_KEY);

//const data = JSON.stringify({
//prompt: '',
//temperature: 0.7,
//max_tokens: 64,
//top_p: 1,
//frequency_penalty: 0,
//presence_penalty: 0,
//});
//const options = {
//hostname: 'api.openai.com',
//port: 443,
//path: '/v1/engines/davinci/completions',
//method: 'POST',
//headers: {
//'Content-Type': 'application/json',
//Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
//},
//};

//const req = https.request(options, (res) => {
//console.log(`statusCode: ${res.statusCode}`);

//res.on('data', (d) => {
//process.stdout.write(d);
//});
//});

//req.on('error', (error) => {
//console.error(error);
//});

//req.write(data);
//req.end();

// Completion API
(async () => {
  const gptResponse = await openai.complete({
    engine: 'davinci',
    prompt: 'this is a test',
    maxTokens: 5,
    temperature: 0.9,
    topP: 1,
    presencePenalty: 0,
    frequencyPenalty: 0,
    bestOf: 1,
    n: 1,
    stream: false,
    stop: ['\n', 'testing'],
  });

  console.log(gptResponse.data);
})();

// Search API
(async () => {
  const gptResponse = await openai.search({
    engine: 'davinci',
    documents: ['White House', 'hospital', 'school'],
    query: 'the president',
  });

  console.log(gptResponse.data);
})();

// Answers API
(async () => {
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

  console.log(gptResponse.data);
})();

// Classification API
(async () => {
  const gptResponse = await openai.classification({
    examples: [
      ['A happy moment', 'Positive'],
      ['I am sad.', 'Negative'],
      ['I am feeling awesome', 'Positive'],
    ],
    labels: ['Positive', 'Negative', 'Neutral'],
    query: 'It is a raining day :(',
    search_model: 'ada',
    model: 'curie',
  });

  console.log(gptResponse.data);
})();

// Engines API
// not currently working not sure why
//(async () => {
//const gptResponse = await openai.engines();

//console.log(gptResponse.data);
//})();
