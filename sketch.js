let serialController;

let cols;
let rows;
let current;
let previous; 
let weight = 800;
let started = true;
let stone;
let stoneCounter = 1;
let strength = 1;
let dampening = 0.95;

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

function draw() {
  
  if(stoneCounter == 0){
    weight = 1000;
    stone = "Small";
  }
  if(stoneCounter == 1){
    weight = 2500;
    stone = "Medium";
  }
  if(stoneCounter == 2){
    weight = 5000;
    stone = "Large";
  }

  // dampening = map(serialController.read(), 0, 1023, 0.89, 0.99);
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
    text("Pebbles", width / 2, height / 2 - 100);
    textSize(40);
    text("Press c to connect", width / 2, height / 2);
  } 

  if (serialController.read() && serialController.hasData()) {
    textSize(18);
    textAlign(LEFT);
    text("Your stone size: " + stone, 10, 20);
    text("Your force: " + map(serialController.read(), 0, 1023, 0, 100), 10, 40);
    text("Rotate to calibrate force", 10, 60);
    text("Press button to switch pebbles", 10, 80);
    receivedValues = split(serialController.read(), " ");
    // show values
    fill(255);
  }

  if(mouseIsPressed){
    strength += 1/20;
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
  console.log(strength);
}
