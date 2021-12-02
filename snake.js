//-cambio sfondo quando prendi la moneta
//-descrizione comandi ed elementi a destra

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}
let frame = 0;
let moneta = true;
let wait = 100;
let boost = false;
let scorriPancia=0;
let mod=true;

const SPMAX = 12, SPMIN = 7;
let speed = SPMIN; //velocità gioco

let tileCount = 20;
let tileSize = canvas.width/tileCount-4; //dimensione
let hX = 10; // posizione testa x
let hY = 10; // posizione testa y
let aX = Math.floor(Math.random() * tileCount);
let aY = Math.floor(Math.random() * tileCount);
const snakeParts = [];
let tailDim = 2;

let vX=0;
let vY=0;

let cX = Math.floor(Math.random() * tileCount);
let cY = Math.floor(Math.random() * tileCount);

let eX,eY;

let score = 0;

const eatSound = new Audio("appleEatingSound.wav")
const boostSound = new Audio("boostSound.wav")
const boostMusic = new Audio("boostMusic.mp3")

let newMove=true;
let end=false;

document.getElementById("stMod").value = "Impatto con Muri";

//game loop
function drawG(){
  //namePlayer = document.getElementById("username").value;
  if(!end) moveSnake();

  if(!mod){
     if(hX < 0 && !mod) {
      hX=tileCount-1;
     }

     if(hY < 0 && !mod) {
      hY=tileCount-1;
     }

     if(hX >= tileCount && !mod) {
      hX=0;
     }

     if(hY >= tileCount && !mod) {
      hY=0;
     }
  }
  if(gameOver()){
    ctx.fillStyle = "white";
    ctx.font = "50px Verdana";
    ctx.fillText("Game Over!", canvas.width / 8, canvas.height / 2);
    boostMusic.pause();
    boostMusic.currentTime = 0;
    return;
  }
  if(!end){
  clScreen();
  drawSnake();
  collisionApple();
  drawApple();
  collisionCoin();
  drawCoin();
  drawScore();
  eX=hX;
  eY=hY;
  setTimeout(drawG,1000/speed);
  newMove=true;
}
}

function modalita() {
    if(!mod && vX==0 && vY==0) {
      document.getElementById("stMod").value = "Impatto con Muri";
      mod=true;
      return;
    }
    else if(vX==0 && vY==0){
      document.getElementById("stMod").value = "Effetto Pac-Man";
      mod=false;
      return;
  }
}

function gameOver(){
  if(vY===0 && vX===0) {return false;}

  else if((hX < 0 || hX >= tileCount || hY < 0 || hY >= tileCount) && mod) {
    end=true;
    ctx.fillStyle = "#ff0000";
    ctx.fillRect(eX * tileCount, eY * tileCount, tileSize+2, tileSize+2);
    setTimeout(() => {
    ctx.fillStyle = "#bef059";
    ctx.fillRect(eX * tileCount, eY * tileCount, tileSize+2, tileSize+2);},500);
    return true;}

  for (let i = 0; i < snakeParts.length; i++) {
    if( snakeParts[i].x === hX && snakeParts[i].y === hY) {
      end=true;
        ctx.fillStyle = "#ff0000";
        ctx.fillRect(1+snakeParts[i].x * tileCount, 1+snakeParts[i] .y * tileCount, tileSize, tileSize);
        setTimeout(() => {
        ctx.fillStyle = "green";
        ctx.fillRect(1+snakeParts[i].x * tileCount, 1+snakeParts[i] .y * tileCount, tileSize, tileSize); }, 500);
      return true;
    }
  }
}

function drawScore() {
  ctx.fillStyle = "white";
  ctx.font = "10px Verdana";
  ctx.fillText("Score: "+ score,canvas.width-50, 10);
}

function clScreen(){
  ctx.fillStyle = 'black';
  ctx.fillRect(0,0,canvas.width,canvas.height);
}
function drawSnake(){

  for (let i = 0; i < snakeParts.length; i++) {
    if(i%2==0){ctx.fillStyle = "green";}
    else{ctx.fillStyle = '#0b5b0d';}
    let part = snakeParts[i];
    if(i==scorriPancia){
      ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize+2, tileSize+2);
    }
    else ctx.fillRect(1+part.x * tileCount, 1+part.y * tileCount, tileSize, tileSize);
  }
  scorriPancia--;
  if(scorriPancia>1){
  let part = snakeParts[scorriPancia];
  ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize+3, tileSize+3);
  scorriPancia--;
 }

  snakeParts.push(new SnakePart(hX, hY)); //put an item at the end of the list next to the head
  while (snakeParts.length > tailDim) {
    snakeParts.shift(); // remove the furthet item from the snake parts if have more than our tail size.
  }

    ctx.fillStyle = "#bef059";
    ctx.fillRect(hX * tileCount,hY * tileCount,tileSize+2,tileSize+2);
    ctx.fillStyle = "white";
    ctx.font = "10px Verdana";
    ctx.fillText("Prova",hX * tileCount,hY * tileCount);
}

function moveSnake(){
  if(boost) speed=SPMAX;
  else speed=SPMIN;

  hX = hX + vX;
  hY = hY + vY;
}

function drawApple(){
ctx.beginPath();
ctx.fillStyle="#989015";
ctx.fillRect((aX*tileCount)+(tileSize+2)/2 -2.5, (aY*tileCount)+(tileSize+2)/2 -20, 5, 20);

  ctx.fillStyle = "#dd0707";
  ctx.beginPath();
  ctx.arc((aX*tileCount)+(tileSize+2)/2, (aY*tileCount)+(tileSize+2)/2, (tileSize+2)/2, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#c80101';
  ctx.stroke();
}

function collisionApple(){
    let noPos,rX,rY;
    if(aX == hX && aY == hY){
      scorriPancia=tailDim;
      eatSound.pause();
      eatSound.currentTime = 0;
      do{
        noPos=false;
        rX=Math.floor(Math.random() * tileCount);
        rY=Math.floor(Math.random() * tileCount);
        for (let i = 0; i < snakeParts.length && !noPos; i++) {
          if( snakeParts[i].x === rX && snakeParts[i].y === rY)
            noPos=true;
        }
      }
      while(noPos);
    aX = rX;
    aY = rY;
    tailDim++;
    score+=1;
    if(boost) score++;
    eatSound.play();
  }
}
function drawCoin(){
  if(frame==25) moneta=false;
  if(!moneta){
    cX=-1;
    cY=-1;
    frame--;
    if(frame==-40){
        boostMusic.pause();
        boostMusic.currentTime = 0;
        boost=false;
      }
    if(frame==-wait) {
      cX = Math.floor(Math.random() * tileCount);
      cY = Math.floor(Math.random() * tileCount);
      frame=0;
      moneta=true;
    }
    return;
  }
  if(moneta){
    frame++;
  ctx.fillStyle = "yellow";
  ctx.beginPath();
  ctx.arc((cX*tileCount)+(tileSize+2)/2, (cY*tileCount)+(tileSize+2)/2, (tileSize+2)/2, 0, 2 * Math.PI, false);
  ctx.fill();
  ctx.lineWidth = 5;
  ctx.strokeStyle = '#e8c118';
  ctx.stroke();
  }

}
function collisionCoin(){
  if(cX == hX && cY == hY && !boost){
    moneta = false;
    boost = true;
    boostSound.play();
    boostMusic.play();
  }
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event){
  if(newMove){
  //up /*event.keyCode == 87 ||*/
  if(( event.keyCode == 38) && vY!=1){
    vY = -1;
    vX = 0;
    newMove=false;
  }
  //down /*event.keyCode == 83 ||*/
  if(( event.keyCode == 40) && vY!=-1){
    vY = 1;
    vX = 0;
    newMove=false;
  }
  //left /*event.keyCode == 65 ||*/
  if(( event.keyCode == 37) && vX!=1){
    vY = 0;
    vX = -1;
    newMove=false;
  }
  //right /*event.keyCode == 68 ||*/
  if(( event.keyCode == 39) && vX!=-1){
    vY = 0;
    vX = 1;
    newMove=false;
  }
}
if((event.keyCode == 32) && end){
  history.go(0);
}
}

drawG();
