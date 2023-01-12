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
        if(outline==undefined){
          return false;
        }

        if (ax > o.x - 50 && ax < o.x + 50 && ay > o.y - 50 && ay < o.y + 50) {
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
        var outlines = {
          book: {
            x: 10,
            y: 50,
          },
          wire: {
            x: 10,
            y: 200,
          },
          wreck: {
            x: 10,
            y: 350,
          },
          fire: {
            x: 400,
            y: 50,
          },
          knife: {
            x: 400,
            y: 350,
          },
          clipboard: {
            x: 400,
            y: 200,
          },
        };

        var animals = {
          knife_black: {
            x: 200,
            y: 50,
          },
          wreck_black: {
            x: 200,
            y: 50,
          },
          fire_black: {
            x: 200,
            y: 50,
          },
          wire_black: {
            x: 200,
            y: 50,
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
              var outline = outlines[privKey.slice(0,-6)];
              //console.log("inRightPlace___",animal.inRightPlace,"outline___",outline,"animal__",animal)
              if (!animal.inRightPlace && isNearOutline(animal, outline)) {
                animal.position({
                  x: outline.x,
                  y: outline.y,
                });
                animal.inRightPlace = true;
                if (++score >= 4) {
                  var text = `You win! Your score is: `+score;
                  drawBackground(background, images.beach, text);
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
              width:100,
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
        book:"book.png",
        knife:"knife.png",
        fire:"fire.png",
        wreck:"hook.png",
        wire:"wire.png",
        mug:"mug.png",
        clipboard:"clipboard.png",
        knife_black: 'cross.png',
        fire_black: 'cross.png',
        wire_black: 'cross.png',
        wreck_black: 'cross.png',
        nineteen_black: 'cross.png',
      };
      loadImages(sources, initStage);