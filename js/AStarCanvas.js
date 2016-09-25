$(document).ready(function() {

	var width = 100;
	var height = 100;
	var grid = [];

	var running = false;
	var canvas = document.getElementById("canvas");
	var ctx = document.getElementById('canvas').getContext('2d');
	function init() {
		GenerateGrid();
		GenerateStartAndEnd();

		window.requestAnimationFrame(draw);
		//AStarStep();
	}

	$(document).keypress(function( event ) {
	  if ( event.which == 32 ) { //Space
	  	if(!running){
        	GenerateGrid();
			GenerateStartAndEnd();
			window.requestAnimationFrame(draw);
		}
	  }
	  if ( event.which == 13 ) { //Enter
	  	if(!running && closedlist.length == 0){
    		running = true;
    		AStarStep();
    	}
	  }
	});

	var isDown = false;
	$(document).mousedown(function(event) {
			switch (event.which) {
		        case 1://alert('Left Mouse button pressed.');
					isDown = true;
		            break;
		        case 2://alert('Middle Mouse button pressed.');
		            break;
		        case 3://alert('Right Mouse button pressed.');
		            break;
		        default://alert('You have a strange Mouse!');
		    }
		})
		.mouseup(function(event) {
			switch (event.which) {
		        case 1://alert('Left Mouse button pressed.');
					isDown = false;
		            break;
		        case 2://alert('Middle Mouse button pressed.');
		            break;
		        case 3://alert('Right Mouse button pressed.');
		            break;
		        default://alert('You have a strange Mouse!');
		    }
		});

	canvas.addEventListener('mousemove', function(e) {

		if (isDown) {
			var x = Math.floor((e.clientX / canvas.clientWidth) * width);
			var y = Math.floor((e.clientY / canvas.clientHeight) * height);
			try {
				for (var i = -1; i <= 1; i++) {
					for (var j = -1; j <= 1; j++) {

						var obj = grid[x + i][y + j];
						obj.AddClass("BLACKSQUARE");
						obj.blocked = true;

					}
				}
			} catch (e) {
			}
			window.requestAnimationFrame(draw);
		}
	});

	function draw() {

		ctx.globalCompositeOperation = 'destination-over';
		ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas



		for (var i = grid.length - 1; i >= 0; i--) {
			for (var j = grid[i].length - 1; j >= 0; j--) {
				grid[i][j].draw(ctx);
			}
		}

		// if(!running){
		// 	ctx.font = "10px monospace";
		// 	ctx.fillText("Left click and drag to make walls!", 10, canvas.height/2);
		// }

		
	}


	var _UID = 0;

	function GetUID() {
		return _UID++;
	}

	var ObjectReferences = {};

	var openlist = [];
	var closedlist = [];

	function GetUIDObj(ID) {

		if (ID in ObjectReferences) {
			return ObjectReferences[ID];
		}

		var obj = {};

		obj.GUID = GetUID();
		obj.BGColor = "";

		obj.JOBJ = function() {
			//return $("#" + obj.GUID);
		}
		obj.SetDisplayCoords = function(x, y, width, height) {
			obj.X = x;
			obj.Y = y;
			obj.aX = Math.floor(x * width);
			obj.aY = Math.floor(y * height);
		}
		obj.SetHeight = function(h) {
			//obj.JOBJ().css("height", h.toString() + "%");
			obj.Height = Math.ceil(h);
		}
		obj.SetWidth = function(w) {
			//obj.JOBJ().css("width", w.toString() + "%");
			obj.Width = Math.ceil(w);
		}

		obj.AddClass = function(c) {
			// if(!obj.JOBJ().hasClass(c))
			// 	obj.JOBJ().addClass(c)
			obj.BGColor = c;
		}
		obj.RemoveClass = function(c) {
			// if(obj.JOBJ().hasClass(c))
			// 	obj.JOBJ().removeClass(c)
			obj.BGColor = "";
		}
		obj.SetFloat = function(bg) {
			obj.JOBJ().css("float", bg.toString());
		}
		obj.Append = function(jobj) {
			jobj.append("<div id=\"" + obj.GUID + "\" class=\"SQUARE\"></div>");
		}

		obj.draw = function(p_ctx) {
			switch (obj.BGColor) {
				case "":
					p_ctx.fillStyle = "#777777";
					break;
				case "BLACKSQUARE":
					p_ctx.fillStyle = "black";
					break;
				case "GREYSQUARE":
					p_ctx.fillStyle = "#555555";
					break;
				case "YELLOWSQUARE":
					p_ctx.fillStyle = "#335555";
					break;
				case "BLUESQUARE":
					p_ctx.fillStyle = "#333388";
					break;
				case "REDSQUARE":
					p_ctx.fillStyle = "#883333";
					break;
				case "GREENSQUARE":
					p_ctx.fillStyle = "#338833";
					break;
			}
			p_ctx.fillRect(obj.aX, obj.aY, obj.Width, obj.Height);
		}

		obj.GetfCost = function(Start, End, Cur, gcost) {

			// var csx = obj.X - Start.X
			// var cys = obj.Y - Start.Y;
			var cxe = obj.X - End.X;
			var cye = obj.Y - End.Y;

			if (!Cur.fCost)
				Cur.fCost = 0;
			if (!gcost)
				gcost = 0;
			if (!Cur.cul_gCost)
				Cur.cul_gCost = 0;

			//Math.sqrt( (csx*csx) + (cys*cys) ) 
			obj.gCost = gcost;
			obj.cul_gCost = gcost + Cur.cul_gCost;
			obj.hCost = Math.floor(Math.sqrt((cxe * cxe) + (cye * cye))) * 11.3;

			obj.fCost = obj.cul_gCost + obj.hCost; //  * 10 + gcost);

			// obj.JOBJ().empty();
			// obj.JOBJ().append("<span style=\"color:white;font-size: 40%;\">" + obj.cul_gCost + "</span>");
			// obj.JOBJ().append("<br/><span style=\"color:white;font-size: 40%;\">" + obj.hCost + "</span>");
		}

		obj.SaveCosts = function(argument) {
			obj._gCost = obj.gCost;
			obj._hCost = obj.hCost;
			obj._cul_gCost = obj.cul_gCost;
			obj._fCost = obj.fCost;
		}
		obj.RevertCosts = function(argument) {
			obj.gCost = obj._gCost;
			obj.hCost = obj._hCost;
			obj.cul_gCost = obj._cul_gCost;
			obj.fCost = obj._fCost;

			// obj.JOBJ().empty();
			// obj.JOBJ().append("<span style=\"color:white;font-size: 40%;\">" + obj.cul_gCost + "</span>");
			// obj.JOBJ().append("<br/><span style=\"color:white;font-size: 40%;\">" + obj.hCost + "</span>");
		}

		obj.SetParent = function(pobj) {
			obj.Parent = pobj;
		}

		obj.Open = function(e) {
			if (e) {
				openlist.push(obj);
				obj._open = true;
				obj._closed = false;
				obj.AddClass("YELLOWSQUARE");
				return;
			}
			return (obj._open == true);
		}

		obj.Close = function(e) {
			if (e) {
				closedlist.push(obj);
				obj._open = false;
				obj._closed = true;
				//obj.RemoveClass("YELLOWSQUARE");
				obj.AddClass("GREYSQUARE");
				return;
			}
			return (obj._closed == true);
		}

		ObjectReferences[obj.GUID] = obj;
		return obj;
	}



	function GenerateGrid() {

		grid = [];
		Current = null;
		openlist = [];
		closedlist = [];

		var squareHeight = canvas.height / height;
		var squareWidth = canvas.width / width;

		var JBody = $("body");

		for (var i = 0; i < width; i++) {
			var row = [];
			for (var j = 0; j < height; j++) {

				var OBJ = GetUIDObj();
				OBJ.SetDisplayCoords(i, j, squareWidth, squareHeight);
				//OBJ.Append(JBody);
				OBJ.SetHeight(squareHeight);
				OBJ.SetWidth(squareWidth);
				//OBJ.SetFloat("left");
				row.push(OBJ);
			}
			grid.push(row);
		}
	}
	//GenerateGrid();

	var Start;
	var End;

	function GenerateStartAndEnd() {

		var startx = Math.floor(Math.random() * width);
		var starty = Math.floor(Math.random() * height);

		Start = grid[startx][starty];
		Start.AddClass("REDSQUARE");
		//Start.Type = "Start";
		Start.fCost = 0;
		Start.Open(true);

		var endx = Math.floor(Math.random() * width);
		var endy = Math.floor(Math.random() * height);

		End = grid[endx][endy]
		End.AddClass("GREENSQUARE");
		//End.Type = "End";

	}
	//GenerateStartAndEnd();

	var Current;

	function AStarStep() {

		window.requestAnimationFrame(draw);

		openlist.sort(function(a, b) {
			if (a.fCost < b.fCost)
				return -1;
			else if (a.fCost > b.fCost)
				return 1;
			else { //if (a.fCost = b.fCost){
				if(a.hCost < b.hCost)
					return -1;
				else if(a.hCost > b.hCost)
					return 1;
				else{
					return 0;
				}
			}
		});

		Current = openlist[0];
		openlist.splice(0, 1);
		Current.Close(true);

		if (Current == End) {

			for (var i = 0; i <= width * height; i++) {

				if (Current == Start)
					break;

				Current.Parent.AddClass("BLUESQUARE");
				Current = Current.Parent;
			};


			//alert("DONE!!");
			running = false;
			return; //Done.
		}

		for (var i = -1; i <= 1; i++) {
			for (var j = -1; j <= 1; j++) {

				//Skip Center
				if (i == 0 && j == 0)
					continue;

				var x = Current.X + i;
				var y = Current.Y + j;

				//Bound Check
				if (x < 0 || y < 0 || x >= width || y >= height)
					continue;


				//closed or blocked.
				if (grid[x][y].Close() || grid[x][y].blocked) {
					continue;
				}

				var gcost = 0;
				if (i == 0 || j == 0) {
					gcost = 10;
				} else {
					gcost = 14;
				}

				if (grid[x][y].fCost) {
					grid[x][y].SaveCosts();
					grid[x][y].GetfCost(Start, End, Current, gcost);

					var lowerfCost = false;
					if (grid[x][y].fCost < grid[x][y]._fCost) {
						lowerfCost = true;
					} else {
						grid[x][y].RevertCosts();
					}
				} else {
					grid[x][y].GetfCost(Start, End, Current, gcost);
				}

				if (!grid[x][y].Open() || lowerfCost) {

					grid[x][y].SetParent(Current);

					if (!grid[x][y].Open()) {
						grid[x][y].Open(true);
					}
				}
			}
		}

		setTimeout(AStarStep, 0);
	}



	init();
});