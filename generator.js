var possibleSolutions = [];
var solution = {};
var solved = false;
var count = 1;
var allClues=[];
var cats=[];

cats=[nationality,pets,houses];

//width indicates the number of categories in play 
//(i.e., width = solution[0].length)

function generateClues(solution){
	var clues=[];
	var width=cats.length;
	var height=solution.length;
	for(var j=0; j<height;j++){
		for(var i=0;i<width;i++){
			for(var k=i+1;k<width;k++){
				var newClue={};
				newClue.type='direct';
				newClue.firstProperty={category:cats[i].name,value:solution[j][i]};
				newClue.secondProperty={category:cats[k].name,value:solution[j][k]};
				clues.push(newClue);	
			}
		}
		
		for(var i=j+1;i<height;i++){
			for(var k=0;k<width;k++){
				for(var l=k+1;l<width;l++){
					var newClue={};
					newClue.type='anti';
					newClue.firstProperty={category:cats[k].name,value:solution[j][k]};
					newClue.secondProperty={category:cats[l].name,value:solution[i][l]};
					clues.push(newClue);
				}
			}
		}
	}
	return clues;
}


function makePuzzle(cats){
	possibleSolutions=generatePossible(cats[0].values,cats[1].values);
	for(var i=2;i<cats.length;i++){
		possibleSolutions = generatePossible(possibleSolutions,cats[i].values);
	}
	solution=possibleSolutions[getRandInt(0,possibleSolutions.length-1)];
		
 	allClues = generateClues(solution);
	allClues=permute(allClues);
		
	var keepClues = [];
	var numClues = 0;
	var newPossible = [];
	var newClue = []
	
	while(solved==false){
		newPossible = [];
		newClue = allClues[numClues];
		
		if(newClue.type=='anti'){
			firstInd = lookUpIndex(newClue.firstProperty.category);
			secondInd=lookUpIndex(newClue.secondProperty.category);
			for(var i=0;i<possibleSolutions.length;i++){
				for(var j=0;j<possibleSolutions[i].length;j++){
					if(possibleSolutions[i][j][firstInd]==newClue.firstProperty.value){
						if(possibleSolutions[i][j][secondInd]!=newClue.secondProperty.value){
							newPossible.push(possibleSolutions[i]);
							j=possibleSolutions[i].length;
						}
					}
				}
			}
		}else if(newClue.type=='direct'){
			firstInd = lookUpIndex(newClue.firstProperty.category);
			secondInd=lookUpIndex(newClue.secondProperty.category);
			for(var i=0;i<possibleSolutions.length;i++){
				for(var j=0;j<possibleSolutions[i].length;j++){
					if(possibleSolutions[i][j][firstInd]==newClue.firstProperty.value){
						if(possibleSolutions[i][j][secondInd]==newClue.secondProperty.value){
							newPossible.push(possibleSolutions[i]);
							j=possibleSolutions[i].length;
						}
					}
				}	
			}
		}
		
		if(newPossible.length<possibleSolutions.length){
			keepClues.push(newClue);
			possibleSolutions = newPossible;
			addClue(newClue);
		}
		if(possibleSolutions.length==1){
			solved=true;
		}
		numClues++;
	}
	
	return keepClues;
}
		


function addClue(clue){
	Add = document.createElement("P");
	if(clue.type=='direct'){
		if(clue.firstProperty.category=='nationality'){
			if(clue.secondProperty.category=='pets'){
				Add.innerText = "The "+clue.firstProperty.value+" person has a "+clue.secondProperty.value+".";
			}else if(clue.secondProperty.category=='house'){
				Add.innerText = "The "+clue.firstProperty.value+" person has a "+clue.secondProperty.value+" house.";
			}
		}else if(clue.firstProperty.category=='pets'){
			Add.innerText = "The person with a "+clue.firstProperty.value+" lives in a "+clue.secondProperty.value+" house.";
		}
	}else if(clue.type=='anti'){
		if(clue.firstProperty.category=='nationality'){
			if(clue.secondProperty.category=='pets'){
				Add.innerText = "The "+clue.firstProperty.value+" person does not have a "+clue.secondProperty.value+".";
			}else if(clue.secondProperty.category=='house'){
				Add.innerText = "The "+clue.firstProperty.value+" person does not have a "+clue.secondProperty.value+" house.";
			}
		}else if(clue.firstProperty.category=='pets'){
			Add.innerText = "The person with a "+clue.firstProperty.value+" does not live in a "+clue.secondProperty.value+" house.";
		}
	}

	document.getElementById("clueBox").appendChild(Add);
}


makePuzzle(cats);





function lookUpIndex(catName){
	for(var i=0;i<cats.length;i++){
		if(cats[i].name==catName){
			return i;
			i=cats.length;
		}
	}
}


function getRandInt(min, max){
	min =Math.ceil(min);
	max=Math.floor(max);
	return Math.floor(Math.random()*(max-min))+min
}


function permute(arr){
	var perm = [];

	while(arr.length>0){
		var ind=getRandInt(0,arr.length);
		perm.push(arr[ind]);
		arr.splice(ind, 1);
	}
	
	return perm;
}
