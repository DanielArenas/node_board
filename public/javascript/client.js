var paint_board = function(){
  //Conect to socket
  var socket = null;
  var mouse = { 
    click: false,
    move: false,
    pos: {x:0, y:0},
    pos_prev: false
  };

  var erase = false;

  var canvas;
  var context;
  var width = 785;
  var height= 377;

  var paddingleft = 70;
  var paddingTop = 63;

  var init_component = function(){
    socket  = io.connect();

    // get canvas element and create context
    canvas  = document.getElementById('drawing');
    context = canvas.getContext('2d');
    resize();

    // register mouse event handlers
    canvas.onmousedown = function(e){ 
      mouse.click = true; 
    };

    canvas.onmouseup = function(e){ 
      mouse.click = false; 
    };

    canvas.onmousemove = function(e) {
      // normalize mouse position to range 0.0 - 1.0
      mouse.pos.x = e.layerX / width;
      mouse.pos.y = e.layerY / height;

      mouse.move = true;
    };

    // draw line received from server
    socket.on('draw_line', function (data) {
      var line = data.line;
      context.beginPath();
      context.lineWidth = line[3]
      context.strokeStyle = line[2]
      context.moveTo(line[0].x * width, line[0].y * height);
      context.lineTo(line[1].x * width, line[1].y * height);
      context.stroke();
    });

    mainLoop();
  };

  var resize = function(){
    // width   = $("#drawing").parent().width();
    // height  = $("#drawing").parent().height();

    // set canvas to full browser width/height
    canvas.width = width;
    canvas.height = height;
  };

  var  mainLoop = function(){
    // check if the user is drawing
    if (mouse.click && mouse.move && mouse.pos_prev) {
      // send line to to the server
      socket.emit('draw_line', { line: [ mouse.pos, mouse.pos_prev, get_color_point(), $("#line_width").val() ] });
      mouse.move = false;
    }

    mouse.pos_prev = {x: mouse.pos.x, y: mouse.pos.y};
    setTimeout(mainLoop, 5);
  };

  var get_color_point = function(){

    if(!erase){
      return $("#colorselector :selected").data("color")
    }else{
      // return "#FFFFFF"
      return "#f5f5f5"
    }
  };

  return {
    init: function(){
      $('#colorselector').colorselector();
      $("#line_width").slider();
      init_component();
      
      $( window ).resize(function() {
        // resize();
      });

      $(".action").click(function(){
        $(".action").removeClass("btn-info");
        $(this).addClass("btn-info");

        switch($(this).data("action")) {
          case "pencil":
            erase = false;
          break;
          case "erase":
            erase = true;
          break;
        }

      });
    },
    clear_board: function(){

    }
  }
}();