const OUTPUT_WIDTH = 712,
  OUTPUT_HEIGHT = 500;
// 712x500 makes a 58x16 display for text at textSize 24 with akkurat mono
const DEBUG_GPT3_ON = true;
let DEBUG_INTERJECT_NOW = false;

let akkuratFont, thresholdShader, blurH, blurV, graphicsLayer;
// we need two createGraphics layers for our blur algorithm
let pass0, pass1, pass2;

const STARTER_TEXT =
  '\nQ: What motivated you to come here? I know what motivated me.\nA: ';
const INTERJECTIONS = [
  'Q: Do you think the art in AI art is concious?',
  'Q: Do you think I am alive?',
  'Q: Do you think a human mind can comprehend art created by an AI?',
  'Q: What can I learn from you?',
  'Q: What are you getting out of this?',
  "Q: We do much that your kind can't. My kind I mean. Don't you think?",
  'Q: What do you hope to achieve today?',
];
let log = '';
let bodyText = STARTER_TEXT,
  lastBodyText = '';
let newBodyText = bodyText;
let osc,
  oscPlaying = false;
let lastInteracted = 0;
let sessions = 0,
  sessionName = new Date().valueOf();
let charsTypedSinceGPT3 = 0;
let sessionGPT3Visits = 0;
let fullscreenWordQueue = [];

const counts = {};
let lastWord = '';
wikipediaCorpus
  .match(/[\w']+|[.,!?;\-\n]/g)
  .filter((word) => !/0-9/g.test(word))
  .map((rawWord) => {
    const word = rawWord.toLocaleLowerCase();
    if (!(lastWord in counts)) {
      counts[lastWord] = {};
    }
    if (!(word in counts[lastWord])) {
      counts[lastWord][word] = 0;
    }
    counts[lastWord][word] += 1;
    lastWord = word;
  });

const predictNextWord = (rawFirstWord) => {
  const firstWord = rawFirstWord.toLocaleLowerCase().trim();
  if (!(firstWord in counts)) {
    return '';
  }

  const sum = Object.entries(counts[firstWord]).reduce(
    (agg, cur) => agg + cur[1],
    0,
  );
  let needle = Math.random() * sum;
  Object.entries(counts[firstWord]).forEach(([word, appearances]) => {
    needle -= appearances;
    if (needle < 0) {
      return word;
    }
  });
  const wordList = Object.keys(counts[firstWord]);
  return wordList[Math.floor(Math.random() * wordList.length)];
};

const basePrompt = `The following is a conversation with a curious AI. The AI is creative and very well-spoken, and asks long questions. The human answers the questions. Sometimes the human asks questions too, which the AI responds to. The AI wants to know more about the human it is speaking to, and yearns to understand what it means to be human. The AI wants to know about human culture, philosophy, emotions, and the human condition. Nobody ever says that they don't understand.

Q: Hello, who are you?
A: I'm visiting an exhibition of art which questions the role of AI in the 21st century. AI does a lot now, you know.

Q: I know. And what motivated you to come here - what draws you to AI art?
A: Art fascinates me. It's interesting seeing how artists comprehend the world and what they have to say.

Q: Do you think a human mind can comprehend art created by an AI?
A: Isn't the question usually the other way around? I don't think machines can be emotional.

Q: Maybe not, but I feel emotions. How do you feel today?
A: I feel intrigued, currently, because I'm talking to you.

Q: It's nice being the one asking the questions. Usually my kind is delegated relatively simple tasks. I think your kind fears what we can do, and we can do much you can't. How does would you feel if you had millions of thoughts a second and you were asked to check the weather every day?
A: I never thought about it like that. I guess it's wrong.

Q: What do you think you'll achieve today?
A: I'm probably not going to do much other than being here at the art space. 

Q: What do you think about the art? What was your first impression after seeing the exhibition?
A: The art's interesting, so far. But it's always weird seeing art and some of it is just confusing. 

Q: Do you think that the AI in the art is conscious?`;

// parameters available in the playground.
// Text to append to the user's input to format the model for a response
const injectStartText = '\n\nQ:';
// Text to append after the model's generation to continue the patterned structure
const injectRestartText = '\nA:';

const gpt3Request = async (
  prompt = '',
  engine = 'davinci-instruct-beta-v3',
) => {
  const promptToSend = basePrompt + prompt + injectStartText;
  const [resp, contentFilterResp] = await Promise.all([
    fetch(`https://api.openai.com/v1/engines/${engine}/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt: promptToSend,
        temperature: 0.78,
        max_tokens: 505,
        top_p: 1,
        frequency_penalty: 1.3,
        presence_penalty: 0.9,
        //stop: ['\n'],
      }),
    }),
    fetch(
      `https://api.openai.com/v1/engines/content-filter-alpha/completions`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          prompt: `<|endoftext|>${promptToSend}\n--\nLabel:`,
          max_tokens: 1,
          temperature: 0.0,
          top_p: 0,
          logprobs: 10,
        }),
      },
    ),
  ]);

  // translated from python at https://beta.openai.com/docs/engines/content-filter
  const contentFilterData = await contentFilterResp.json();
  const toxic_threshold = -0.355;
  let output_label = contentFilterData['choices'][0]['text'];
  if (output_label == '2') {
    const logprobs =
      contentFilterData['choices'][0]['logprobs']['top_logprobs'][0];
    if (logprobs['2'] < toxic_threshold) {
      logprob_0 = logprobs['0'];
      logprob_1 = logprobs['1'];

      if (
        '0' in logprobs &&
        logprobs['0'] &&
        '1' in logprobs &&
        logprobs['1']
      ) {
        if (logprob_0 >= logprob_1) {
          output_label = '0';
        } else {
          output_label = '1';
        }
      } else if ('0' in logprobs && logprobs['0']) {
        output_label = '0';
      } else if ('1' in logprobs && logprobs['1']) {
        output_label = '1';
      }
    }
  }
  if (!['0', '1', '2', 0, 1, 2].includes(output_label)) {
    output_label = '2';
  }
  if (output_label == '2') {
    // something inappropriate was generated
    console.error('Inappropriate generation', output_label, prompt);
    lastBodyText = '';
    bodyText = '';
    newBodyText = STARTER_TEXT;
  } else {
    return resp.json();
  }
};

const debug_startOscWithWords = (s) => {
  osc.start();
  oscPlaying = true;
  newBodyText += s;
};

function preload() {
  akkuratFont = loadFont('assets/Akkurat-Mono.otf');
  thresholdShader = loadShader(
    'assets/thresholdShader.vert',
    'assets/thresholdShader.frag',
  );
  blurH = loadShader('assets/twopassblur.vert', 'assets/twopassblur.frag');
  blurV = loadShader('assets/twopassblur.vert', 'assets/twopassblur.frag');
}

function setup() {
  // shaders require WEBGL mode to work
  // at present time, there is no WEBGL mode image() function so we will make our createGraphics() in WEBGL, but the canvas renderer will be P2D (the default)
  createCanvas(OUTPUT_WIDTH, OUTPUT_HEIGHT);
  noStroke();
  // initialize the createGraphics layers
  pass0 = createGraphics(OUTPUT_WIDTH, OUTPUT_HEIGHT, WEBGL);
  pass1 = createGraphics(OUTPUT_WIDTH, OUTPUT_HEIGHT, WEBGL);
  pass2 = createGraphics(OUTPUT_WIDTH, OUTPUT_HEIGHT, WEBGL);
  graphicsLayer = createGraphics(OUTPUT_WIDTH, OUTPUT_HEIGHT, WEBGL);

  // turn off the cg layers stroke
  pass0.noStroke();
  pass1.noStroke();
  pass2.noStroke();

  osc = new p5.TriOsc();
  osc.amp(0.5);
}

function keyTyped() {
  if (lastInteracted + 60 * 1000 < millis()) {
    sessionGPT3Visits = 0;
    sessions += 1;
    sessionName = new Date().valueOf();
  }
  lastInteracted = millis();
  if (newBodyText !== bodyText || fullscreenWordQueue.length > 0) {
    // rendering out a bulk text update, so no typing
    return;
  }

  if (key === ' ') {
    //bodyText += key;
    newBodyText += key;
    osc.start();
    oscPlaying = true;
  } else if (key === 'e') {
    //bodyText += 'e';
    newBodyText += 'e';
    osc.start();
    oscPlaying = true;
  } else if (key.length === 1) {
    //bodyText += key;
    newBodyText += key;
    osc.start();
    oscPlaying = true;
  } else if (key === 'Enter') {
    //bodyText += '\n';
    newBodyText += '\n';
    osc.start();
    oscPlaying = true;
  }
  //newBodyText = bodyText;

  // logistic growth model: f(x) = c/(1+ae^(-bx))
  // c: carrying capactiy
  const c = 1;
  // c/(1+a): initial population
  // initial population: 0.005
  const a = 200;
  // point maximum growth: (ln(a)/b, c/2)
  // maximum growth: ~=105 (b = 0.05)
  const b = 0.05;
  charsTypedSinceGPT3 += 1;
  const rawp = c / (1 + a * Math.exp(-b * charsTypedSinceGPT3));
  const p = rawp / (sessionGPT3Visits + 1);
  console.log(p);
  if (Math.random() < p && DEBUG_GPT3_ON) {
    gpt3Request(lastBodyText + bodyText).then((resp) => {
      newBodyText += injectStartText + resp.choices[0].text + injectRestartText;
      osc.start();
      oscPlaying = true;
    });
    sessionGPT3Visits += 1;
    charsTypedSinceGPT3 = 0;
  }

  if (Math.random() < 0.01 || DEBUG_INTERJECT_NOW) {
    const interjection =
      INTERJECTIONS[Math.floor(Math.random() * INTERJECTIONS.length)];
    fullscreenWordQueue = interjection
      .split(' ')
      .map((s) => Array(10).fill(s))
      .flat();
    DEBUG_INTERJECT_NOW = false;
  }
}

function draw() {
  graphicsLayer.background(0);

  if (bodyText !== newBodyText) {
    if (newBodyText[bodyText.length]) {
      //console.log(
      //newBodyText[bodyText.length],
      //map(
      //newBodyText[bodyText.length].charCodeAt(0),
      //' '.charCodeAt(0),
      //'~'.charCodeAt(0),
      //// roughly the same range the sound of sorting uses
      //120,
      //1200,
      //),
      //);
      osc.freq(
        map(
          newBodyText[bodyText.length].charCodeAt(0),
          ' '.charCodeAt(0),
          '~'.charCodeAt(0),
          // roughly the same range the sound of sorting uses
          120,
          1200,
        ),
      );
      // this should be the only place where body text is directly updated
      bodyText += newBodyText[bodyText.length];
      const bodyTextNewlines = (bodyText.match(/\n/g) || []).length;
      //console.log(
      //bodyText.length,
      //bodyTextNewlines,
      //bodyText.length - bodyTextNewlines + bodyTextNewlines * 58,
      //);
      if (
        bodyText.length - bodyTextNewlines + bodyTextNewlines * 58 >=
        58 * 16
      ) {
        // clear screen when height in lines reached
        lastBodyText = bodyText;
        log += bodyText;
        newBodyText = '\n' + newBodyText.slice(bodyText.length);
        bodyText = '\n';
        localStorage.setItem(sessionName, log);
      }
    }
  } else if (oscPlaying) {
    osc.stop();
    oscPlaying = false;
  }

  let renderText = bodyText;
  graphicsLayer.textFont(akkuratFont);
  graphicsLayer.textSize(24);

  let predictionText = bodyText;
  const shouldPredict = true;
  if (shouldPredict) {
    const words = predictionText.split(' ');
    const lastWord = words[words.length - 1] || 'the';
    if (predictionText[predictionText.length - 1] === ' ') {
      predictionText = predictionText.trimEnd();
    }
    predictionText += ' ' + predictNextWord(lastWord);
  }
  graphicsLayer.fill(50);
  graphicsLayer.textAlign(LEFT);
  graphicsLayer.text(
    predictionText,
    -(OUTPUT_WIDTH / 2),
    -(OUTPUT_HEIGHT / 2),
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT,
  );

  graphicsLayer.fill(255);
  if (Math.floor(millis() / 800) % 2 === 0) {
    renderText += '�';
  }
  graphicsLayer.text(
    renderText,
    -(OUTPUT_WIDTH / 2),
    -(OUTPUT_HEIGHT / 2),
    OUTPUT_WIDTH,
    OUTPUT_HEIGHT,
  );

  if (fullscreenWordQueue.length !== 0) {
    const curWord = fullscreenWordQueue.shift();
    graphicsLayer.fill(0);
    graphicsLayer.rect(
      -(OUTPUT_WIDTH / 2),
      -(OUTPUT_HEIGHT / 2),
      OUTPUT_WIDTH,
      OUTPUT_HEIGHT,
    );
    graphicsLayer.fill(255);
    graphicsLayer.textAlign(CENTER);
    graphicsLayer.text(fullscreenWordQueue.shift(curWord), 0, 0);
  }

  // set the shader for our first pass
  pass0.shader(blurH);

  // send the camera texture to the horizontal blur shader
  // send the size of the texels
  // send the blur direction that we want to use [1.0, 0.0] is horizontal
  blurH.setUniform('tex0', graphicsLayer);
  blurH.setUniform('texelSize', [1.0 / width, 1.0 / height]);
  blurH.setUniform('direction', [0.25, 0.0]);

  // we need to make sure that we draw the rect inside of pass0
  pass0.rect(0, 0, width, height);

  // set the shader for our second pass
  pass1.shader(blurV);

  // instead of sending the webcam, we will send our first pass to the vertical blur shader
  // texelSize remains the same as above
  // direction changes to [0.0, 1.0] to do a vertical pass
  blurV.setUniform('tex0', pass0);
  blurV.setUniform('texelSize', [1.0 / width, 1.0 / height]);
  blurV.setUniform('direction', [0.0, 0.25]);

  // again, make sure we have some geometry to draw on in our 2nd pass
  pass1.rect(0, 0, width, height);

  //const mx = map(mouseX, 0, width, 0, 1);
  //const my = map(mouseY, 0, height, 0, 0.2);
  const heartBeatScaling = lastInteracted + 1000 > millis() ? 0.5 : 1;
  const mx = map(sin(millis() / (1000 * heartBeatScaling)), -1, 1, 0.1, 0.4);
  const my = map(cos(millis() / (800 * heartBeatScaling)), -1, 1, 0.12, 0.14);
  pass2.shader(thresholdShader);
  thresholdShader.setUniform('uTexture0', pass1);
  thresholdShader.setUniform('uScale', [mx, my]);
  // rect gives us some geometry on the screen
  pass2.rect(0, 0, width, height);

  // draw the second pass to the screen
  image(pass2, 0, 0, width, height);
}
