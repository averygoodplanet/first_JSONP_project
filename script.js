$(document).ready(function(){
   
  var imageURLprefix = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185";
  var trailerURLprefix = "http://www.youtube.com/watch?v=";
  var globalMovieHash = {};
  var numberOfMovies = 2; //for testing purposes, limit to small number of results. // need to change in resetGlobalVars() after testing.
  var searchedName = null;
  var currentKey = null;
 	  
  function resetGlobalVars() {
		numberOfMovies = 2;
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
		}
		);
	};
	
	function getTrailer () { // API call for movie trailer URL.
		var movieID = currentKey;
		$.getJSON("https://api.themoviedb.org/3/movie/" + movieID + "/trailers?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
				if(json.youtube[0]){ //if there is a trailer, store it in movie object within globalMovieHash.
				var	trailerURLfinal = trailerURLprefix + json.youtube[0].source;
				globalMovieHash[currentKey].trailer = trailerURLfinal;
				}
			globalMovieHash[currentKey].remaining -= 1;
			}
		);
	};
	
	function getCast() { // API call to get top four cast and director.
		var movieID = currentKey;
			$.getJSON("https://api.themoviedb.org/3/movie/" + movieID + "/casts?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
				globalMovieHash[currentKey].cast = [];
				for(var b = 0; b < 4; b++){ //first 4 cast members are "starring" roles.
					if(json.cast[b]){ //if there's a json cast object there, upload it.
					globalMovieHash[currentKey].cast[b] = json.cast[b].name;
					}
				}
				globalMovieHash[currentKey].director = "";
				for(var c = 0; c < json.crew.length; c++){
					if(json.crew[c].job == "Director"){
						globalMovieHash[currentKey].director = json.crew[c].name;
					}
				}
				globalMovieHash[currentKey].remaining -= 1;
			});
	};
	
	function stage2APICalls() {
			for(key in globalMovieHash){
				currentKey = key;
				console.log("currentKey: "+currentKey);
				getGeneral(); //works for 1 movie and alone function
				getTagline(); //works for 1 movie and alone function
				getTrailer();
				getCast();
				wait1MovieComplete();
				//**Next
				// (2) Then start making wait1Movie() function within this for-loop to see if it 
				// works to wait till all calls are complete for each movie (current movie.remaining == 0).
				// (3) Then make sure that loop works with 2, 3, 10 movies. 
			}
		console.log("After for-loop: ");
		logGlobalMovieHash();
		//**After the loop, then will call displayHTML();
		//displayHTML();
	};
   
    function wait1MovieComplete () { 
		if(globalMovieHash[currentKey].remaining > 0){ 
			console.log("globalMovieHash[currentKey].remaining: "+globalMovieHash[currentKey].remaining);
			logGlobalMovieHash();
			setTimeout (function () {
				wait1MovieComplete();
			}, 250);
		} else {
			return true;
		}
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