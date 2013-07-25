$(document).ready(function(){
   
  var imageURLprefix = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185";
  var imageURLfinal = "";
  var movieSearchname= "Howard the Duck";
  var movieId = null;
  
   //testing API calls for 1st movie returned on movie name search using ".../3/search/movie?api_key=###&query='movie name'..."
   $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=75d3deb3734e06d103614d18e226d65c&query='"+movieSearchname+"&callback=?"
, function(json) {
	console.log(json);
	console.log("title: " + json.results[0].title);
	console.log("release_date substring to release year: " + (json.results[0].release_date).substring(0,4));
	console.log("posterURL: " + (imageURLprefix + json.results[0].poster_path));
	imageURLfinal = imageURLprefix + json.results[0].poster_path;
	console.log("imageURLfinal: " + imageURLfinal);
	$("#poster").html('<img src=' + imageURLfinal +' >');
	movieId = json.results[0].id;
	console.log("movieId: "+ movieId);
	//retrieved the movieId from movie name search
			//using movieId to launch API for cast info using "/3/movie/{id}/casts?..."
			//this has to be nested per http://stackoverflow.com/questions/1739800/variables-set-during-getjson-function-only-accessible-within-function
			$.getJSON("https://api.themoviedb.org/3/movie/" + movieId + "/casts?api_key=75d3deb3734e06d103614d18e226d65c&callback=?", function(json) {
			console.log(json);
			});
	});
	

 });
