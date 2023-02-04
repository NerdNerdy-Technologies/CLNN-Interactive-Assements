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

  if (ax > o.x - 100 && ax < o.x + 300 && ay > o.y - 100 && ay < o.y + 300) {
    return true;
  } else {
    return false;
  }
}
function drawBackground(background, beachImg, text) {
  var context = background.getContext();
  //context.drawImage(beachImg, 0, 0);
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
    fruit1: {
      x: 0,
      y: 10,
    },
    fruit2: {
      x: 0,
      y: 120,
    },
    fruit3: {
      x: 0,
      y: 240,
    },
    fruit4: {
      x: 0,
      y: 360,
    },
    fruit5: {
      x: 0,
      y: 500,
    },
    veg1: {
      x: 100,
      y: 10,
    },
    veg2: {
      x: 100,
      y: 120,
    },
    veg3: {
      x: 100,
      y: 240,
    },
    veg4: {
      x: 100,
      y: 360,
    },
    veg5: {
      x: 100,
      y: 500,
    },
  };

  var outlines = {
    veg_basket: {
      x: 220,
      y: 50,
    },
    fruit_basket: {
      x: 220,
      y: 350,
    },
  };

  var add = 50;
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
        width: 110,
        height: 110,
        draggable: true, //to make the image draggable
      });


      animal.on('dragstart', function () {
        this.moveToTop();
      });

      animal.on('mouseover', function () {
        this.opacity(1);
      });

      animal.on('mouseout', function () {
        this.opacity(0.8);
      });
      /*
       * check if animal is in the right spot and
       * snap into place if it is
       */

      animal.on('dragend', function () {
        var outline = outlines[privKey.slice(0, -1) + '_basket'];
        // console.log("inRightPlace___", animal.inRightPlace, "outline___", outline, "animal__", animal)
        if (!animal.inRightPlace && isNearOutline(animal, outline)) {
          animal.position({
            x: outline.x + add,
            y: outline.y + 50,
          });
          add = add + 20;
          if (score == 5) {
            add = add - 100;
          }

          animal.inRightPlace = true;
          if (++score >= 10) {
            var text = `You win! Your score is: ` + score;
            end(startTime,10);
            drawBackground(background, images.beach, text);
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
        width: 380,
        height: 300,
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
  beach: 'beach.png',
  fruit1: "mango.png",
  fruit2: "grapes.png",
  fruit3: "apple.png",
  fruit4: "strawberry.png",
  fruit5: "banana.png",
  veg1: "bellpepper.png",
  veg2: "carrot.png",
  veg3: "eggplant.png",
  veg4: "broccoli2.png",
  veg5: "garlics.png",
  fruit_basket: "basket_fruit1.png",
  veg_basket: "basket_veg1.png"
};
loadImages(sources, initStage);