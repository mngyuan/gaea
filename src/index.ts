import p5 from 'p5';

const sketch = (s) => {
  let akkuratFont;
  s.setup = () => {
    s.createCanvas(1280, 720);
    akkuratFont = s.loadFont('./assets/Akkurat-Mono.otf');
  };

  s.draw = () => {
    s.background(0);
    s.fill(255);
    s.textFont(akkuratFont);
    s.textSize(24);
    s.text('p5*js', 10, 50);
  };
};

const sketchInstance = new p5(sketch);
