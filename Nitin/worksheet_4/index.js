  var width = window.innerWidth;
  var height = window.innerHeight;
  var totalImages=0;
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

        console.log("Animal is",animal,"outline is,",outline)
        if(outline==undefined){
          return false;
        }

        if (ax > o.x - 20 && ax < o.x + 100 && ay > o.y - 20 && ay < o.y + 20) {
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
          morningtext: {
            x: 400,
            y: 350,
          },
          noontext: {
            x: 400,
            y: 50,
          },
          nighttext: {
            x: 400,
            y: 200,
          },
        };

        var outlines = {
          morning: {
            x: 10,
            y: 50,
          },
          noon: {
            x: 10,
            y: 200,
          },
          night: {
            x: 10,
            y: 350,
          },
          morning_black: {
            x: 200,
            y: 50,
          },
          noon_black: {
            x: 200,
            y: 200,
          },
          night_black: {
            x: 200,
            y: 350,
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
              height:80,
              width:80,
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
              console.log("key is",privKey)
              var outline = outlines[privKey.slice(0,-4) + '_black'];
              //console.log("inRightPlace___",animal.inRightPlace,"outline___",outline,"animal__",animal)
              if (!animal.inRightPlace && isNearOutline(animal, outline)) {
                animal.position({
                  x: outline.x+30,
                  y: outline.y+10,
                });
                animal.inRightPlace = true;
                if (++score >= 3) {
                  var text = `You win! Your score is: `+score;
                  drawBackground(background, images.beach, text);
                  //animals.destroy();
                }

                // disable drag and drop
                setTimeout(function () {
                  animal.draggable(false);
                }, 50);
              }else{
                  animal.position({
                  x: anim.x,
                  y: anim.y,
                  draggable:true,
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
              width:150,
              height:100,
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
        beach:'candy.png',
        morning:"morning.jpeg",
        noon:"noon.jpg",
        night:"night.jpg",
        morningtext:"morningtext.png",
        noontext:"noontext.png",
        nighttext:"nighttext.png",
        morning_black: 'square_1.png',
        noon_black: 'square_2.png',
        night_black: 'square_3.png',
      };
      loadImages(sources, initStage);