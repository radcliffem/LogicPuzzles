




function lookUpIndex(item, arr){
	for(var i=0;i<arr.length;i++){
		if(arr[i].name==item){
			return i;
			i=arr.length;
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



//generate all possible combinations between list1 and list2. Each should be
//presented as a list of lists of lists. That is to say, list1 is a list, 
//containing all combinations of the first n-1 categories. Each solution is a
//list of lists, containing the rows for each item.

function generatePossible(list1, list2){
	orderings = heapPerms(list2[0].length-1,list2[0],[]);
	possible = [];
	for(var i=0;i<orderings.length;i++){
		for(var j=0;j<list1.length;j++){
			var newSol = [];
			var pair = [];
			for(k=0;k<list1[j].length;k++){
				pair=list1[j][k].concat(orderings[i][k]);
				newSol.push(pair);
			}
			possible.push(newSol);
		}
	}
	return possible;
}


//Generate all possible permutations of an array, arr, and store them in a set
//(presented as an array) called set. Returns set, filled with permutations.

function heapPerms(n, arr, set){
	if(n>0){
		heapPerms(n-1, arr, set);
		for(var i=0; i<=n-1; i++){
			if(n%2==1){
				arr=swap(arr, i, n);
			}else{
				arr=swap(arr, 0, n);
			}
			heapPerms(n-1, arr, set);
		}
	}else{
		set.push(Array.from(arr));
	}
	return set;
}


//Exchange positions i and j in an array

function swap(arr, i, j){
	hold = arr[i];
	arr[i]=arr[j];
	arr[j]=hold;
	return arr
}