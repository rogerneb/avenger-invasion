$(document).ready(function() {
    var Canvas_class=function(id) {
        this._canvas = $("#"+id); //Privat
        this.canvasWidth = this._canvas.width();
        this.canvasHeight = this._canvas.height();
        this.context = this._canvas.get(0).getContext("2d");//public
        this.clean=function(){
            this.context.clearRect(0, 0, this.canvasWidth,this.canvasHeight);
        }
    }

    //GENERAL VARS
    //Canvas
    var canvas = document.getElementById('mycanvas');
    var context = canvas.getContext('2d');
    var log = true; //show log: true | false
    var rythm = .6; //scroll speed
    var ship_speed = 250 //ship speed
    var timing = 50; //timing of sprite animation
    canvas.width = 960;
    canvas.height = 540;

    //screen limits
    var screen_limit_h_l = 5;
    var screen_limit_h_r = canvas.width - 60;
    var screen_limit_v_up = 10;
    var screen_limit_v_down = canvas.height - 60;

    //GAME VARS
    var score = 0;




    //------------------------------CLASSES------------------------------------
    //ship class
    var ship = function(x, y) {
        this.x=x;
        this.y=y;
        this.width = 50;
        this.height = 46;
        this.speed = ship_speed;
        this.image = document.getElementById('ship');
        this.power_level = 1;

        this.print = function(){
            //drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
            context.drawImage(this.image,0,0,39,36,this.x,this.y,this.width,this.height);
        };
    }

    //shipshot class
    var shipshot = function(x, y, status) {
        this.x = x;
        this.y = y;
        this.width = 3;
        this.height = 30;
        this.status = false; // False = the shot was not shoted | True the shot was shoted
        this.image = document.getElementById('shipshot');

        this.print = function(){
            //drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
            context.drawImage(this.image,this.x,this.y);
        };
    }

    //badguys
    var badguy = function(x, y, image){
        this.x = x;
        this.y = y;
        this.width=32;
        this.height=23;
        this.ydirection="none";   //vertical direction: up, down, none
        this.xdirection="right";  //horizontal direction: left, right, none
        this.y_memory=0;        //the bad guy remembers in witch point starts falling
        this.falling = 50;      //pixels badguy advances falling.
        this.mode = "download";   //Download: Bad guy fallings to the player | Upload: Bad guy backs to the top
        this.mood = "normal";     //Normal: that's it, normal mood. Angry: Motherfucker BadGuy
        this.doa = "alive";       //Dead or alive.
        this.speed =  1;
        this.spritenum = 0;
        this.t=0;
        this.timing=timing;
        this.image = document.getElementById(image);

        this.print = function(){
            //drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
            //context.drawImage(this.image,this.x,this.y);
            var sprites =[0,32]; //array sprite points
            context.drawImage(this.image,sprites[this.spritenum],0,this.width,this.height,this.x,this.y,this.width,this.height);
            this.move();//move the badguy
            this.changesprite(); //animate

        };

        //BASIC MOVING
        this.move = function(){
            if (this.y >= 400) { this.y = 400; this.mode = "upload";} //badguy changes download to upload
            else if (this.y <= 50) {this.y = 50; this.mode = "download";} //badguy changes upload to download
            //DOWNLOAD//
            if (this.mode == "download")  {
                //Move up, down, left or right the Bad Guy depending his direction
                if (this.ydirection == "down"){
                    this.y = this.y + this.speed;
                }else{
                    if (this.xdirection == "right"){
                        this.x = this.x + this.speed;
                    }else if (this.xdirection == "left"){
                        this.x = this.x - this.speed;
                    }
                }
                //controls vertical moving.
                if (this.y - this.y_memory >= this.falling) {
                    console.log(this.y+" - "+this.y_memory);
                    this.ydirection = "none";
                }
                //Screen limits detection and UP/DOWN selection
                if(this.x >= screen_limit_h_r){ //right limit
                  Badguys[0].x = Badguys[0].x - 3; //escape from screen limits
                  Badguys[0].y_memory = Badguys[0].y;
                  Badguys[0].xdirection = "left";
                  Badguys[0].ydirection = "down";
                }else if (this.x <= screen_limit_h_l){ //left limit
                  Badguys[0].x = Badguys[0].x + 3; //escape from screen limits
                  Badguys[0].y_memory = Badguys[0].y;
                  Badguys[0].xdirection = "right";
                  Badguys[0].ydirection = "down";
                }
            //END DOWNLOAD//
            //UPLOAD//
            }else if (this.mode == "upload"){
              if (this.ydirection == "up"){
                  this.y = this.y - this.speed;
              }else{
                  if (this.xdirection == "right"){
                      this.x = this.x + this.speed;
                  }else if (this.xdirection == "left"){
                      this.x = this.x - this.speed;
                  }
              }
              //controls vertical moving.
              if (this.y_memory - this.y >= this.falling) {
                  console.log(this.y+" - "+this.y_memory);
                  this.ydirection = "none";
              }
              //Screen limits detection and UP/DOWN selection
              if(this.x >= screen_limit_h_r){ //right limit
                Badguys[0].x = Badguys[0].x - 3; //escape from screen limits
                Badguys[0].y_memory = Badguys[0].y;
                Badguys[0].xdirection = "left";
                Badguys[0].ydirection = "up";
              }else if (this.x <= screen_limit_h_l){ //left limit
                Badguys[0].x = Badguys[0].x + 3; //escape from screen limits
                Badguys[0].y_memory = Badguys[0].y;
                Badguys[0].xdirection = "right";
                Badguys[0].ydirection = "up";
              }
            }
            //END UPLOAD//
        };


        this.changesprite = function(){
            if (this.t >= this.timing) {
                this.t=0;
                if(this.spritenum==0){this.spritenum=1;}
                else if(this.spritenum=1){this.spritenum=0;}
            }
            this.t++;
        };
    }

    //background class
    var background = function(x, y, img) {
        this.img=img;
        this.x=x;
        this.y=y;
        this.rythm=rythm; //Scroll speed

        this.print = function(){
            //drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh)
            context.drawImage(this.img,this.x,this.y);

        };
    }
    //---------------------------END CLASSES------------------------------------




    //BUTTONS
    var keysDown = {};
    window.addEventListener('keydown', function(e) {
        keysDown[e.keyCode] = true;
    });
    window.addEventListener('keyup', function(e) {
        delete keysDown[e.keyCode];
    });

    //CREATE OBJECTS
    var Ship = new ship (450, 480); //Create a Gamer SpaceShip

    //create 3 arrays for the background parallax scroll
    var Background0 = []; //bottom layer
    var Background1 = []; //middle layer
    var Background2 = []; //top layer
    Background0[0] = new background(0, 0, document.getElementById('background00')); //Create a background 0 page 0
    Background0[1] = new background(0, -540, document.getElementById('background01')); //Create a background 0 page 1
    Background1[0] = new background(0, 0, document.getElementById('background10')); //Create a background 1 page 0
    Background1[1] = new background(0, -540, document.getElementById('background11')); //Create a background 1 page 1
    Background2[0] = new background(0, 0, document.getElementById('background20')); //Create a background 1 page 0
    Background2[1] = new background(0, -540, document.getElementById('background21')); //Create a background 1 page 1

    //Create the shot
    Shipshot = new shipshot(500, 500, true);

    //create a badguy demo
    var badguynumber = Math.floor(Math.random() * 6) + 1; //Random color badguy
    var imagebadguy = "badguy0"+badguynumber;
    badguysarmy();
    //Badguy = new badguy(100, 0, imagebadguy);
    //END CREATE OBJECTS




    //---------------------------FUNCTIONS------------------------------------
    function update(mod) {
        //move of sprite (BUTTONS)
        if (37 in keysDown) { //left
            Ship.x -= Ship.speed * mod;
            Ship.image = document.getElementById('ship_l');
        }if (38 in keysDown) {//up
            Ship.y -= Ship.speed * mod;
            Ship.image = document.getElementById('ship_u');
        }if (39 in keysDown) {//right
            Ship.x += Ship.speed * mod;
            Ship.image = document.getElementById('ship_r');
        }if (40 in keysDown) {//down
            Ship.y += Ship.speed * mod;
        }if ((38 in keysDown) && (39 in keysDown)){ //up right
            Ship.image = document.getElementById('ship_ur');
        }if ((38 in keysDown) && (37 in keysDown)){ //up left
            Ship.image = document.getElementById('ship_ul');
        }if ((40 in keysDown) && (39 in keysDown)){ //down right
            Ship.image = document.getElementById('ship_r');
        }if ((40 in keysDown) && (37 in keysDown)){ //down left
            Ship.image = document.getElementById('ship_l');
        }if(!(37 in keysDown) && !(38 in keysDown) && !(39 in keysDown) && !(40 in keysDown)){ //no direction pressed
            Ship.image = document.getElementById('ship');
        }
        //Shot Key
        if (65 in keysDown) { //SHOT("A" KEY)
            Shipshot.status = true;
        }
        //Screen Limits for Ship
        //horizontal
        if (Ship.x < screen_limit_h_l){ Ship.x = screen_limit_h_l;} //left limit
        if (Ship.x >= screen_limit_h_r){ Ship.x = screen_limit_h_r;} //right limit
        //vertical
        if (Ship.y < screen_limit_v_up){ Ship.y = screen_limit_v_up;} //top limit
        if (Ship.y >= screen_limit_v_down){ Ship.y = screen_limit_v_down;} //bottom limit
    }

    //render an clear screen
    function render() {
        context.fillStyle = '#000';
        context.fillRect(0, 0, canvas.width, canvas.height);
    }

    //move Background
    function scroll() {
        //Move of the background in parallax scroll
        for (n=0; n<=1; n++){
            Background0[n].y = Background0[n].y+.1*Background0[n].rythm;
            Background1[n].y = Background1[n].y+.2*Background1[n].rythm;
            Background2[n].y = Background2[n].y+.4*Background2[n].rythm;
            if (Background0[n].y >= 540){ Background0[n].y=-540;}
            if (Background1[n].y >= 540){ Background1[n].y=-540;}
            if (Background2[n].y >= 540){ Background2[n].y=-540;}

            //print it
            Background0[n].print();
            Background1[n].print();
            Background2[n].print();
        }

    }

    //Create and recolocate Badguys Army
    function badguysarmy() {
      x=50;
      y=100;
      Badguys = [];
      var badguynumber = Math.floor(Math.random() * 6) + 1; //Random color badguy
      var imagebadguy = "badguy0"+badguynumber;
      Badguys[0] = new badguy(x, y, imagebadguy);
    }

    //shipshot control status and move
    function shipshotcontrolstatus() {
        if (Shipshot.status == true){
            Shipshot.print() //Print and move the shot if it's true
            Shipshot.y = Shipshot.y-5;
        }else{ //if false, the shot follows the ship
            Shipshot.y = Ship.y;
            Shipshot.x = Ship.x+24; //+25 pixels correction
        }
        if (Shipshot.y <= 0) { Shipshot.status=false;} //the Shipshot was outside of the screen limits then its false
    }

    //show log
    function showlog(){
        if (log==true) {
            //ship log vars
            shipx_log=Ship.x.toFixed(2);
            shipy_log=Ship.y.toFixed(2);
            shipheight_log=Ship.height.toFixed(2);
            shipwidth_log=Ship.width.toFixed(2);
            shipspeed_log=Ship.speed.toFixed(2);
            shippowerlevel_log = Ship.power_level;

            //Score Log
            document.getElementById('scorelog').innerHTML =
            ""+score+"<br />"+
            "";

            //Ship log printed in log1
            document.getElementById('shiplog').innerHTML =
                "x: "+shipx_log+" y: "+shipy_log+"<br />"+
                "width: "+shipwidth_log+" height: "+shipheight_log+"<br />"+
                "speed: "+shipspeed_log+"<br/>"+
                "power level: "+shippowerlevel_log+"<br/>"+
                "";

            //shipshot log vars
            shipshotx_log=Shipshot.x.toFixed(2);
            shipshoty_log=Shipshot.y.toFixed(2);
            shipshotstatus_log=Shipshot.status

            //Shipshot log printed in log 1
            document.getElementById('shipshotlog').innerHTML =
                "x: "+shipshotx_log+" y: "+shipshoty_log+"<br />"+
                "Status: "+shipshotstatus_log+
                "";

            //background layers log vars
            background00y_log=Background0[0].y.toFixed(2);
            background01y_log=Background0[1].y.toFixed(2);
            background10y_log=Background1[0].y.toFixed(2);
            background11y_log=Background1[1].y.toFixed(2);
            background20y_log=Background2[0].y.toFixed(2);
            background21y_log=Background2[1].y.toFixed(2);

            //Background layers log printed in log1
            document.getElementById('backgroundlog').innerHTML =
                "Layer00 Y: "+background00y_log+" - Layer01 Y: "+background01y_log+"<br />"+
                "Layer10 Y: "+background10y_log+" - Layer11 Y: "+background11y_log+"<br />"+
                "Layer20 Y: "+background20y_log+" - Layer21 Y: "+background21y_log+"<br />"+
                "";


            badguyx=Badguys[0].x.toFixed(2);
            badguyy=Badguys[0].y.toFixed(2);
            badguyxdirect=Badguys[0].xdirection;
            badguyydirect=Badguys[0].ydirection;
            badguymode = Badguys[0].mode;
            badguyimage = Badguys[0].image;

            //Bad Guy log
            document.getElementById('badguylog').innerHTML =
                "X: "+badguyx+" Y: "+badguyy+"<br />"+
                "Directions X: "+badguyxdirect+" Y: "+badguyydirect+"<br />"+
                "Image: "+badguyimage+"<br />"+
                "Mode: "+badguymode+"<br />"+
                "";

        }
    }
    //---------------------------END FUNCTIONS------------------------------------

    function run() { //Main function Run
        update((Date.now() - time) / 1000);
        render();
        scroll();
        showlog();
        shipshotcontrolstatus();
        Ship.print(); //print the ship

        Badguys[0].print();

        //Badguy.print(); //print the badguys
        time = Date.now();
    }
    var time = Date.now();
    setInterval(run, 10);
});