$(document).ready(function(){
   
  var imageURLprefix = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185";
  var imageURLfinal = "";
  //var movieSearchname = "Howard the Duck";
  var movieId = null;
  var trailerURLprefix = "http://www.youtube.com/watch?v=";
  var trailerURLfinal = "";  
  
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
		movieId = json.results[0].id;
		console.log("movieId: "+ movieId);
		//retrieved the movieId from movie name search
				//using movieId to launch API for cast info using "/3/movie/{id}/casts?..."
				//this has to be nested per http://stackoverflow.com/questions/1739800/variables-set-during-getjson-function-only-accessible-within-function
				$.getJSON("https://api.themoviedb.org/3/movie/" + movieId + "/casts?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
				console.log(json);
				//get first cast member
				console.log("First cast member: "+ json.cast[0].name);
					//get first four (4) cast members--this is what "The Movie Database" shows as Starring.
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
	console.log("Hey:"+movieId); // Was the global variable changed?--No. Something to do with asynchronous nature 
	//of getJSON?? 

	});
	}
	
  callAPI("Dirty Dancing");
	
});
