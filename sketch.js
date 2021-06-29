let serialController;
let receivedValues;

let cols;
let rows;
let current;
let previous; 
let weight = 800;
let started = false;
let stone;
let stoneCounter = 1;
let strength = 1;
let dampening = 0.99;
let pressed = false;
let fontRegular, fontPebble, fontSans;

function preload(){
  fontRegular = loadFont("normal.ttf");
  fontPebble = loadFont("Pebbles.ttf");  
}



function setup() {
  frameRate(120);
  // pixel density
  pixelDensity(1);
  // canvas
  canvas = createCanvas(windowWidth, windowHeight).parent('#canvas');
  cols = width;
  rows = height;
  // The following line initializes a 2D cols-by-rows array with zeroes
  // in every array cell, and is equivalent to this Processing line:
  // current = new float[cols][rows];
  current = new Array(cols).fill(0).map(n => new Array(rows).fill(0));
  previous = new Array(cols).fill(0).map(n => new Array(rows).fill(0));

  serialController = new SerialController(57600);
}

function mouseClicked() { 
  // center point
  previous[mouseX][mouseY] = weight;
  // iterate over the neigbouring cells
  for(let i = 1; i <= strength; i++){
    for(let j = 1; j <= strength; j++){
      // check for cells outside of the radius
      if(i * i + j * j > strength * strength){
        continue;
      }      
      // set neighbouring cells
      previous[mouseX + i][mouseY + j] = weight;
      previous[mouseX - i][mouseY + j] = weight;
      previous[mouseX + i][mouseY - j] = weight;
      previous[mouseX - i][mouseY - j] = weight;
    }
  }
  strength = 1;
}

function mouseClicked() { 
  // center point
  
  previous[mouseX][mouseY] = weight;
  // iterate over the neigbouring cells
  for(let i = 1; i <= strength; i++){
    for(let j = 1; j <= strength; j++){
      // check for cells outside of the radius
      if(i * i + j * j > strength * strength){
        continue;
      }      
      // set neighbouring cells
      previous[mouseX + i][mouseY + j] = weight;
      previous[mouseX - i][mouseY + j] = weight;
      previous[mouseX + i][mouseY - j] = weight;
      previous[mouseX - i][mouseY - j] = weight;
    }
  }
  strength = 1;
}

function mouseDragged() { 
  // center point
  
  previous[mouseX][mouseY] = weight;
  // iterate over the neigbouring cells
  for(let i = 1; i <= strength; i++){
    for(let j = 1; j <= strength; j++){
      // check for cells outside of the radius
      if(i * i + j * j > strength * strength){
        continue;
      }      
      // set neighbouring cells
      previous[mouseX + i][mouseY + j] = weight;
      previous[mouseX - i][mouseY + j] = weight;
      previous[mouseX + i][mouseY - j] = weight;
      previous[mouseX - i][mouseY - j] = weight;
    }
  }
  strength = 2;
}

function draw() {
  // bg
  background(0);
  
  loadPixels();
  for (let i = 1; i < cols - 1; i++) {
    for (let j = 1; j < rows - 1; j++) {
      current[i][j] = ( previous[i - 1][j] +
                        previous[i + 1][j] +
                        previous[i][j - 1] +
                        previous[i][j + 1]) /
                        2 - current[i][j];
      current[i][j] = current[i][j] * dampening;

      let index = (i + j * cols) * 4;
      pixels[index + 0] = current[i][j];
      pixels[index + 1] = current[i][j];
      pixels[index + 2] = current[i][j];
           
      }
  }  
  updatePixels();

  
  let temp = previous;
  previous = current;
  current = temp;


    
  if(!started){  
    fill(255);
    textAlign(CENTER);
    textSize(80);
    textFont(fontPebble);
    text("Pebbles", width / 2, height / 2 - 100);
    textSize(40);
    textFont(fontRegular);
    text("Press any key to play", width / 2, height / 2);
    textSize(20);
    if(windowWidth > 700){
      text("Tap or hold the surface to throw a pebble", width/4, height * 0.75);
      text("Rotate to switch between pebble sizes", width* 0.75, height * 0.75);
    }
    if(windowWidth < 700){
      text("Tap or hold the surface to throw a pebble", width / 2, height * 0.75);
      text("Rotate to switch between pebble sizes", width / 2, height * 0.9);
    }    
  } 
  if(mouseIsPressed){
    strength += 0.16;
  }
}


function keyPressed(e){
  started = true;
}

function windowResized(){
  resizeCanvas(windowWidth, windowHeight);
}