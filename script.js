$(document).ready(function(){
   
  var imageURLprefix = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185";
  var trailerURLprefix = "http://www.youtube.com/watch?v=";
  var globalMovieArray = [];
  var numberOfMovies = null;
  var searchedName = null;
  var getGeneralDone = true,
	  getTaglineDone = false,
	  getTrailerDone = true,
	  getCastDone = true;
  var taglineStartsCounter = 0,
	  taglineCompletesCounter = 0,
	  trailerCounter = 0,
	  castCounter = 0;

  function resetGlobalVars() {
		globalMovieArray = [];
		numberOfMovies = null;
		searchedName = null;
		getGeneralDone = false;
		getTaglineDone = false;
		getTrailerDone = false;
		getCastDone = false;
		taglineStartsCounter = 0;
		taglineCompletesCounter = 0;
		trailerCounter = 0;
		castCounter = 0;
	};
	  
  function MovieObject(id) {
	this.id = id;
	this.title = "";
	this.releaseYear = "";
	this.posterURL = "";
	this.averageVotes = "";
	this.cast = [];
	this.director = "";
	this.tagline = "";
	this.overview = "";
	this.trailer = "";
  }
  
  function logGlobalMovieArray () {
	for(var i = 0; i < numberOfMovies; i++){
		var m = globalMovieArray[i];
		console.log("i: "+i);
		console.log("id: "+m.id);
		console.log("title: "+m.title);
		console.log("releaseYear: "+m.releaseYear);
		console.log("posterURL: "+m.posterURL);
		console.log("averageVotes: "+m.averageVotes);
		console.log("cast: "+m.cast);
		console.log("director: "+m.director);
		console.log("tagline: "+m.tagline);
		console.log("overview: "+m.overview);
		console.log("trailer: "+m.trailer);
	}
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
  
   function getMovieIDs (searchedName) { //Get movie IDs from searchedName and create movie objects with proper movieID but blank other properties. Then callback to startStage2APICalls();
		//resetGlobalVars();
		$.getJSON("https://api.themoviedb.org/3/search/movie?api_key=75d3deb3734e06d103614d18e226d65c&query='"+searchedName+"&callback=?", function (json) {
			makeMovieObjects(json);
			startStage2APICalls(); // This is a callback.
		});
   };

   function makeMovieObjects (json) { //Make movie objects with proper movie ID, and with other properties empty.
		numberOfMovies = json.results.length;
		for (var i = 0; i < numberOfMovies; i++){
			var movieID = json.results[i].id;
			var newMovie = new MovieObject(movieID);
			globalMovieArray.push(newMovie);
		}
   };

	function getGeneral () { //API call for title, releaseYear, etc.
		$.getJSON("https://api.themoviedb.org/3/search/movie?api_key=75d3deb3734e06d103614d18e226d65c&query='"+searchedName+"&callback=?", function (json) {
			for (var i = 0; i < numberOfMovies; i++) {
				globalMovieArray[i].title = json.results[i].title;
				globalMovieArray[i].releaseYear = ((json.results[i].release_date).substring(0,4));
				globalMovieArray[i].posterURL = imageURLprefix + json.results[i].poster_path;
				globalMovieArray[i].averageVotes = json.results[i].vote_average;
			}
			getGeneralDone = true;
		});
	};
	
	function getTagline () { // (Promise flag not working; data upload is working) API call for overview and tagline.
		for(var i = 0; i < numberOfMovies; i++){
			var movieID = globalMovieArray[i].id;
			taglineStartsCounter = i;
			$.getJSON("https://api.themoviedb.org/3/movie/" + movieID + "?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
				globalMovieArray[taglineStartsCounter].overview = json.overview;
				globalMovieArray[taglineStartsCounter].tagline = json.tagline;
				taglineStartsCounter += 1;
				if(taglineCompletesCounter === numberOfMovies){
					console.log("Firing line 119 where taglineCompletesCounter === numberOfMovies");
					getTaglineDone = true;
				}}).done(function () {taglineCompletesCounter += 1; console.log("In .done");});
		}
		//anything here is fired when JSON is initiated; this is not a callback here.
	};
	
	function getTrailer () { // (Promise flag not working; data upload is working) API call for overview and tagline.
		for(var i = 0; i < numberOfMovies; i++){
			var movieID = globalMovieArray[i].id;
			trailerCounter = i;
			$.getJSON("https://api.themoviedb.org/3/movie/" + movieID + "/trailers?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
					if(json.youtube[0]){ //if there is a trailer, store it in movie object within globalMovieArray.
					var	trailerURLfinal = trailerURLprefix + json.youtube[0].source
					globalMovieArray[trailerCounter].trailer = trailerURLfinal;
					//console.log("globalMovieArray[trailerCounter].trailer: "+globalMovieArray[trailerCounter].trailer);
					}
					if(trailerCounter === numberOfMovies){
						getTrailerDone = true;
					}
			});
		}
		//this is firing before the getJSON data is all returned.
	};
	
	function getCast() { // (Promise flag not working; data upload is working) API call to get top four cast and director.
		castCounter = 0;
		for(var i = 0; i < numberOfMovies; i++){
			var movieID = globalMovieArray[i].id;
				$.getJSON("https://api.themoviedb.org/3/movie/" + movieID + "/casts?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
					for(var b = 0; b < 4; b++){ //first 4 cast members are "starring" roles.
						if(json.cast[b]){ //if there's a json cast object there, upload it.
						globalMovieArray[castCounter].cast[b] = json.cast[b].name;
						}
					}
					for(var c = 0; c < json.crew.length; c++){
						if(json.crew[c].job == "Director"){
							globalMovieArray[castCounter].director = json.crew[c].name;
						}
					}
					castCounter += 1; //This is the callback--happens when the call is complete.
					if(castCounter === numberOfMovies){
						getCastDone = true;
					}
				});
		//This line runs before the callbacks come back.
		}
	};
	
	function startStage2APICalls() {
		//getGeneral();
		getTagline();
		//getTrailer();
		//getCast();
		
		waitForPromises();
	};
   
   function displayHTML() {//Build this after coordinate API asynchronous checkpoints.
		console.log("In displayHTML function.");
   };
   	
	//exclusive-or
	// if ( ( x && y ) || (!x && !y) ){ } else { code here}
	
	function checkPromises() {
		if(getGeneralDone && getTaglineDone && getTrailerDone && getCastDone) {
			return true;
		}
		return false;
	};
	
	function waitForPromises() {
		console.log("checkPromises():"+checkPromises());
		if(checkPromises()){
			logGlobalMovieArray();
			displayHTML();
		} else { //if not, wait 1/4 second and call itself;
			setTimeout(function () {
				waitForPromises();
			}, 250);
		} 
	};
	
});