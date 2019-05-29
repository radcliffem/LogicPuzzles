var allSolutions=[];
var solution = [];
var solved = false;
var allClues=[];
var cats=[];
var reducible = true;



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


function pickCategories(width,height){
	cats.push(names);
	while(names.values[0].length>height){
		names.values[0].pop();
	}
	options = permute(options);
	for(var i=0;i<width-1;i++){
		cats.push(options[i]);
		options[i].values[0]=permute(options[i].values[0]);
		while(options[i].values[0].length>height){
			options[i].values[0].pop();
		}
	}
}


function makePuzzle(cats){
	
	allSolutions=generatePossible(cats[0].values,cats[1].values);
	for(var i=2;i<cats.length;i++){
		allSolutions = generatePossible(allSolutions,cats[i].values);
	}
	solution=allSolutions[getRandInt(0,allSolutions.length-1)];
	makeGrid(solution);
		
 	allClues = generateClues(solution);
	allClues=permute(allClues);
	var possibleSolutions=allSolutions;
		
	var keepClues = [];
	var numClues = 0;
	var newPossible = [];
	var newClue = []
	
	while(solved==false){
		newPossible = [];
		newClue = allClues[numClues];
		
		newPossible = processClue(newClue, possibleSolutions);
		
		if(newPossible.length<possibleSolutions.length){
			keepClues.push(newClue);
			possibleSolutions = newPossible;
		}
		if(possibleSolutions.length==1){
			solved=true;
		}
		numClues++;
	}

	keepClues = reduceClues(keepClues);
	
	for(var i=0;i<keepClues.length;i++){
		addClue(keepClues[i]);
	}
	
}
		

function reduceClues(clues){
	while(reducible){
		for(var i=0;i<clues.length;i++){
			var test = Array.from(clues);
			test.splice(i,1);
			var possibleSolutions = Array.from(allSolutions);
			for(var j=0;j<test.length;j++){
				possibleSolutions = processClue(test[j],possibleSolutions);
			}
			if(possibleSolutions.length==1){
				i=clues.length;
				clues = test;
			}
			if(i==clues.length-1){
				reducible = false;
			}
		}
	}
	return clues;
}



pickCategories(4,4);
makePuzzle(cats);


function processClue(clue,solutionSet){

	if(clue.type=='anti'){
		return checkAnti(clue,solutionSet);
	}else if(clue.type=='direct'){
		return checkDirect(clue,solutionSet);
	}
}


function checkDirect(clue, solutionSet){
	firstInd = lookUpIndex(clue.firstProperty.category);
	secondInd=lookUpIndex(clue.secondProperty.category);
	var usable =[];
	
	for(var i=0;i<solutionSet.length;i++){
		for(var j=0;j<solutionSet[i].length;j++){
			if(solutionSet[i][j][firstInd]==clue.firstProperty.value){
				if(solutionSet[i][j][secondInd]==clue.secondProperty.value){
					usable.push(solutionSet[i]);
					j=solutionSet[i].length;
				}
			}
		}	
	}
	return usable;
}


function checkAnti(clue,solutionSet){
	firstInd = lookUpIndex(clue.firstProperty.category);
	secondInd=lookUpIndex(clue.secondProperty.category);
	
	var usable = [];
	for(var i=0;i<solutionSet.length;i++){
		for(var j=0;j<solutionSet[i].length;j++){
			if(solutionSet[i][j][firstInd]==clue.firstProperty.value){
				if(solutionSet[i][j][secondInd]!=clue.secondProperty.value){
					usable.push(solutionSet[i]);
					j=solutionSet[i].length;
				}
			}
		}
	}
	return usable;
}




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
