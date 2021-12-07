let akkuratFont, thresholdShader, graphicsLayer;
let bodyText = '\nQ: Hello.\nA: ';
let newBodyText = bodyText;
let osc,
  oscPlaying = false;

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

const basePrompt = `I am a highly intelligent question answering bot. If you ask me a question that is rooted in truth, I will give you the answer. If you ask me a question that is nonsense, trickery, or has no clear answer, I will respond with "Unknown".\n\nQ: What is human life expectancy in the United States?\nA: Human life expectancy in the United States is 78 years.\n\nQ: Who was president of the United States in 1955?\nA: Dwight D. Eisenhower was president of the United States in 1955.\n\nQ: Which party did he belong to?\nA: He belonged to the Republican Party.\n\nQ: What is the square root of banana?\nA: Unknown\n\nQ: How does a telescope work?\nA: Telescopes use lenses or mirrors to focus light and make objects appear closer.\n\nQ: Where were the 1992 Olympics held?\nA: The 1992 Olympics were held in Barcelona, Spain.\n\nQ: How many squigs are in a bonk?\nA: Unknown\n\nQ: Where is the Valley of Kings?\nA:'`;

const gpt3Request = async (prompt = basePrompt, engine = 'davinci') => {
  const resp = await fetch(
    `https://api.openai.com/v1/engines/${engine}/completions`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        temperature: 0,
        max_tokens: 100,
        top_p: 1,
        frequency_penalty: 0.0,
        presence_penalty: 0.0,
        //stop: ['\n'],
      }),
    },
  );
  return resp.json();
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
}

function setup() {
  createCanvas(640, 480, WEBGL);
  graphicsLayer = createGraphics(640, 480, WEBGL);
  osc = new p5.TriOsc();
  osc.amp(0.5);
}

function keyTyped() {
  if (newBodyText !== bodyText) {
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

  if (Math.random() < 0.01) {
    gpt3Request(bodyText).then((resp) => {
      newBodyText += resp.choices[0].text;
      osc.start();
      oscPlaying = true;
    });
  }
}

function draw() {
  const mx = map(mouseX, 0, width, 0, 1);
  const my = map(mouseY, 0, height, 0, 0.2);
  shader(thresholdShader);
  thresholdShader.setUniform('uTexture0', graphicsLayer);
  thresholdShader.setUniform('uScale', [mx, my]);

  graphicsLayer.background(0);

  if (bodyText !== newBodyText) {
    if (newBodyText[bodyText.length]) {
      console.log(
        newBodyText[bodyText.length],
        map(
          newBodyText[bodyText.length].charCodeAt(0),
          ' '.charCodeAt(0),
          '~'.charCodeAt(0),
          // roughly the same range the sound of sorting uses
          120,
          1200,
        ),
      );
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
      bodyText += newBodyText[bodyText.length];
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
  graphicsLayer.text(predictionText, -320, -240, 640, 480);

  graphicsLayer.fill(255);
  if (Math.floor(millis() / 800) % 2 === 0) {
    renderText += '�';
  }
  graphicsLayer.text(renderText, -320, -240, 640, 480);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}
