
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

	obj.GetfCost = function (Start,End,Current) {
		
		var csx = obj.X - Start.X
		var cys = obj.Y - Start.Y;
		var cxe = obj.X - End.X;
		var cye = obj.Y - End.Y;

		// var add = 0;
		// if(csx > cys){
		// 	add += csx - cys;
		// 	add += cys * 1.4;
		// }
		// else{
		// 	add += cys - csx;
		// 	add += csx * 1.4;
		// }

		// if(cxe > cye){
		// 	add += cxe - cye;
		// 	add += cye * 1.4;
		// }
		// else{
		// 	add += cye - cxe;
		// 	add += cxe * 1.4;
		// }

		if(!Current.fCost)
			Current.fCost = 0;
		// obj.fCost = csx + cys + cxe + cye + Current.fCost + add;

		obj.fCost = Math.floor(Math.sqrt( (csx*csx) + (cys*cys) ) 
			+ Math.sqrt( (cxe*cxe) + (cye*cye) ) * 100) ;
			//+ Current.fCost); 

		obj.JOBJ().empty();
		obj.JOBJ().append("<span style=\"color:white;font-size: 3px;\">"+obj.fCost+"</span>");

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

			if(grid[x][y].fCost){
				var temp = grid[x][y].fCost;
				grid[x][y].GetfCost(Start,End,Current);

				var lowerfCost = false;
				if(grid[x][y].fCost < temp){
					lowerfCost = true;
				}else{
					grid[x][y].fCost = temp;
				}
			}else{
				grid[x][y].GetfCost(Start,End,Current);
			}

			if(!grid[x][y].Open() || lowerfCost){
				
				grid[x][y].SetParent(Current);

				if(!grid[x][y].Open()){
					grid[x][y].Open(true);
				}
			}
		}
	}

	setTimeout(AStarStep,100);	
}

setTimeout(AStarStep,1);





