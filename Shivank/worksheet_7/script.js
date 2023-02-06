import { start, end } from "../../app.js";
let startTime = start();
let width = window.innerWidth;
let height = window.innerHeight;
let totalImages = 0;
function loadImages(sources, callback) {
  let assetDir = "./assets/images/";
  let images = {};
  let loadedImages = 0;
  let numImages = 0;
  for (let src in sources) {
    numImages++;
    totalImages++;
  }
  for (let src in sources) {
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
  let a = animal;
  let o = outline;
  let ax = a.x();
  let ay = a.y();
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
//   let context = background.getContext();
//   context.drawImage(beachImg, 0, 0);
//   context.setAttr("font", "20pt Calibri");
//   context.setAttr("textAlign", "center");
//   context.setAttr("fillStyle", "black");
//   context.fillText(text, background.getStage().width() / 2, 40);
// }

function initStage(images) {
  let stage = new Konva.Stage({
    container: "container",
    width: width,
    height: height,
  });
  let background = new Konva.Layer();
  let animalLayer = new Konva.Layer();
  let animalShapes = [];
  let score = 0;

  // image positions

  let animals = {
    one_3_black: {
      x: 0,
      y: 470,
    },
    two_1_black: {
      x: 0,
      y: 470,
    },
    one_2_black: {
      x: 200,
      y: 470,
    },
    two_2_black: {
      x: 200,
      y: 470,
    },
    one_1_black: {
      x: 400,
      y: 470,
    },
    two_3_black: {
      x: 400,
      y: 470,
    },
  };

  let outlines = {
    one_1: {
      x: 0,
      y: 30,
    },
    one_2: {
      x: 200,
      y: 30,
    },
    one_3: {
      x: 400,
      y: 30,
    },
    two_1: {
      x: 0,
      y: 250,
    },
    two_2: {
      x: 200,
      y: 250,
    },
    two_3: {
      x: 400,
      y: 250,
    },
  };

  // create draggable animals
  for (let key in animals) {
    // anonymous function to induce scope
    (function () {
      //key will be members of animals object like; monkey, bear
      let privKey = key;
      let anim = animals[key];
      let animal = new Konva.Image({
        image: images[key],
        x: anim.x,
        y: anim.y,
        draggable: true, //to make the image draggable
        height: 150,
        width: 150,
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
        let outline = outlines[privKey.slice(0, -6)];
        //console.log("inRightPlace___",animal.inRightPlace,"outline___",outline,"animal__",animal)
        if (!animal.inRightPlace && isNearOutline(animal, outline)) {
          animal.position({
            x: outline.x,
            y: outline.y,
          });
          animal.inRightPlace = true;
          if (++score >= 6) {
            let text = `You win! Your score is: ` + score;
            end(startTime,6);
            // drawBackground(background, images.beach, text);
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
  for (let key in outlines) {
    // anonymous function to induce scope
    (function () {
      let imageObj = images[key];
      let out = outlines[key];

      let outline = new Konva.Image({
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

let sources = {
  one_1: "1-1.png",
  one_2: "1-2.png",
  one_3: "1-3.png",
  two_1: "2-1.png",
  two_2: "2-2.png",
  two_3: "2-3.png",
  one_3_black: "1.png",
  two_1_black: "1.png",
  one_2_black: "2.png",
  two_2_black: "2.png",
  one_1_black: "3.png",
  two_3_black: "3.png",
};
loadImages(sources, initStage);
