var interior=[{'name':""},{'name':'\u00D7'},{'name':'\u25CF'}];

function makeGrid(solution){
	
	var width = solution[0].length;
	var height = solution.length;
	
	
	var permuted=[]
	for(var i=1;i<width;i++){
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
	//		titleElement.style.transformOrigin = "left bottom";
	//		titleElement.style.paddingTop = "100px"
			titleElement.style.transform="rotate(-90deg)";
			titleElement.innerText = permuted[i][j];
			titleElement.style.whiteSpace ="nowrap";
			titleElement.style.border = "1px solid black";
			titleElement.style.borderTop="0px";
			titleElement.style.borderBottom="2px solid black"
			if(j==height-1){
				titleElement.style.borderRight="2px solid black";
			}
			headRow.appendChild(titleElement);
			
			col = document.createElement("COL")
			col.width = "20px";
			colgroup.appendChild(col);
		}
	}
	grid.appendChild(colgroup);
	grid.appendChild(headRow);
	
	for(var i=0;i<height;i++){
		var newNameRow = document.createElement("TR");
		title = document.createElement("TD");
		title.innerText = solution[i][0];
		title.style.border = "1px solid black";
		title.style.borderLeft="0px"
		title.style.borderRight="2px solid black";
		title.style.textAlign="right";
		if(i==height-1){title.style.borderBottom="2px solid black";}
		newNameRow.appendChild(title);
		for(var k=0; k<width-1;k++){
			for(var j=0;j<height;j++){
				newBox = document.createElement("TD");
				newBox.style.textAlign = "center";
				newBox.id = solution[i][0]+permuted[k][j]
				newBox.style.border = "1px solid black";
				newBox.innerText="";
				newBox.onclick= function() {
					this.innerText=interior[(lookUpIndex(this.innerText,interior)+1)%3].name;
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
			title.innerText = permuted[i][j];
			title.style.border = "1px solid black";
			title.style.textAlign="right";
			title.style.borderLeft="0px";
			title.style.whiteSpace ="nowrap";
			title.style.borderRight= "2px solid black";
			if(j==height-1){title.style.borderBottom="2px solid black";}
			newRow.appendChild(title);
			for(var k=0;k<i;k++){
				for(var l=0;l<height;l++){
					newBox=document.createElement("TD");
					newBox.id = permuted[i][j]+permuted[k][l];
					newBox.style.border = "1px solid black"
					newBox.style.textAlign = "center";
					newBox.innerText="";
					newBox.onclick= function() {
						this.innerText=interior[(lookUpIndex(this.innerText,interior)+1)%3].name;
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






	