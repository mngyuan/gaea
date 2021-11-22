let akkuratFont;

function setup() {
  createCanvas(1280, 720);
  akkuratFont = loadFont('assets/Akkurat-Mono.otf');
}

function draw() {
  background(0);
  fill(255);
  textFont(akkuratFont);
  textSize(24);
  text('p5*js', 10, 50);
}
