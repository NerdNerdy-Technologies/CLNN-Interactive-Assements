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
          cat1text1: {
            x: 280,
            y: 150,
          },
          cat3text3: {
            x: 370,
            y: 150,
          },
          cat2text2: {
            x: 470,
            y: 150,
          },
          mug2text2: {
            x: 320,
            y: 380,
          },
          mug1text1: {
            x: 420,
            y: 380,
          },
          mug3text3: {
            x: 520,
            y: 380,
          },
          book1text1: {
            x: 380,
            y: 600,
          },
          book4text4: {
            x: 480,
            y: 600,
          },
          book3text3: {
            x: 570,
            y: 600,
          },
          book2text2: {
            x: 660,
            y: 600,
          },
        };

        var outlines = {
          cat: {
            x: 10,
            y: 10,
          },
          mug: {
            x: 10,
            y: 250,
          },
          book: {
            x: 10,
            y: 480,
          },
          cat1_black: {
            x: 200,
            y: 0,
          },
          cat2_black: {
            x: 380,
            y: 0,
          },
          cat3_black: {
            x: 550,
            y: 0,
          },
          mug1_black: {
            x: 200,
            y: 220,
          },
          mug2_black: {
            x: 380,
            y: 220,
          },
          mug3_black: {
            x: 550,
            y: 220,
          },
          book1_black: {
            x: 200,
            y: 450,
          },
          book2_black: {
            x: 380,
            y: 450,
          },
          book3_black: {
            x: 550,
            y: 450,
          },
          book4_black: {
            x: 730,
            y: 450,
          }
        };



        //---------------- create draggable animals
        for (var key in animals) {  
          // anonymous function to induce scope
          (function () {
            //key will be members of animals object like; monkey, bear
            var privKey = key;
            console.log("key is",key)
            var anim = animals[key];
            var animal = new Konva.Image({
              image: images[key],
              x: anim.x,
              y: anim.y,
              draggable: true, //to make the image draggable
              height:30,
              width:35,
            });

            animal.on('dragstart', function () {
              this.moveToTop();
            });
            /*
             * check if animal is in the right spot and
             * snap into place if it is
             */
             //for cat
            animal.on('dragend', function () {
              var outline = outlines[privKey.slice(0,-5) + '_black'];
              if (!animal.inRightPlace && isNearOutline(animal, outline)) {
                animal.position({
                  x: outline.x+30,
                  y: outline.y+60,
                });   
                animal.inRightPlace = true;
                if (++score >= 14) {
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


            // return animal on mouseout
            animal.on('mouseout', function () {
              animal.image(images[privKey]);
              document.body.style.cursor = 'default';
            });

            animal.on('dragmove', function () {
              document.body.style.cursor = 'pointer';
            });

             animal.on('mouseover', function () {
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
              height:150,
            });

            animalLayer.add(outline);
          })();
        }


        //-----------------

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
        cat:"cat_1.png",
        mug:"mug_1.png",
        book:"book_1.png",
        cat1text1:"c.png",
        cat2text2:"a.png",
        cat3text3:"t.png",
        mug1text1:"m.png",
        mug2text2:"u.png",
        mug3text3:"g.png",
        book1text1:"b.png",
        book2text2:"o_1.png",
        book3text3:"o_1.png",
        book4text4:"k.png",
        cat1_black: 'square_1.png',
        cat2_black: 'square_2.png',
        cat3_black: 'square_3.png',
        mug1_black: 'square_1.png',
        mug2_black: 'square_2.png',
        mug3_black: 'square_3.png',
        book1_black: 'square_1.png',
        book2_black: 'square_2.png',
        book3_black: 'square_3.png',
        book4_black: 'square_3.png',

      };
      loadImages(sources, initStage);