
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


	obj.GetfCost = function (Start,End,Cur,gcost) {
		
		// var csx = obj.X - Start.X
		// var cys = obj.Y - Start.Y;
		var cxe = obj.X - End.X;
		var cye = obj.Y - End.Y;

		if(!Cur.fCost)
			Cur.fCost = 0;
		if(!gcost)
			gcost = 0;
		if(!Cur.cul_gCost)
			Cur.cul_gCost = 0;

		//Math.sqrt( (csx*csx) + (cys*cys) ) 
		obj.gCost = gcost;
		obj.cul_gCost = gcost + Cur.cul_gCost;
		obj.hCost = Math.floor(Math.sqrt( (cxe*cxe) + (cye*cye) )) * 10;

		obj.fCost = obj.cul_gCost + obj.hCost;//  * 10 + gcost);

		obj.JOBJ().empty();
		obj.JOBJ().append("<span style=\"color:white;font-size: 40%;\">"+obj.cul_gCost+"</span>");
		obj.JOBJ().append("<br/><span style=\"color:white;font-size: 40%;\">"+obj.hCost+"</span>");
	}

	obj.SaveCosts = function (argument) {
		obj._gCost = obj.gCost;
		obj._hCost = obj.hCost;
		obj._cul_gCost = obj.cul_gCost;
		obj._fCost = obj.fCost;
	}
	obj.RevertCosts = function (argument) {
		obj.gCost = obj._gCost;
		obj.hCost = obj._hCost;
		obj.cul_gCost = obj._cul_gCost;
		obj.fCost = obj._fCost;

		obj.JOBJ().empty();
		obj.JOBJ().append("<span style=\"color:white;font-size: 40%;\">"+obj.cul_gCost+"</span>");
		obj.JOBJ().append("<br/><span style=\"color:white;font-size: 40%;\">"+obj.hCost+"</span>");
	}

	obj.SetfCost = function (f,End){

		var cxe = obj.X - End.X;
		var cye = obj.Y - End.Y;
		var distanceFromEnd = Math.floor(Math.sqrt( (cxe*cxe) + (cye*cye) ));

		obj.fCost = f;
		obj.JOBJ().empty();
		obj.JOBJ().append("<span style=\"color:white;font-size: 10px;\">"+obj.fCost+"</span>");		
		obj.JOBJ().append("<br/><span style=\"color:white;font-size: 10px;\">"+distanceFromEnd+"</span>");
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

			var gcost = 0;
			if(i == 0 || j == 0){
				gcost = 10;
			}else{
				gcost = 14;
			}

			if(grid[x][y].fCost){
				grid[x][y].SaveCosts();
				grid[x][y].GetfCost(Start,End,Current,gcost);

				var lowerfCost = false;
				if(grid[x][y].fCost < grid[x][y]._fCost){
					lowerfCost = true;
				}else{
					grid[x][y].RevertCosts();
				}
			}else{
				grid[x][y].GetfCost(Start,End,Current,gcost);
			}

			if(!grid[x][y].Open() || lowerfCost){
				
				grid[x][y].SetParent(Current);

				if(!grid[x][y].Open()){
					grid[x][y].Open(true);
				}
			}
		}
	}

	setTimeout(AStarStep,0);	
}

setTimeout(AStarStep,1000);


$(document).ready(function(){

  var isDown = false;   // Tracks status of mouse button

  $(document).mousedown(function() {
    isDown = true;      // When mouse goes down, set isDown to true
  })
  .mouseup(function() {
    isDown = false;    // When mouse goes up, set isDown to false
  });

  $(".SQUARE").mouseover(function(){

    if(isDown) {   

    	var obj = GetUIDObj($(this).attr("id"));
    	obj.AddClass("BLACKSQUARE");
    	obj.blocked = true;

       // Only change css if mouse is down
       //$(this).css({background:"#333333"});
    }
  });
});




