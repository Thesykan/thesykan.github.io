
var grid = [];
var gridobj = {
	grid: grid,
	Clear: function(){
		// for (var i = 0; i < grid.length; i++) {
		// 	for (var j = 0; j < grid[i].length; j++) {
		// 		grid[i][j].SetBG("#777777");
		// 	}
		// }
		$("div").toggleClass("REDSQUARE",false);
		$("div").toggleClass("GREENSQUARE",false);
	}
};


var _UID = 0;
function GetUID(){
	return _UID++;
}


var ObjectReferences = {};

var openlist = [];
var closedlist = [];
function GetUIDObj(ID){
	
	if(ID in ObjectReferences){
		return ObjectReferences[ID];
	}

	var obj = {};

	obj.GUID = GetUID();

	obj.JOBJ = function(){
		return $("#"+obj.GUID);
	}

	obj.SetHeight = function(h){
		obj.JOBJ().css("height",h.toString() + "%");
	}
	obj.SetWidth = function(w){
		obj.JOBJ().css("width",w.toString() + "%");
	}
	obj.SetBG = function(bg){
		obj.JOBJ().css("background-color",bg.toString());
	}
	obj.AddClass= function(c){
		if(!obj.JOBJ().hasClass(c))
			obj.JOBJ().addClass(c)
	}
	obj.RemoveClass= function(c){
		if(obj.JOBJ().hasClass(c))
			obj.JOBJ().removeClass(c)
	}
	obj.SetFloat = function(bg){
		obj.JOBJ().css("float",bg.toString());
	}
	obj.Append = function(jobj){
		jobj.append("<div id=\""+obj.GUID+"\" class=\"SQUARE\"></div>");
	}

	obj.GetfCost = function (Start,End) {
		
		var csx = Math.abs(Current.X - Start.X);
		var cys = Math.abs(Current.Y - Start.Y);
		var cxe = Math.abs(Current.X - End.X);
		var cye = Math.abs(Current.Y - End.Y);

		// Math.sqrt(csx * csx) + Math.sqrt(cys * cys)
		//	+ Math.sqrt(cxe * cxe) + Math.sqrt(cye * cye)

		var add = 0;
		if(csx > cys)
			add += csx - cys;
		else
			add += cys - csx;

		if(cxe > cye)
			add = cxe - cye;
		else
			add = cye - cxe;

		obj.fCost = csx + cys + cxe + cye;

	}


	obj.SetParent = function(pobj){
		obj.Parent = pobj;
	}

	obj.Open = function (e) {
		if(e){
			openlist.push(obj);
			obj._open = true;
			obj._closed = false;
			obj.AddClass("YELLOWSQUARE");
			return;
		}
		return (obj._open == true);
	}

	obj.Close = function (e) {
		if(e){
			closedlist.push(obj);
			obj._open = false;
			obj._closed = true;
			obj.RemoveClass("YELLOWSQUARE");
			obj.AddClass("GREYSQUARE");
			return;
		}
		return (obj._closed == true);
	}

	ObjectReferences[obj.GUID] = obj;
	return obj;
}

var width = 100;
var height = 100;

function GenerateGrid(){

	var squareHeight = 100 / height;
	var squareWidth = 100 / width;

	var JBody = $("body");

	for (var i = 0; i < width; i++) {
		var row = [];
		for (var j = 0; j < height; j++) {

			var OBJ = GetUIDObj();
			OBJ.X = i;
			OBJ.Y = j;
			OBJ.Append(JBody);
			OBJ.SetHeight(squareHeight);
			OBJ.SetWidth(squareWidth);
			OBJ.SetFloat("left");
			row.push(OBJ);
		}
		grid.push(row);
	}
}
GenerateGrid();

var Start;
var End;
function GenerateStartAndEnd(){

	var startx = Math.floor(Math.random() * width);
	var starty = Math.floor(Math.random() * height);

	Start = grid[startx][starty];
	Start.AddClass("REDSQUARE");
	Start.Type = "Start";
	Start.fCost = 0;
	Start.Open(true);

	var endx = Math.floor(Math.random() * width);
	var endy = Math.floor(Math.random() * height);

	End = grid[endx][endy]
	End.AddClass("GREENSQUARE");
	End.Type = "End";

	//setTimeout(GenerateStartAndEnd,1000);
}
GenerateStartAndEnd();

var Current;
function AStarStep () {
	
	openlist.sort(function (a,b) {
		if(a.fCost < b.fCost)
			return -1;
		if(a.fCost > b.fCost)
			return 1;
		if(a.fCost = b.fCost)
			return 0;
	});

	Current = openlist[0];
	openlist.splice(0,1);
	Current.Close(true);

	if(Current == End){

		for (var i = 0; i <= width*height; i++) {

			if(Current == Start)
				break;

			Current.Parent.AddClass("BLUESQUARE");
			Current = Current.Parent;
		};


		//alert("DONE!!");
		return; //Done.
	}

	for (var i = - 1; i <= 1; i++) {
		for (var j = - 1; j <= 1; j++) {

			//Skip Center
			if(i == 0 && j == 0)
				continue;

			var x = Current.X + i;
			var y = Current.Y + j;

			//Bound Check
			if(x < 0 || y < 0 || x >= width || y >= height)
				continue;


			//closed or blocked.
			if(grid[x][y].Close() || grid[x][y].blocked){
				continue;
			}

			if(!grid[x][y].Open() || grid[x][y].lowerfCost){
				grid[x][y].GetfCost(Start,End);
				grid[x][y].SetParent(Current);

				if(!grid[x][y].Open()){
					grid[x][y].Open(true);
				}
			}
		}
	}

	setTimeout(AStarStep,1);	
}

setTimeout(AStarStep,1);





