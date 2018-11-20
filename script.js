window.onload = function() {
  var plasticPieces = []; //array to store all pieces of plastic
  var corals = [];
  var frame = 0; //variable to count the frames
  var images = [
    "./images/plastic1.png",
    "./images/plastic2.png",
    "./images/plastic3.png"
  ];
  var imageDiver = "";

  function selectDiver() {
    if (document.getElementById("#diver1").checked) {
      imageDiver = "images/diver1.png";
    } else {
      imageDiver = "images/diver3.png";
    }
  }

  //variable with all info on the canvas
  var myGameArea = {
    canvas: document.createElement("canvas"),
    start: function() {
      this.canvas.width = 1000;
      this.canvas.height = 500;
      this.context = this.canvas.getContext("2d");
      document.body.insertBefore(this.canvas, document.body.childNodes[0]);
      //create diver and first piece of plastic
      selectDiver();
      diver = new Component(imageDiver, 0, 200, 200, 100);
      plastic = new Component("./images/plastic1.png", 1000, 200, 100, 50);
      plasticPieces.push(plastic);
    },
    clear: function() {
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    score: 0
  };

  //class to create new components - diver and pieces of plastic
  class Component {
    constructor(image, x, y, width, height) {
      this.image = image;
      this.width = width;
      this.height = height;
      this.x = x;
      this.y = y;
    }

    //update the canvas and draw image
    update() {
      // console.log(this.speedY);
      var ctx = myGameArea.context;
      var img = new Image();
      img.src = this.image;
      ctx.drawImage(img, this.x, this.y, this.width, this.height);
    }
  }

  //functions to get random plastic positions, plastic images and gaps between pieces of plastic
  function randomY() {
    return Math.floor(
      Math.floor(Math.random() * (myGameArea.canvas.height - 120))
    );
  }

  function randomPicture() {
    var randomIndex = Math.floor(Math.floor(Math.random() * images.length));
    return images[randomIndex];
  }

  function randomGap() {
    var max = 300;
    var min = 100;
    return Math.floor(Math.random() * (max - min)) + min;
  }

  //check, if the target is hit
  function intersect(rect1, rect2) {
    rect1left = rect1.x;
    rect1top = rect1.y;
    rect1right = rect1.x + rect1.width;
    rect1bottom = rect1.y + rect1.height;

    rect2left = rect2.x;
    rect2top = rect2.y;
    rect2right = rect2.x + rect2.width;
    rect2bottom = rect2.y + rect2.height;

    return !(
      rect1left > rect2right ||
      rect1right < rect2left ||
      rect1top > rect2bottom ||
      rect1bottom < rect2top
    );
  }

  //draw score in the upper right corner
  function writeScore(score) {
    var diverName = $("input").val();
    var ctx = myGameArea.context;
    ctx.font = "40px Raleway";
    ctx.fillText("Collected by " + diverName + ": " + score, 50, 50);
  }

  //updating the canvas (clearing and updating)
  function updateGameArea() {
    frame++;
    myGameArea.clear();
    //always update diver and elements of plastic array
    diver.update();
    plasticPieces.forEach(function(plastic) {
      // console.log("newplastic");
      // console.log(plasticPieces);
      plastic.x -= 2;
      plastic.update();
    });
    corals.forEach(function(coral) {
      // console.log("newplastic");
      // console.log(plasticPieces);
      coral.x -= 2;
      coral.update();
    });
    //if random frame is reached, add new piece of plastic
    if (frame % 120 === 0 && plasticPieces[plasticPieces.length - 1].y < 700) {
      plasticPieces.push(
        new Component(randomPicture(), 1000, randomY(), 100, 50)
      );
    }
    if (frame % 150 === 0 && plasticPieces[plasticPieces.length - 1].y < 700) {
      corals.push(new Component("./images/coral.png", 1000, randomY(), 70, 70));
    }
    //check, if diver and plastic collide
    plasticPieces.forEach(function(plastic) {
      if (
        intersect(
          { x: diver.x, y: diver.y, width: diver.width, height: diver.height },
          {
            x: plastic.x,
            y: plastic.y,
            width: plastic.width,
            height: plastic.height
          }
        )
      ) {
        // console.log("collide");
        //if they collide, increase score and move plastic out of the screen
        myGameArea.score++;
        plastic.x -= 1000;
      }
    });
    //check, if diver and corals collide
    corals.forEach(function(coral) {
      if (
        intersect(
          { x: diver.x, y: diver.y, width: diver.width, height: diver.height },
          {
            x: coral.x,
            y: coral.y,
            width: coral.width,
            height: coral.height
          }
        )
      ) {
        // console.log("collide");
        //if they collide, increase score and move plastic out of the screen
        alert("Game over!");
        plasticPieces = [];
        corals = [];
        myGameArea.start();
      }
    });
    //updating score
    writeScore(myGameArea.score);
    //increasing frame by one
    // console.log(frame);
    window.requestAnimationFrame(updateGameArea);
  }

  //control the diver
  document.onkeydown = function(event) {
    var key = event.keyCode;
    if (key === 38 && diver.y > 0) {
      // console.log("moving up");
      diver.y -= 5;
    } else if (
      key === 40 &&
      diver.y < myGameArea.canvas.height - diver.height
    ) {
      diver.y += 5;
    }
  };

  $("#welcome-button").click(function() {
    $("#welcome-button")
      .parent()
      .hide();
    $("#enter-name-button")
      .parent()
      .show();
  });

  $("#enter-name-button").click(function() {
    $("#enter-name-button")
      .parent()
      .hide();
    $("#welcome-button")
      .parent()
      .hide();
    $("#start-game-button")
      .parent()
      .show();
  });

  $("#start-game-button").click(function() {
    $("#start-game-button")
      .parent()
      .parent()
      .hide();
    //drawing the canvas - starting the game
    myGameArea.start();
    //clear and redraw (and repeat)
    updateGameArea();
  });
};
