function preload(){
    /* put stuff that need to be loaded before the canvas gets rendered here */
}

function setup(){
    /* put stuff that need to be setup before the draw loop here */
    createCanvas(400, 400);
}

function draw(){
    /* put stuff that need to be drawn here animaton happens here */
    background(0);
    fill(255);
    ellipse(mouseX, mouseY, 50, 50);
}