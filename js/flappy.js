// the Game object used by the phaser.io library

var score = -3;
var player;
var labelScore;
var stateActions = {preload: preload, create: create, update: update};
// Phaser parameters:
// - game width
// - game height
// - renderer (go for Phaser.AUTO)
// - element where the game will be drawn ('game')
// - actions on the game state (or null for nothing)
var game = new Phaser.Game(790, 400, Phaser.AUTO, 'game', stateActions);
var pipes = [];

$("#greeting-form").on("submit", function (event_details) {
    var name = $("#fullName").val();
    var email = $("#email").val();
    var score = $("#score").val();
    var greeting_message = "Congratulations, " + name + " (" + email + "), your score is " + score + "!";
    $("#greeting-form").hide();
    $("#greeting").append("<p>" + greeting_message + "</p>");
});


function preload() {
    game.load.image("playerImg", "../assets/flappy_frog.png");
    game.load.audio("score", "../assets/point.ogg");
    game.load.image("lilypad", "../assets/lilypad3.png");
    game.load.image("water", "../assets/water2.png");
}
/*
 * Initialises the game. This function is only called once.
 */



function create() {
    var background = game.add.image(0, 0, "water");
    background.width = 790;
    background.height = 400;
    game.stage.setBackgroundColor("#00CCFF");
    // set the background colour of the scene
    game.add.text(285, 20, "Bouncy frog",
        {font: "30px Verdana", fill: "#ffffff"});

    splashDisplay = game.add.text(200,150, "Press ENTER to start, SPACEBAR to jump",
        {font: "18px Verdana", fill: "#ffffff"});

    game.add.sprite(20, 20, "playerImg");
    game.add.sprite(20, 350, "playerImg");
    game.add.sprite(720, 20, "playerImg");
    game.add.sprite(720, 350, "playerImg");

    labelScore = game.add.text(100, 20, "0", {font: "30px Verdana", fill: "#ffffff"});
    player = game.add.sprite(80, 100, "playerImg");
    player.anchor.setTo(0.5, 0.5);

    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.enable(player);
    player.body.velocity.x = 0;

    game.input.keyboard
        .addKey(Phaser.Keyboard.ENTER)
        .onDown.add(start);

}

 function start () {

     splashDisplay.destroy();

     game.input.keyboard
         .addKey(Phaser.Keyboard.ENTER)
         .onDown.remove(start);

    playerJump ();
     player.body.gravity.y = 600;

     game.input.keyboard
         .addKey(Phaser.Keyboard.SPACEBAR)
         .onDown.add(playerJump);

     var pipeInterval = 1.5;
     game.time.events
         .loop(pipeInterval * Phaser.Timer.SECOND,
         generatePipe);
 }

/*
 * This function updates the scene. It is called for every new frame.
 */
function changeScore() {
    score = score + 1;

    if (score > 0) {
        labelScore.setText(score.toString());
        game.sound.play("score");
    }
}

function addPipeBlock(x, y) {
    var pipeBlock = game.add.sprite(x, y, "lilypad");
    pipes.push(pipeBlock);
    game.physics.arcade.enable(pipeBlock);
    pipeBlock.body.velocity.x = -150;
}

function generatePipe() {
    var gap = game.rnd.integerInRange(1, 5);
    for (var count = 0; count < 8; count++) {
        if (count != gap && count != gap + 1) {
            addPipeBlock(750, count * 50);
        }
    }
    changeScore();
}
function playerJump() {
    player.body.velocity.y = -230;
}

function update() {
    player.rotation = Math.atan(player.body.velocity.y / 200);
    game.physics.arcade
        .overlap(player,
        pipes,
        gameOver);
    if (player.body.y < 0 || player.body.y > 400) {
        game.add.text(200,150, "Game Over",
            {font: "18px Verdana", fill: "#ffffff"});
        gameOver();

    }
}

function gameOver() {
    game.destroy();
    $("#score").val(score.toString());
    $("#greeting").show();
}

$.get("/score", function(scores){
    scores.sort(function (scoreA, scoreB){
        var difference = scoreB.score - scoreA.score;
        return difference;
    });
    for (var i = 0; i < 5; i++) {
        $("#scoreBoard").append(
            "<li>" +
            scores[i].name + ": " + scores[i].score +
            "</li>");
    }
});