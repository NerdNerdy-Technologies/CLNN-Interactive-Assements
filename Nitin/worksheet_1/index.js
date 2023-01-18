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
}
function isNearOutline(animal, outline) {
  var a = animal;
  var o = outline;
  var ax = a.x();
  var ay = a.y();

  if (outline == undefined) {
    return false;
  }

  if (ax > o.x - 100 && ax < o.x + 200 && ay > o.y - 100 && ay < o.y + 200) {
    return true;
  } else {
    return false;
  }
}
function drawBackground(background, beachImg, text) {
  var context = background.getContext();
  context.drawImage(beachImg, 0, 0);
  context.setAttr('font', '20pt Calibri');
  context.setAttr('textAlign', 'center');
  context.setAttr('fillStyle', 'black');
  context.fillText(text, background.getStage().width() / 2, 40);
}

function initStage(images) {
  var stage = new Konva.Stage({
    container: 'container',
    width: 2000,
    height: 800,
  });
  var background = new Konva.Layer();
  var animalLayer = new Konva.Layer();
  var animalShapes = [];
  var score = 0;

  // image positions
  var animals = {
    one: {
      x: 10,
      y: 50,
    },
    eight: {
      x: 10,
      y: 200,
    },
    seventysix: {
      x: 10,
      y: 350,
    },
    five: {
      x: 400,
      y: 50,
    },
    nineteen: {
      x: 400,
      y: 200,
    },
    ninetyfive: {
      x: 400,
      y: 350,
    },
  };

  var outlines = {
    five_black: {
      x: 200,
      y: 50,
    },
    nineteen_black: {
      x: 200,
      y: 200,
    },
    ninetyfive_black: {
      x: 200,
      y: 350,
    },
  };
  for (var key in animals) {
    (function () {
      var privKey = key;
      var anim = animals[key];
      var animal = new Konva.Image({
        image: images[key],
        x: anim.x,
        y: anim.y,
        draggable: true, 
        height: 80,
        width: 80,
      });


      animal.on('dragstart', function () {
        this.moveToTop();
      });
      animal.on('dragend', function () {
        var outline = outlines[privKey + '_black'];
        if (!animal.inRightPlace && isNearOutline(animal, outline)) {
          animal.position({
            x: outline.x,
            y: outline.y,
          });
          animal.inRightPlace = true;
          if (++score >= 3) {
            var text = `You win! Your score is: ` + score;
            end(startTime,3);
            drawBackground(background, images.beach, text);
          }
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
  for (var key in outlines) {
    (function () {
      var imageObj = images[key];
      var out = outlines[key];

      var outline = new Konva.Image({
        image: imageObj,
        x: out.x,
        y: out.y,
        width: 100,
        height: 100,
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
  beach: 'beach.jpg',
  one: "one.png",
  five: "five.png",
  eight: "eight.png",
  nineteen: "nineteen.png",
  seventysix: "seventysix.png",
  ninetyfive: "ninetyfive.png",
  five_black: 'square_1.png',
  nineteen_black: 'square_2.png',
  ninetyfive_black: 'square_3.png',
};
loadImages(sources, initStage);