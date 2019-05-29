var interior=["","X","O"];

function makeGrid(solution){
	var width = solution[0].length;
	var height = solution.length;
	var grid = document.getElementById("maingrid");
	var total = (width-1)*height*20;
	total = total.toString();
	grid.width = total;
	
	var headRow=document.createElement("TR");
	var blank = document.createElement("TD");
	headRow.appendChild(blank);
	for(var i=1;i<width;i++){
		for(var j=0;j<height;j++){
			titleElement = document.createElement("TD");
			titleElement.style.transform="rotate(-90deg)"
			titleElement.innerText = solution[j][i];
			titleElement.style.width="20px";
			titleElement.height="100px";
			titleElement.style.border = "1px solid black"
			headRow.appendChild(titleElement);
		}
	}
	grid.appendChild(headRow);
	
	for(var i=0;i<height;i++){
		var newNameRow = document.createElement("TR");
		title = document.createElement("TD");
		title.innerText = solution[i][0];
		title.style.border = "1px solid black"
		newNameRow.appendChild(title);
		for(var k=1; k<width;k++){
			for(var j=0;j<height;j++){
				newBox = document.createElement("TD");
				newBox.id = solution[i][0]+solution[j][k]
				newBox.style.border = "1px solid black"
				newNameRow.appendChild(newBox);
			}
		}
	grid.appendChild(newNameRow);
	}
	
	for(var i=width-1;i>1;i--){
		for(var j=0;j<height;j++){
			var newRow = document.createElement("TR");
			title=document.createElement("TD");
			title.innerText = solution[j][i];
			title.style.border = "1px solid black"
			newRow.appendChild(title);
			for(var k=1;k<i;k++){
				for(var l=0;l<height;l++){
					newBox=document.createElement("TD");
					newBox.id = solution[j][i]+solution[l][k];
					newBox.style.border = "1px solid black"
					newRow.appendChild(newBox);
				}
			}
		grid.appendChild(newRow);
		}
	}
	
	
	
}