let akkuratFont, thresholdShader, graphicsLayer;

function preload() {
  akkuratFont = loadFont('assets/Akkurat-Mono.otf');
  thresholdShader = loadShader(
    'assets/thresholdShader.vert',
    'assets/thresholdShader.frag',
  );
}

function setup() {
  createCanvas(1280, 720, WEBGL);
  graphicsLayer = createGraphics(1280, 720, WEBGL);
}

function draw() {
  const mx = map(mouseX, 0, width, 0, 1);
  const my = map(mouseY, 0, height, 0, 0.2);
  shader(thresholdShader);
  thresholdShader.setUniform('uTexture0', graphicsLayer);
  thresholdShader.setUniform('uScale', [mx, my]);

  graphicsLayer.background(0);

  graphicsLayer.fill(255);
  graphicsLayer.textFont(akkuratFont);
  graphicsLayer.textSize(24);
  graphicsLayer.text('p5*js', 0, 24);

  // rect gives us some geometry on the screen
  rect(0, 0, width, height);
}
