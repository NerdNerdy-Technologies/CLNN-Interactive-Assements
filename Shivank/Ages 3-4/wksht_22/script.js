var width = window.innerWidth;
var height = window.innerHeight;
var totalImages = 0;
function loadImages(sources, callback) {
  var assetDir = "/Shivank/Ages 3-4/assets/images/22/";
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

  if (ax > o.x - 100 && ax < o.x + 200 && ay > o.y - 100 && ay < o.y + 200) {
    return true;
  } else {
    return false;
  }
}
// function drawBackground(background, beachImg, text) {
//   var context = background.getContext();
//   context.drawImage(beachImg, 0, 0);
//   context.setAttr("font", "20pt Calibri");
//   context.setAttr("textAlign", "center");
//   context.setAttr("fillStyle", "black");
//   context.fillText(text, background.getStage().width() / 2, 40);
// }

function initStage(images) {
  var stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height,
  });
  var background = new Konva.Layer();
  var animalLayer = new Konva.Layer();
  var animalShapes = [];
  var score = 0;

  // image positions

  var animals = {
    one_3_black: {
      x: 1200,
      y: 500,
    },
    two_1_black: {
      x: 1200,
      y: 500,
    },
    three_1_black: {
      x: 1200,
      y: 500,
    },
  };

  var outlines = {
    one_1: {
      x: 300,
      y: 30,
    },
    one_2: {
      x: 600,
      y: 30,
    },
    one_3: {
      x: 900,
      y: 30,
    },
    two_1: {
      x: 300,
      y: 250,
    },
    two_2: {
      x: 600,
      y: 250,
    },
    two_3: {
      x: 900,
      y: 250,
    },
    three_1: {
      x: 300,
      y: 470,
    },
    three_2: {
      x: 600,
      y: 470,
    },
    three_3: {
      x: 900,
      y: 470,
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
        height: 200,
        width: 200,
      });

      //console.log("draggable animal list is",animal)

      animal.on("dragstart", function () {
        this.moveToTop();
      });
      /*
       * check if animal is in the right spot and
       * snap into place if it is
       */
      animal.on("dragend", function () {
        var outline = outlines[privKey.slice(0, -6)];
        //console.log("inRightPlace___",animal.inRightPlace,"outline___",outline,"animal__",animal)
        if (!animal.inRightPlace && isNearOutline(animal, outline)) {
          animal.position({
            x: outline.x,
            y: outline.y,
          });
          animal.inRightPlace = true;
          if (++score >= 4) {
            var text = `You win! Your score is: ` + score;
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

      // return animal on mouseout
      animal.on("mouseout", function () {
        animal.image(images[privKey]);
        document.body.style.cursor = "default";
      });

      animal.on("dragmove", function () {
        document.body.style.cursor = "pointer";
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
        width: 200,
        height: 200,
        //stroke:"green",
        //strokeWidth:8
      });

      animalLayer.add(outline);
    })();
  }

  stage.add(background);
  stage.add(animalLayer);
}

var sources = {
  one_1: "1-1.png",
  one_2: "1-2.png",
  one_3: "1-3.png",
  two_1: "2-1.png",
  two_2: "2-2.png",
  two_3: "2-3.png",
  three_1: "3-1.png",
  three_2: "3-2.png",
  three_3: "3-3.png",
  one_3_black: "dry-clean.png",
  two_1_black: "dry-clean.png",
  three_1_black: "dry-clean.png",
};
loadImages(sources, initStage);
