$(document).ready(function(){
	console.log("In the ready function"); 
    $.getJSON("https://api.themoviedb.org/3/search/movie?api_key=75d3deb3734e06d103614d18e226d65c&query='Top Gun'&callback=?"
, function(json) {
	console.log("In the getJSON function");
	console.log(json);
	$("body").append("<img id='thePoster'	src='json[0].posters[0].image.url' />");
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