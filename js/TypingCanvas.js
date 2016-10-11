
var PIXEL_RATIO = (function () {
    var ctx = document.createElement("canvas").getContext("2d"),
        dpr = window.devicePixelRatio || 1,
        bsr = ctx.webkitBackingStorePixelRatio ||
              ctx.mozBackingStorePixelRatio ||
              ctx.msBackingStorePixelRatio ||
              ctx.oBackingStorePixelRatio ||
              ctx.backingStorePixelRatio || 1;

    return dpr / bsr;
})();


createHiDPICanvas = function(w, h, ratio) {
    if (!ratio) { ratio = PIXEL_RATIO; }
    var can = document.getElementById("canvas");
    can.width = w * ratio;
    can.height = h * ratio;
    can.style.width = w + "px";
    can.style.height = h + "px";
    can.getContext("2d").setTransform(ratio, 0, 0, ratio, 0, 0);
    return can;
}

var canvas = createHiDPICanvas(window.innerWidth,window.innerHeight);//document.getElementById("canvas");
var ctx = canvas.getContext('2d');

var canvasHalfHeight = canvas.height/2 + 10;
var canvasEighthWidth = canvas.width/8;

var _UID = 0;
function GetUID() {
	return _UID++;
}

var ObjectReferences = {};
var ReuseableObjects = [];
var TypableObjects = {};
var Score = 0;
var Failed = 0;
function GetUIDObj(ID) {

	if (ID in ObjectReferences) {
		return ObjectReferences[ID];
	}

	var obj = null;
	if(ReuseableObjects.length > 0){
		obj = ReuseableObjects.pop();
	}else{
		obj = {};
		obj.GUID = GetUID();
	}
	
	obj.AsciiCode = 65 + (Math.floor(Math.random() * 24));
	obj.RandomChar = String.fromCharCode(obj.AsciiCode); //Char from A-Z

	obj.X = 0 + (Math.floor(Math.random() * canvas.width));
	obj.Y = 0;
	//Math.random();
	//var chr = String.fromCharCode(65 + n);
	//65 is A
	//97 is a

	obj.Color = "#000000";
	obj.TextSize = 20;
	obj.Dy = Math.max(Math.random() * .2, .1);

	obj.Update = function(dt){

		obj.Y = obj.Y + (obj.Dy * dt);

		if(obj.Y > canvas.height || obj.X > canvas.width){
			
			Failed++;
			obj.Destroy();

		}else{

			var YFromCenter = (canvasHalfHeight - obj.Y);

			if(YFromCenter > 0){

				if(YFromCenter < 20){
					TypableObjects[obj.AsciiCode] = obj;
					obj.Color = "#0000FF";
					obj.TextSize = 55;			
				}else if(YFromCenter < 40){

					//40 -> 20
					var red = Math.floor(200 - (YFromCenter-20) * 10);

					obj.Color = "#"+ red.toString(16) +"0000";
					obj.TextSize = 40;
				}

			}else{

				if(YFromCenter > -20){
					obj.Color = "#000000";
					obj.TextSize = 20;
				} else if(YFromCenter > -40){
					obj.Dy = Math.random() * 100;
				}

			}

		}
	};

	obj.Explode = function(){

		//Sprite FX?
		obj.Destroy();
		Score++;
	}

	obj.Draw = function() {
		ctx.fillStyle = obj.Color;
		ctx.font = obj.TextSize+"px Text";
		ctx.fillText(obj.RandomChar, obj.X, obj.Y);
		//p_ctx.fillRect(obj.aX, obj.aY, obj.Width, obj.Height);
	};

	obj.Destroy = function(){
		obj.Dispose = true;
		ReuseableObjects.push(obj);
	};

	obj.Dispose = false;
	ObjectReferences[obj.GUID] = obj;
	return obj;
}

$(document).ready(function() {


	var RectYCoord = canvas.height/2 - 10;
	function init() {
		update();
		window.requestAnimationFrame(draw);
	}

	var numberOfLetters = 0;
	var maxNumberOfLetters = 10000;

	var LastTypableObjects = {};
	var lastMiliSeconds = 0;
	var LetterRate = 1000; //Every 100ms
	var LastLetterTime = 0;
	var totalDT = 0;
	var startTime = (new Date()).getTime();
	function update() {


		var dt = .01;
		if(lastMiliSeconds > 0){
			var d = new Date();
			var now = d.getTime();
			dt = (now - lastMiliSeconds);
			lastMiliSeconds = now;
		}else{
			var d = new Date();
			lastMiliSeconds = d.getTime();
		}
		LetterRate -= (dt / 10);


		if(LastLetterTime <= 0){		
			if(ReuseableObjects.length > 0){
				var letter = GetUIDObj();
			}
			if(numberOfLetters < maxNumberOfLetters){
				var letter = GetUIDObj();
				numberOfLetters++;
			}
			LastLetterTime += (LetterRate);
		}else{
			LastLetterTime -= dt;
		}

		for(var propt in ObjectReferences){
			if(!ObjectReferences[propt].Dispose)
				ObjectReferences[propt].Update(dt);

		}

		LastTypableObjects = TypableObjects;
		TypableObjects = {};

		setTimeout(update,1);
	}



	function draw() {

			var d = new Date();
		try{

			ctx.globalCompositeOperation = 'destination-over';
			ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas

			ctx.fillStyle = "#777777";
			ctx.strokeRect(0, RectYCoord, canvas.width, 20);
			

			for(var propt in ObjectReferences){
				if(!ObjectReferences[propt].Dispose)
					ObjectReferences[propt].Draw();
			}

			ctx.fillStyle = "#000000";
			ctx.font = "50px Text";
			ctx.fillText(Score.toString() + " POINTS!  "+Failed.toString() + " Attempted...  Time "+ Math.floor((d.getTime() - startTime)/1000)+" Seconds Elapsed" , 100, canvas.height-100);

		}catch(e){
			console.log(e);
		}

		window.requestAnimationFrame(draw);
	}

	$(document).keypress(function( event ) {
	  
	  	var key = LastTypableObjects[(event.which - 32)];
		if(key){
			key.Explode();
		}

	});


	init();
});