var getUsfm = require('./getUsfm.js');

var result = [];

var markerOccurOnce = ["id", "ide", "h", "toc1", "toc2", "toc3", "mt"],
	markerRepeating = ["p", "c", "v", "s5"];

var temp = [];

exports.findMarker = function(lines){	
	for (var i = 0; i < lines.length; i++) {
		var marker = lines[i].marker;
		var line = lines[i];
		temp.push(marker.split().join(" "))	
		checkMarker(marker, line);
		// ordercheck(line)

	}
	// finding missing markers from comparing markerOccuronce with temp
	var missingMarkerOccurOnce = markerOccurOnce.filter(v => temp.indexOf(v) == -1);
	var missingMarkerRepeating = markerRepeating.filter(v => temp.indexOf(v) == -1);
	var missingMarkersArr = missingMarkerOccurOnce.concat(missingMarkerRepeating);
	if(missingMarkersArr.length == 1){
		console.log("Error: Missing markers from the given files is "+missingMarkersArr)
	}
	else if(missingMarkersArr.length > 1){
		console.log("Error: Missing markers from the given files are "+missingMarkersArr)
	}
}

var tag_id = 0,
	tag_ide = 0,
	tag_h = 0,
	tag_toc1 = 0,
	tag_toc2 = 0,
	tag_toc3 = 0,
	tag_mt = 0,
	tag_c = 0,
	tag_p = 0,
	tag_v = 0;

var invalid_id = false,
	invalid_ide = false,
	tag_h = false,
	invalid_toc1 = false,
	invalid_toc2 = false,
	invalid_toc3 = false,
	invalid_mt = false;

var verseNum = [],
	chapNum = [];

var book = {};

function checkMarker(marker, line){
	// console.log(line)
	if((marker === 'id')){
		// if marker is found then check the validation for the marker value
		count = line.count;
		var markerID = line.value.split(" ")[0];
     	var regEx = /(\d[A-Z]{2})|(\w[A-Z]{2})/;

     	if ((!markerID.match(regEx))&& (tag_id === 0)){
       		console.log("Warning: The \\id marker is not validated according to minimum usfm requirement in line "+count+" ---> "+"'"+markerID+"'");
	       	console.log("The CODE is a standard 3 letter scripture book abbreviation found here:");
	       	console.log("http://ubsicap.github.io/usfm/identification/books.html");   	
     	}
		tag_id ++;
		book.id = markerID;
		// ordercheck(line);
	}
	else if((tag_id == 2)){
		count = line.count;
		tag_id ++;
		console.log("id is available in multiple times "+count);
	}
	
	if((marker === 'ide')){
		count = line.count;
		var markerIde = line.value;
		var regEx = /(UTF-8|UTF-16|CP-1252|CP-1251)/;

		if((!markerIde.match(regEx))&& (tag_ide === 0)){
                console.log("Error: The \\ide marker should contain a character encoding specification in line "+ count);
            }
		tag_ide ++;
	}
	else if((tag_ide == 2)){
		count = line.count;
		tag_ide ++;
		invalid_ide = true;
		console.log("Error: Marker ide is showing more than one times....");
	}

	if((marker === 'h')){
		count = line.count;
		tag_h ++;
	}
	else if((tag_h == 2)){
		count = line.count;
		tag_h ++;
		invalid_h = true;
		console.log("h is available in multiple times");
	}

	if((marker === 'toc1')){
		count = line.count;
		tag_toc1 ++;
	}
	else if((tag_toc1 == 2)){
		count = line.count;
		tag_toc1 ++;
		invalid_toc1 = true;
		console.log("toc1 is available in multiple times");
	}

	if((marker === 'toc2')){
		count = line.count;
		tag_toc2 ++;
	}
	else if((tag_toc2 == 2)){
		count = line.count;
		tag_toc2 ++;
		invalid_toc2 = true;
		console.log("toc2 is available in multiple times");
	}

	if((marker === 'toc3')){
		count = line.count;
		tag_toc3 ++;
	}
	else if((tag_toc3 == 2)){
		count = line.count;
		tag_toc3 ++;
		invalid_toc3 = true;
		console.log("toc3 is available in multiple times");
	}

	if((marker === 'mt')){
		count = line.count;
		tag_mt ++;
	}
	else if((tag_mt == 2)){
		count = line.count;
		tag_mt ++;
		invalid_mt = true;
		console.log("mt is available in multiple times");
	}

	//marker \\c check
    if(marker === 'c'){
        var markerC = line.value;
        count = line.count;
        chapNum.push(markerC);
        tag_c ++;
        chapterCheck();
        ordercheck(line);
    }

    //marker \\p check
    if(marker === 'p'){
        var markerPara = line.value;
        count = line.count;
        tag_p ++;
        ordercheck(line);
    }

    //marker \\v check
    if(marker === 'v'){
        var markerVerse = line.number;
        count = line.count;
        verseNum.push(markerVerse);
        tag_v ++;
        // verseCheck()
        ordercheck(line);
    }

}

var book = {};
var chapter = {};
var flag = 0;
var currentChap;
var verseArray = [];

function ordercheck(line){
	if(line.marker === 'id' && flag == 0){
		book["id"] = line.value.split(" ")[0];
		flag +=1;
	}

	if(line.marker === 'c'){
		currentChap = line.value;
		chapter[line.value] = line.value;
	}
	
	if(line.marker === 'v'){
		verseArray.push(line.number);
	}
	chapter[currentChap] = verseArray;
	// // currentChap = 0
	// verseArray = []
	book["c"] = chapter
	// console.log(chapter)
	console.log(book)
}

// chapter number order check
//missing chapter number
function chapterCheck(){
    var missing;
    for(j=1; j <= chapNum.length; j++){
        if(chapNum[j-1]!= j){
            missing = j;
            console.log( "The missing Chapter number is " + missing)
        }
    }
}

