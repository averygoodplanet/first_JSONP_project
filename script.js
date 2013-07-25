$(document).ready(function(){
   
  var imageURLprefix = "http://d3gtl9l2a4fn1j.cloudfront.net/t/p/w185";
  var imageURLfinal = "";
  
   //testing API calls for 1st movie returned on movie name search "/3/search/movie?api_key=###&query='movie name'..."
   $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=75d3deb3734e06d103614d18e226d65c&query='Top Gun'&callback=?"
, function(json) {
	console.log(json);
	console.log("title: " + json.results[0].title);
	console.log("release_date substring to release year: " + (json.results[0].release_date).substring(0,4));
	console.log("posterURL: " + (imageURLprefix + json.results[0].poster_path));
	imageURLfinal = imageURLprefix + json.results[0].poster_path;
	$("#poster").html("<img src=imageURLfinal >");
	});
 });

/* $(document).ready( function () {
	var description_array = {
		term: "cream puffs",
		location: "650 Mission St*San Francisco* CA",
		ywsid: "c_DiXp-d5eEttXsSIfY9Tg",
		};

	function generateURL () { 
		var trailingEndURL = jQuery.param(description_array);
		var formattedURL = "http://api.yelp.com/business_review_search?" + trailingEndURL;
		return formattedURL;
	};
	
	console.log("output:"+generateURL());
	
	var requestURL = "http://api.yelp.com/business_review_search?term=cream%20puffs&location=650%20Mission%20St%2ASan%20Francisco%2A%20CA&ywsid=c_DiXp-d5eEttXsSIfY9Tg";
	
	$.ajax({
		dataType: "jsonp",
		url: requestURL,
		success: function (data) {
			console.log(data)
		}
	});
	
	$.getJSON(generateURL(), function (data) {
		console.log(data.businesses[0].name);
	});
	
});
*/