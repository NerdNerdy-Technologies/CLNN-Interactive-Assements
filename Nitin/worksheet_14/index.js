import { start, end } from "../../app.js";
let startTime = start();
var width = window.innerWidth;
var height = window.innerHeight;
var totalImages = 0;
function loadImages(sources, callback) {
  var assetDir = './assets/';
  var images = {};
  var loadedImages = 0;
  var numImages = 0;
  for (var src in sources) {
    numImages++;
    totalImages++;
  }
  for (var src in sources) {
    images[src] = new Image();
    images[src].onload = function () {
      if (++loadedImages >= numImages) {
        callback(images);
      }
    };
    images[src].src = assetDir + sources[src];
  }
  //console.log("images are",images)
}


function isNearOutline(animal, outline) {
  //console.log("Animal",animal,"Outline",outline)
  var a = animal;
  var o = outline;
  var ax = a.x();
  var ay = a.y();

  // console.log("Animal is", animal, "outline is,", outline)
  if (outline == undefined) {
    return false;
  }

  if (ax > o.x - 100 && ax < o.x + 100 && ay > o.y - 100 && ay < o.y + 100) {
    return true;
  } else {
    return false;
  }
}
function drawBackground(background, beachImg, text) {
  var context = background.getContext();
  context.drawImage(beachImg, 500, 100);
  context.setAttr('font', '20pt Calibri');
  context.setAttr('textAlign', 'center');
  context.setAttr('fillStyle', 'black');
  context.fillText(text, background.getStage().width() / 2, 40);
}

function initStage(images) {
  var stage = new Konva.Stage({
    container: 'container',
    width: 1000,
    height: 800,
  });
  var background = new Konva.Layer();
  var animalLayer = new Konva.Layer();
  var animalShapes = [];
  var score = 0;

  // image positions
  var animals = {
    moontext: {
      x: 500,
      y: 50,
    },
    suntext: {
      x: 500,
      y: 100,
    },
    fishtext: {
      x: 500,
      y: 150,
    },
    walktext: {
      x: 500,
      y: 200,
    },
    cattext: {
      x: 500,
      y: 250,
    },
    dogtext: {
      x: 500,
      y: 300,
    },
  };

  var outlines = {
    walk: {
      x: 10,
      y: 50,
    },
    dog: {
      x: 250,
      y: 50,
    },
    moon: {
      x: 10,
      y: 350,
    },
    fish: {
      x: 250,
      y: 350,
    },
    walk_black: {
      x: 10,
      y: 160,
    },
    dog_black: {
      x: 250,
      y: 160,
    },
    moon_black: {
      x: 10,
      y: 460,
    },
    fish_black: {
      x: 250,
      y: 460,
    },
  };

  // create draggable animals
  for (var key in animals) {

    // anonymous function to induce scope
    (function () {
      //key will be members of animals object like; monkey, bear
      var privKey = key;
      var anim = animals[key];
      var animal = new Konva.Image({
        image: images[key],
        x: anim.x,
        y: anim.y,
        draggable: true, //to make the image draggable
        height: 35,
        width: 80,
      });

      //console.log("draggable animal list is",animal)

      animal.on('dragstart', function () {
        this.moveToTop();
      });
      /*
       * check if animal is in the right spot and
       * snap into place if it is
       */
      animal.on('dragend', function () {
        // console.log("key is", privKey)
        var outline = outlines[privKey.slice(0, -4) + '_black'];
        //console.log("inRightPlace___",animal.inRightPlace,"outline___",outline,"animal__",animal)
        if (!animal.inRightPlace && isNearOutline(animal, outline)) {
          animal.position({
            x: outline.x + 30,
            y: outline.y + 60,
          });
          animal.inRightPlace = true;
          if (++score >= 4) {
            var text = `You win! Your score is: ` + score;
            end(startTime,6);
            drawBackground(background, images.beach, text);
            //animals.destroy();
          }

          // disable drag and drop
          setTimeout(function () {
            animal.draggable(false);
          }, 50);
        } else {
          animal.position({
            x: anim.x,
            y: anim.y,
            draggable: true,
          });
        }
      });
      // make animal glow on mouseover
      /*            animal.on('mouseover', function () {
                    animal.image(images[privKey + '_glow']);
                    document.body.style.cursor = 'pointer';
                  });*/

      // return animal on mouseout
      animal.on('mouseout', function () {
        animal.image(images[privKey]);
        document.body.style.cursor = 'default';
      });

      animal.on('dragmove', function () {
        document.body.style.cursor = 'pointer';
      });

      animalLayer.add(animal);
      animalShapes.push(animal);
    })();
  }

  // create animal outlines
  for (var key in outlines) {
    // anonymous function to induce scope
    (function () {
      var imageObj = images[key];
      var out = outlines[key];

      var outline = new Konva.Image({
        image: imageObj,
        x: out.x,
        y: out.y,
        width: 150,
        height: 150,
        //stroke:"green",
        //strokeWidth:8
      });

      animalLayer.add(outline);
    })();
  }

  stage.add(background);
  stage.add(animalLayer);

  drawBackground(
    background,
    images.beach,
    'Ahoy! Put the animals on the beach!'
  );
}

var sources = {
  beach: 'candy.png',
  walk: "walk.png",
  dog: "dog.png",
  moon: "moon.png",
  fish: "fish.png",
  walktext: "walktext.png",
  moontext: "moontext.png",
  suntext: "suntext.png",
  cattext: "cattext.png",
  dogtext: "dogtext.png",
  fishtext: "fishtext.png",
  walk_black: 'square_1.png',
  dog_black: 'square_1.png',
  moon_black: 'square_1.png',
  fish_black: 'square_1.png',
};
loadImages(sources, initStage);