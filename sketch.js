let serialController;

let cols;
let rows;
let current; // = new float[cols][rows];
let previous; // = new float[cols][rows];
let weight = 800;
let started = false;
let stoneCouner = 0;

let dampening = 0.7;

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
  previous[mouseX][mouseY] = weight;
}


function draw() {
  
  if(stoneCounter == 0){
    weight = 800;
  }
  if(stoneCounter == 1){
    weight = 2500;
  }
  if(stoneCounter == 0){
    weight = 5000;
  }
  
  dampening = map(force, 0, 100, 0.89, 0.99);
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

      if(!mouseIsPressed && pixels[index + 0] == 0 && pixels[index + 1] == 0 && pixels[index + 2] == 0){
        if(force > 0){
          
        }        
      }
    }
  }
  updatePixels();

  
  let temp = previous;
  previous = current;
  current = temp;


    
  if(!started){
    textSize(40);
    fill(255);
    textAlign(CENTER);
    text("Press c to connect", width / 2, height / 2);
  } 

  if (serialController.read() && serialController.hasData()) {
    textSize(18);
    textAlign(LEFT);
    text("Your stone size: " + serialController.read(), 10, 20);
    text("Your force: " + force, 10, 40);
    receivedValues = split(serialController.read(), " ");
    // show values
    fill(255);
  }
  
}

function initSerial() {
  serialController.init();
  started = true;
}

function keyPressed(e){
  if(key == "c"){
    initSerial();
  }    
  else{
    force = 0;
  }
}
