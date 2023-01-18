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

  if (outline == undefined) {
    return false;
  }

  if (ax > o.x - 100 && ax < o.x + 100 && ay > o.y - 500 && ay < o.y + 100) {
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
      y: 50,
    },
    fruit2: {
      x: 0,
      y: 250,
    },
    fruit3: {
      x: 0,
      y: 450,
    },
    fruit5: {
      x: 250,
      y: 100,
    },
    fruit4: {
      x: 250,
      y: 350,
    },
  };

  var outlines = {
    fruit_basket: {
      x: 550,
      y: 300,
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
        width: 150,
        height: 150,
        draggable: true, //to make the image draggable
      });



      animal.on('dragstart', function () {
        this.moveToTop();
      });

      /*
       * check if animal is in the right spot and
       * snap into place if it is
       */
      var add = 0;
      animal.on('dragend', function () {
        var outline = outlines[privKey.slice(0, -1) + '_basket'];
        if (!animal.inRightPlace && isNearOutline(animal, outline)) {


          animal.position({
            x: outline.x - 5,
            y: outline.y - 60,
          });
          if (privKey == "fruit5") {
            animal.position({
              x: outline.x - 1,
              y: outline.y - 170,
            });
          }
          /*                if(score==0){
                            add=add-10;
                          }*/

          console.log("Score is ", score)
          animal.inRightPlace = true;
          if (++score >= 2) {
            var text = `You win! Your score is: ` + score;
            end(startTime,5);
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
        width: 150,
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
  fruit1: "2-2.png",
  fruit2: "ice4.png",
  fruit3: "2-1.png",
  fruit4: "1-1.png",
  fruit5: "cherry22.png",
  veg1: "bellpepper.png",
  veg2: "carrot.png",
  veg3: "eggplant.png",
  veg4: "broccoli.png",
  veg5: "garlics.png",
  fruit_basket: "1-2.png",
};
loadImages(sources, initStage);