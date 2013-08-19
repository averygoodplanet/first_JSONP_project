$(document).ready(function(){
   
  var imageURLprefix = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185";
  var trailerURLprefix = "http://www.youtube.com/watch?v=";
  var globalMovieArray = [];
  var numberOfMovies = null;
  var searchedName = null;
  var getGeneralDone, getTaglineDone, getTrailerDone, getCastDone = false; 
  
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
		console.log("globalMovieArray.length: "+globalMovieArray.length);
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

	function getGeneral () {
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
	
	function getTagline () {
		for(var i = 0; i < numberOfMovies; i++){
			var movieID = globalMovieArray[i].id;
			$.getJSON("https://api.themoviedb.org/3/movie/" + movieID + "?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
				globalMovieArray[i].overview = json.overview;
				globalMovieArray[i].tagline = json.tagline;
			});
		}
		getTaglineDone = true;
	};
	
	function getTrailer () {
	
	};
	
	function getCast() {
	
	};
	
	function startStage2APICalls() {
		console.log("In startStage2APICalls function.");
		getGeneral();
		getTagline();
		getTrailer();
		getCast();
	};
   
   function displayHTML() {
		console.log("In displayHTML function.");
   };
   	 
});