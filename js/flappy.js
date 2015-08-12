// the Game object used by the phaser.io library
var stateActions = { preload: preload, create: create, update: update };

// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var score;
score = 0;
//score = 1;
//score = 2;
var labelScore;
var pipes = [];
var player;
var first;
/*
 * Loads all resources for the game and gives them names.
 */

jQuery("#greeting-form").on("submit", function(event_details) {
    var greeting = "Hello ";
    var name = jQuery("#fullName").val();
    var greeting_message = greeting + name;
    jQuery("#greeting-form").hide();
    jQuery("#greeting").append("<p>" + greeting_message + "</p>");
    //event_details.preventDefault();
});

function preload(){
    game.load.image("playerImg", "../assets/flappy_superman.png");
    game.load.image("backgroundImg","../assets/space.jpg");
game.load.audio("score","../assets/point.ogg");
    game.load.image("pipe","../assets/moon2.png");

}

/*
 * Initialises the game. This function is only called once.
 */
function create() {
    game.stage.setBackgroundColor("FFFF00");
    game.add.image(0, 0, "backgroundImg");
    var background = game.add.image(0, 0, "backgroundImg");
    background.width = 790;
    game.add.text(20, 20, "Superman",
        {font: "35px Impact", fill: "#33C6EB"});
    // set the background colour of the scene

    game.input
        .onDown
        .add(clickHandler);
    game.input
        .keyboard.addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(spaceHandler);
    labelScore = game.add.text(650, 30, "0", {fill: "#33C6EB"});
    game.input.keyboard.addKey(Phaser.Keyboard.RIGHT)
        .onDown.add(moveRight);
    game.input.keyboard.addKey(Phaser.Keyboard.LEFT)
        .onDown.add(moveLeft);
    game.input.keyboard.addKey(Phaser.Keyboard.UP)
        .onDown.add(moveUp);
    game.input.keyboard.addKey(Phaser.Keyboard.DOWN)
        .onDown.add(moveDown);
    game.input.keyboard
        .addKey(Phaser.Keyboard.SPACEBAR)
        .onDown.add(playerJump);

    player = game.add.sprite(80, 200, "playerImg");
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.velocity.x = 0;
    player.body.gravity.y = 300
    ;
    player.anchor.setTo(0.5, 0.5);
    first=0;
    generatePipe();
    first=1;
    var pipeInterval = 4;
    game.time.events
        .loop(pipeInterval * Phaser.Timer.SECOND,
            generatePipe);

}


function generatePipe() {
    var gap = game.rnd.integerInRange(1 ,5);
    for (var count = 0; count < 8; count++) {
        if (count != gap && count != gap+1 && count != gap+2) {
            addPipeBlock(750, count * 50);

        }
    }

    if(first>0) {
        changeScore();
    }
}

function clickHandler(event){
    game.add.sprite(event.x,event.y,"playerImg");
}
function spaceHandler() {
    game.sound.play("score");
}
function changeScore() {
    score = score + 1;
    labelScore.setText(score.toString());

}
function moveRight() {
    player.x = player.x + 50
}
function moveLeft() {
    player.x = player.x - 50
}
function moveUp() {
    player.body.velocity.y = -200;
}
function moveDown() {
    player.y = player.y + 50
}
function addPipeBlock(x, y) {
        var pipeBlock = game.add.sprite(x,y,"pipe");
        pipes.push(pipeBlock);
        game.physics.arcade.enable(pipeBlock);
        pipeBlock.body.velocity.x = -200;
    }
function playerJump() {
    player.body.velocity.y = -200;
}
    /* This function updates the scene. It is called for every new frame.
    */

function update() {
        for(var index=0; index<pipes.length; index++){
            game.physics.arcade
                .overlap(player,
            pipes[index],
            gameOver);
        }
    if(player.y > 400){
        gameOver()
    }
    player.rotation += 1;
    player.rotation = Math.atan(player.body.velocity.y / 200);
}
function gameOver() {
    game.destroy(); }
$.get("/score", function(scores){
    for (var i = 0; i < scores.length; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});
if(isEmpty(fullName)) {
    response.send("Please make sure you enter your name.");
}