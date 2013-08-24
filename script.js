$(document).ready(function(){
   
  var imageURLprefix = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185";
  var trailerURLprefix = "http://www.youtube.com/watch?v=";
  var globalMovieHash = {};
  var numberOfMovies = 1; //for testing purposes, limit to small number of results. // need to change in resetGlobalVars() after testing.
  var searchedName = null;
  var currentKey = null;
 	  
  function resetGlobalVars() {
		numberOfMovies = 1;
		currentKey = null;
		//Don't reset searchedName here--it is reset in event handlers.
	};
  
  $("#search").keypress(function (event) { //Calls getMovieIDs when ENTER pressed in input box, then clears input box.
    if(event.which == 13) { //13 is for ENTER key
		searchedName = document.getElementById("search").value;
		getMovieIDs(searchedName);
		$(this).val("");
	}
	});

  $("#submit").on('click', function () { //Calls getMovieIDs when #submit button ('Go!') is clicked and then clears the input field.
	searchedName = document.getElementById("search").value;
	getMovieIDs(searchedName);
	$("#search").val("");
  });	

 function makeHashKeys(json) { //Creates keys(from MovieID) in the hash and assigns id, originalOrder, incompleteAPICalls as values to each key.
	//numberOfMovies = json.results.length;
		for(var i=0; i < numberOfMovies; i++){
			var MovieID = json.results[i].id;
			globalMovieHash[MovieID] = {}; //the MovieID is used as the keys in the hash.
			globalMovieHash[MovieID].originalOrder = i;
			globalMovieHash[MovieID].id = MovieID;
			globalMovieHash[MovieID].remaining = 4; // Represents getGeneral(), getTagline(), getTrailer(), getCast();
		}
		logGlobalMovieHash();
 };

 function logGlobalMovieHash () {
	for(key in globalMovieHash){
		console.dir(globalMovieHash[key]);
	}
 };
 
   function getMovieIDs (searchedName) { //Get movie IDs from searchedName. Make movie IDs into globalMovieHash keys.
		resetGlobalVars();
		$.getJSON("https://api.themoviedb.org/3/search/movie?api_key=75d3deb3734e06d103614d18e226d65c&query='"+searchedName+"&callback=?", function (json) {
			makeHashKeys(json);
			console.log("original json: ");
			console.log(json);
			stage2APICalls();
		});
   };

	function getGeneral () { //API call for title, releaseYear, etc.
		$.getJSON("https://api.themoviedb.org/3/search/movie?api_key=75d3deb3734e06d103614d18e226d65c&query='"+searchedName+"&callback=?", function (json) { //Everything here is a callback and everything in the function runs after the request is complete
				//console.log("json: ");
				//console.log(json);
				var order = globalMovieHash[currentKey].originalOrder;
				//console.log("order: "+order);
				globalMovieHash[currentKey].title = json.results[order].title;
				globalMovieHash[currentKey].releaseYear = ((json.results[order].release_date).substring(0,4));
				globalMovieHash[currentKey].posterURL = imageURLprefix + json.results[order].poster_path;
				globalMovieHash[currentKey].averageVotes = json.results[order].vote_average;
				//console.log("getGeneralcallback:");
				globalMovieHash[currentKey].remaining -= 1;
				//logGlobalMovieHash();
			}
		);
	};
	
	function getTagline () { // API call for overview and tagline.
		var movieID = currentKey;
		$.getJSON("https://api.themoviedb.org/3/movie/" + movieID + "?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
			//console.log("json in getTagline(): ");
			//console.log(json);
			globalMovieHash[currentKey].overview = json.overview;
			globalMovieHash[currentKey].tagline = json.tagline;
			globalMovieHash[currentKey].remaining -= 1;
			//console.log("getTagline's callback: ");
			//logGlobalMovieHash();
		}
		);
	};
	
	function getTrailer () { // (Promise flag not working; data upload is working) API call for overview and tagline.
		for(var i = 0; i < 2; i++){
			var movieID = globalMovieHash[i].id;
			trailerCounter = i;
			$.getJSON("https://api.themoviedb.org/3/movie/" + movieID + "/trailers?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
					console.dir(json);
					if(json.youtube[0]){ //if there is a trailer, store it in movie object within globalMovieHash.
					var	trailerURLfinal = trailerURLprefix + json.youtube[0].source
					globalMovieHash[trailerCounter].trailer = trailerURLfinal;
					//console.log("globalMovieHash[trailerCounter].trailer: "+globalMovieHash[trailerCounter].trailer);
					}
					if(trailerCounter === 2){
						getTrailerDone = true;
					}
			});
		}
		//this is firing before the getJSON data is all returned.
	};
	
	function getCast() { // (Promise flag not working; data upload is working) API call to get top four cast and director.
		castCounter = 0;
		for(var i = 0; i < 2; i++){
			var movieID = globalMovieHash[i].id;
				$.getJSON("https://api.themoviedb.org/3/movie/" + movieID + "/casts?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
					console.log("Cast callback: ");
					console.dir(json);
					for(var b = 0; b < 4; b++){ //first 4 cast members are "starring" roles.
						if(json.cast[b]){ //if there's a json cast object there, upload it.
						globalMovieHash[castCounter].cast[b] = json.cast[b].name;
						}
					}
					for(var c = 0; c < json.crew.length; c++){
						if(json.crew[c].job == "Director"){
							globalMovieHash[castCounter].director = json.crew[c].name;
						}
					}
					castCounter += 1; //This is the callback--happens when the call is complete.
					if(castCounter === 2){
						getCastDone = true;
					}
				});
		//This line runs before the callbacks come back.
		}
	};
	
	function stage2APICalls() {
			for(key in globalMovieHash){
				currentKey = key;
				console.log("currentKey: "+currentKey);
				//getGeneral(); //works for 1 movie and alone function
				//getTagline(); //works for 1 movie and alone function
			}
		//getGeneral();
		//getTagline();
		//getTrailer();
		//getCast();
		//waitForPromises();
	};
   
   function displayHTML() {//Build this after coordinate API asynchronous checkpoints.
		console.log("In displayHTML function.");
   };
  	
	function checkPromises() {
		if(getGeneralDone && getTaglineDone && getTrailerDone && getCastDone) {
			return true;
		}
		return false;
	};
	
	function waitForPromises() {
		console.log("checkPromises():"+checkPromises());
		if(checkPromises()){
			logglobalMovieHash();
			displayHTML();
		} else { //if not, wait 1/4 second and call itself;
			setTimeout(function () {
				waitForPromises();
			}, 250);
		} 
	};
	
});