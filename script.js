$(document).ready(function(){
   
  var imageURLprefix = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185";
  var imageURLfinal = "";
  var movieId = null;
  var trailerURLprefix = "http://www.youtube.com/watch?v=";
  var trailerURLfinal = "";  
  var globalMoviearray = [];
  
var testCallAPI = function (movieSearchname) {
	    $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=75d3deb3734e06d103614d18e226d65c&query='"+movieSearchname+"&callback=?", function(json) { 
		//Initial search by movie name to return movie IDs
		var n = json.results.length;
		var completedProcess = 0;
		var arrayOfmovies = [];
		for (var i = 0; i < n; i++){ //Looping over each movie ID that was returned (and storing pieces of data provided by this API call).
			var movie = {};
			movie.title = json.results[i].title;
			movie.releaseYear = ((json.results[i].release_date).substring(0,4));
			movie.posterURL = imageURLprefix + json.results[i].poster_path;
			movie.averageVotes = json.results[i].vote_average;
			movie.movieId = json.results[i].id;
			arrayOfmovies.push(movie);
				$.getJSON("https://api.themoviedb.org/3/movie/" + movie.movieId + "/casts?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
				console.log("**Test of whether still movie.title: "+movie.title);
				console.log(json);
				//get first cast member
				console.log("First cast member: "+ json.cast[0].name);
					//get first four (4) cast members--this is what "The Movie Database" shows as "Starring".
				$(".starring > li").remove(); //removing previous cast members.
				for(var i = 0; i < 4; i++){
					console.log("The " +(i+1)+"th cast member: "+json.cast[i].name);
					$(".starring").append('<li>'+json.cast[i].name+'</li');
				}
				for(var i = 0; i < json.crew.length; i++){
					if(json.crew[i].job == "Director"){
						//console.log("Director:  "+json.crew[i].name);
						$(".director").html("Director: "+json.crew[i].name);
					}
				}
					//getting "basic movie information" via /3/movie/{id}
					$.getJSON("https://api.themoviedb.org/3/movie/" + movie.movieId + "?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
					//console.log(json);
					//console.log("Overview: "+json.overview);
					$(".overview_style").html("Overview: "+json.overview);
					//console.log("Tagline: "+json.tagline);
					$(".tagline").html('"'+json.tagline+'"');
						//getting trailer information via /3/movie/{id}/trailers
						$.getJSON("https://api.themoviedb.org/3/movie/" + movieId + "/trailers?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
						//console.log(json);
						//console.log("youtube trailer source: "+json.youtube[0].source);
						trailerURLfinal = trailerURLprefix + json.youtube[0].source;
						//console.log("trailerURLfinal: "+trailerURLfinal);
						$(".trailer").attr('href', trailerURLfinal);
						});
					
					});
				});
		//if(i == 6){break;}		
		}
		//console.log(arrayOfmovies);
		});
		}
  

  var callAPI = function (movieSearchname) {
	   //testing API calls for 1st movie returned on movie name search using ".../3/search/movie?api_key=###&query='movie name'..."
	   $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=75d3deb3734e06d103614d18e226d65c&query='"+movieSearchname+"&callback=?", function(json) {
		console.log(json);
		console.log("title: " + json.results[0].title);
		//Updating .title to "Movie Title (year)".
		$(".title").html(json.results[0].title+" ("+((json.results[0].release_date).substring(0,4))+ ")");
		console.log("release_date substring to release year: " + (json.results[0].release_date).substring(0,4));
		$(".title span").html("test");
		console.log("posterURL: " + (imageURLprefix + json.results[0].poster_path));
		imageURLfinal = imageURLprefix + json.results[0].poster_path;
		console.log("imageURLfinal: " + imageURLfinal);
		$(".poster").html('<img src=' + imageURLfinal +' >');
		console.log("vote_average: "+json.results[0].vote_average);
		$(".avg_votes").html("Average votes: "+json.results[0].vote_average);
		console.log("vote_count: "+json.results[0].vote_count);
		movieId = json.results[0].id; //this uses movieId of "0th" json.result to direct next API call. 
		console.log("movieId: "+ movieId);
		//retrieved the movieId from movie name search
				//using movieId to launch API for cast info using "/3/movie/{id}/casts?..."
				//this has to be nested per http://stackoverflow.com/questions/1739800/variables-set-during-getjson-function-only-accessible-within-function
				$.getJSON("https://api.themoviedb.org/3/movie/" + movieId + "/casts?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
				console.log(json);
				//get first cast member
				console.log("First cast member: "+ json.cast[0].name);
					//get first four (4) cast members--this is what "The Movie Database" shows as Starring.
				$(".starring > li").remove(); //removing previous cast members.
				for(var i = 0; i < 4; i++){
					console.log("The " +(i+1)+"th cast member: "+json.cast[i].name);
					$(".starring").append('<li>'+json.cast[i].name+'</li');
				}
				for(var i = 0; i < json.crew.length; i++){
					if(json.crew[i].job == "Director"){
						console.log("Director:  "+json.crew[i].name);
						$(".director").html("Director: "+json.crew[i].name);
					}
				}
					//getting "basic movie information" via /3/movie/{id}
					$.getJSON("https://api.themoviedb.org/3/movie/" + movieId + "?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
					console.log(json);
					console.log("Overview: "+json.overview);
					$(".overview_style").html("Overview: "+json.overview);
					console.log("Tagline: "+json.tagline);
					$(".tagline").html('"'+json.tagline+'"');
						//getting trailer information via /3/movie/{id}/trailers
						$.getJSON("https://api.themoviedb.org/3/movie/" + movieId + "/trailers?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
						console.log(json);
						console.log("youtube trailer source: "+json.youtube[0].source);
						trailerURLfinal = trailerURLprefix + json.youtube[0].source;
						console.log("trailerURLfinal: "+trailerURLfinal);
						$(".trailer").attr('href', trailerURLfinal);
						});
					
					});
				});

	});
	}

  $("#submit").on('click', function () { //Calls callAPI when #submit button ('Go!') is clicked and then clears the input field.
	var movieSearchname = document.getElementById("search").value;
	console.log("in .on function, movieSearchname: "+movieSearchname);
	callAPI(movieSearchname);
	$("#search").val("");
  });
	
  $("#search").keypress(function (event) { //Calls callAPI when ENTER pressed in input box, then clears input box.
    if(event.which == 13) { //13 is for ENTER key
		var movieSearchname = document.getElementById("search").value;
		callAPI(movieSearchname);
		$(this).val("");
	}
	});

	//from Justin's sample structure
	/*
	var window = function(){
		this.imgBaseUri = "";
		this.movieArr = [];
		this.returnIds = 0;
		this.step = 0;
		this.stepTwoProcessesComplete = 0;
		this.baseUrl = "";
		this.incrStep = function () {
			m.step += 1;
		};
		this.checkStep = function () {
			var two = m.stepTwoProcessesComplete,
				thr = 
				i = m.returnIds;
				if (twe === i && thr === i) {
					return true;
				}
				return false;
		};
		this.getMovieIds = function (term) {
			$.getJSON( m.baseUrl + m.apiKey + term + m.urlEnd, m.parseReTurnedMovieIds(json) );
		};
		this.parseReTurnedMovieIds = function (json) {
			var x, l;
			m.setReturnedIds(json.result.length);
			m.setStepOnedata(json);
			for ( x = 0, l = m.returnIds; x < l; x += 1 ) {
				m.setStepOneData(json.result[x])
			}
			m.stepThreeJsonWorker();
			for ( x = 0, l = m.returnIds; x < l; x += 1 ) {
				m.setStepthreeData(json.result[x])
			}
			m.stepThreeJsonWorker();
			m.parseHtmlOnCompletion();
		};
		this.setReturnedIds = function (num) {
			var n = num || 0;
			if (typeof n !== 'number') { n = 0; }
			m.returnIds = n;
		};
		this.setStepOneData = function (json) {
			var mv = new MovieObj();
			mv.id = json.id;
			mv.title = json.title;
			mv.title = json.title;
			mv.title = json.title;
			m.movieArr.push(mv);
			// ++ step two counter
		};
		this.stepTwoJsonWorker = function  () {
			ids = m.returnIds;
			for (var i = Things.length - 1; i >= 0; i--) {
				m.getStepTwoJson(id);
			};
			for (var i = Things.length - 1; i >= 0; i--) {
				m.getStepThreeJson(id);
			};
		};
		this.getStepTwoJson = function (id) {
			$.getJson( url + id + end, setStepTwoData(jaso, id));
		};
		this.setStepTwoData = function (json, id) {
			//do something with json and id;
			var idx = m.idToIndex(id);
			json[idx]
		}
		this.idToIndex = function (id) {
			var x = null;
			for (var i = Things.length - 1; i >= 0; i--) {
				if m.movieArr[i].id === id;
				set x = i;
				break
				return x;
			};
		}
		this.parseHtmlOnCompletion = function () {
			m.timeOut();
		}
		this.timeOut = function (){ setTimeOut(function () {
				if (m.checkStep) {
					m.parseHtml();
				} else {
					m.timeOut()
				}
			}, 100)};
		this.parseHtnl + function () {
			// build html objects 
		}
		window.MovieObj = {
			title : "";
			....
			....
			....
			....

		}
	};
    */
  
  var notfunctionobject = {
	basket: "lunch"
  }
  
  console.log(notfunctionobject.basket);
  
  var functionobject = function () {
	var this.fun "great times";
  };

  console.log(functionobject.fun);
  
//end bracket	
});