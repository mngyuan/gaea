precision mediump float;

varying vec2 vTexCoord;
uniform sampler2D uTexture0;
// from blur.frag
uniform vec2 texelSize;

uniform vec2 uScale;

void main() {
  // ***************** single-pass-blur.frag
  vec2 uv = vTexCoord;
  // the texture is loaded upside down and backwards by default so lets flip it
  uv = vec2(uv.x, 1.0 - uv.y);

  // a single pass blur works by sampling all the neighbor pixels and averaging them up
  // this is somewhat inefficient because we have to sample the texture 9 times -- texture2D calls are slow :( 
  // check out the two-pass-blur example for a better blur approach
  // get the webcam as a vec4 using texture2D

  // spread controls how far away from the center we should pull a sample from
  // you will start to see artifacts if you crank this up too high
  float spread = 4.0;

  // create our offset variable by multiplying the size of a texel with spread
  vec2 offset = texelSize * spread;

  // get all the neighbor pixels!
  vec4 tex = texture2D(uTexture0, uv); // middle middle -- the actual texel / pixel
  tex += texture2D(uTexture0, uv + vec2(-offset.x, -offset.y)); // top left
  tex += texture2D(uTexture0, uv + vec2(0.0, -offset.y)); // top middle
  tex += texture2D(uTexture0, uv + vec2(offset.x, -offset.y)); // top right

  tex += texture2D(uTexture0, uv + vec2(-offset.x, 0.0)); //middle left
  tex += texture2D(uTexture0, uv + vec2(offset.x, 0.0)); //middle right

  tex += texture2D(uTexture0, uv + vec2(-offset.x, offset.y)); // bottom left
  tex += texture2D(uTexture0, uv + vec2(0.0, offset.y)); // bottom middle
  tex += texture2D(uTexture0, uv + vec2(offset.x, offset.y)); // bottom right

  // we added 9 textures together, so we will divide by 9 to average them out and move the values back into a 0 - 1 range
  tex /= 9.0;

  // ****************** threshold.frag
  // Sample our blur texture
  vec4 color = tex;
  
  // Convert to gray scale
  color.rgb = vec3((color.r + color.g + color.b) / 3.0);
  
  // we will plug these into smoothstep
  // Colors less than edge will be black
  // Colors brighter than edge + feather will be white
  // Colors in between edge and edge plus feather will be grayscale
  float edge = uScale.x;
  float feather = uScale.y;
  
  // Smoothstep the colors
  color.rgb = smoothstep(edge, edge + feather, color.rgb);    
  
  // You could also just do step instead
  // color.rgb = step(edge, color.rgb);
  
  // Send the color to the screen
  gl_FragColor = color;

}
