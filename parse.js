function addClue(clue){
	Add = document.createElement("P");
	var firstNoun='';
	var secondNoun='';
	var verb = '';
	var order = getRandInt(0,2);
	if(order==0){
		if(cats[lookUpIndex(clue.firstProperty.category,cats)].usage!='name'){
			var hold=clue.firstProperty;
			clue.firstProperty=clue.secondProperty;
			clue.secondProperty=hold;
		}
	}
	firstInd = lookUpIndex(clue.firstProperty.category,cats);
	secondInd=lookUpIndex(clue.secondProperty.category,cats);
	
	if(cats[firstInd].usage=='possession'){
		if(cats[firstInd].article){
			firstNoun = 'The person with a '+clue.firstProperty.value+cats[firstInd].addon;
		}else{
			firstNoun = 'The person with '+clue.firstProperty.value+cats[firstInd].addon;
		}
	}else if(cats[firstInd].usage =='name'){
		firstNoun = clue.firstProperty.value+cats[firstInd].addon;
	}else if(cats[firstInd].usage == 'adjective'){
		firstNoun = 'The '+clue.firstProperty.value+cats[firstInd].addon+' person';
	}else if(cats[firstInd].usage=='classify'){
		if(cats[firstInd].article){
			firstNoun = 'The '+clue.firstProperty.value+cats[firstInd].addon;
		}else{
			firstNoun = clue.firstProperty.value+cats[firstInd].addon;
		}
	}else if(cats[firstInd].usage == 'enjoyment'){
		firstNoun = 'The person who likes '+clue.firstProperty.value+cats[firstInd].addon;
	}
	if(cats[secondInd].article){
		secondNoun = 'a '+clue.secondProperty.value+cats[secondInd].addon+'.';
	}else{
		secondNoun = clue.secondProperty.value+cats[secondInd].addon+'.';
	}
	
	if(clue.type=='direct'){
		if(cats[secondInd].usage=='possession'){
			verb = ' has ';
		}else if(cats[secondInd].usage=='enjoyment'){
			verb = ' likes ';
		}else{
			verb = ' is ';
		}
	}else if(clue.type=='anti'){
		if(cats[secondInd].usage=='possession'){
			verb = ' does not have ';
		}else if(cats[secondInd].usage=='enjoyment'){
			verb = ' does not like ';
		}else{
			verb = ' is not ';
		}
	}
	
	Add.innerText = firstNoun + verb + secondNoun;
	document.getElementById("clueBox").appendChild(Add);
}