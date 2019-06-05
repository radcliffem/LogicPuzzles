var interior=[{'name':""},{'name':'\u00D7'},{'name':'\u25CF'}];
var recordClicks=[];
var saveState=[];
var saveClicks=[];

function makeGrid(){
	turnOn(document.getElementsByName("play"));
		
	var permuted=[]
	permuted[0] = day.standard[0];
	for(var i=2;i<width;i++){
		var toPermute = [];
		for(var j=0;j<height;j++){
			toPermute.push(solution[j][i]);
		}
		permuted.push(permute(toPermute));
	}
	
	var grid = document.getElementById("maingrid");
	var total = (width-1)*height*20;
	total = total.toString();
	grid.width = total;
	
	var headRow=document.createElement("TR");
	var blank = document.createElement("TD");
	blank.style.borderLeft="0px";
	headRow.appendChild(blank);
	
	var colgroup = document.createElement("COLGROUP");
	var colblank = document.createElement("COL");
	colblank.width = "130px"
	colgroup.appendChild(colblank);

	for(var i=0;i<width-1;i++){
		for(var j=0;j<height;j++){
			titleElement = document.createElement("TD");
			titleElement.setAttribute('class','topTitle');
			titleElement.innerText = permuted[i][j];
			if(j==height-1){
				titleElement.style.borderRight="2px solid black";
			}
			headRow.appendChild(titleElement);
			
			col = document.createElement("COL")
			col.width = "24px";
			colgroup.appendChild(col);
		}
	}
	grid.appendChild(colgroup);
	grid.appendChild(headRow);
	
	for(var i=0;i<height;i++){
		var newNameRow = document.createElement("TR");
		title = document.createElement("TD");
		title.innerText = solution[i][0];
		title.setAttribute('class','sideTitle');
		if(i==height-1){title.style.borderBottom="2px solid black";}
		newNameRow.appendChild(title);
		for(var k=0; k<width-1;k++){
			for(var j=0;j<height;j++){
				newBox = document.createElement("TD");
				newBox.setAttribute('class','XOBox');
				newBox.id = solution[i][0]+permuted[k][j];
				newBox.innerText="";
				newBox.onclick= function() {
					this.innerText=interior[(lookUpIndex(this.innerText,interior)+1)%3].name;
					recordClicks.push(this.id);
				}
				newNameRow.appendChild(newBox);
				if(j==height-1){newBox.style.borderRight="2px solid black";}
				if(i==height-1){newBox.style.borderBottom="2px solid black";}
			}
		}
	grid.appendChild(newNameRow);
	}
	
	for(var i=width-2;i>0;i--){
		for(var j=0;j<height;j++){
			var newRow = document.createElement("TR");
			title=document.createElement("TD");
			title.setAttribute('class','sideTitle');
			title.innerText = permuted[i][j];
			if(j==height-1){title.style.borderBottom="2px solid black";}
			newRow.appendChild(title);
			for(var k=0;k<i;k++){
				for(var l=0;l<height;l++){
					newBox=document.createElement("TD");
					newBox.setAttribute('class','XOBox');
					newBox.id = permuted[i][j]+permuted[k][l];
					newBox.innerText="";
					newBox.onclick= function() {
						this.innerText=interior[(lookUpIndex(this.innerText,interior)+1)%3].name;
						recordClicks.push(this.id);
					}
					if(j==height-1){newBox.style.borderBottom="2px solid black";}
					if(l==height-1){newBox.style.borderRight="2px solid black";}
					newRow.appendChild(newBox);
				}
			}
		grid.appendChild(newRow);
		}
	}
}

document.getElementById("undo").onclick=function(){
	var change = document.getElementById(recordClicks[recordClicks.length-1]);
	change.innerText=interior[(lookUpIndex(change.innerText,interior)-1)%3].name;
	recordClicks.pop();
}

document.getElementById("saveState").onclick=function(){
	boxes=document.getElementsByClassName('XOBox');
	for(var i=0;i<boxes.length;i++){
		saveState.push([boxes[i].id, boxes[i].innerText]);
	}
	saveClicks=Array.from(recordClicks);
}

document.getElementById("revert").onclick=function(){
	for(var i=0;i<saveState.length;i++){
		document.getElementById(saveState[i][0]).innerText=saveState[i][1];
	}
	recordClicks = Array.from(saveClicks);
}



document.getElementById("check").onclick=function(){
	for(var i=0;i<height;i++){
		for(var j=1;j<width;j++){
			if(document.getElementById(solution[i][0]+solution[i][j]).innerText!=interior[2].name){
				correct=false;
			}
			for(var k=i+1;k<height;k++){
				if(document.getElementById(solution[i][0]+solution[k][j]).innerText==interior[2].name){
					correct=false;
				}
			}
		}

	}
	if(correct){
		alert("Congratulations! You solved the puzzle.")
	}else{
		alert("Sorry, not quite. Try again.")
	}
}



	