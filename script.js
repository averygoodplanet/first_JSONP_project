$(document).ready( function () {
	console.log("within document ready function");
	var description_array = {
		term: "cream puffs",
		location: "650 Mission St*San Francisco* CA",
		ywsid: "c_DiXp-d5eEttXsSIfY9Tg",
		};
		
	var formattedURL = null;

	function generateURL () { 
		console.log("within generateURL()");
		var trailingEndURL = jQuery.param(description_array);
		formattedURL = "http://api.yelp.com/business_review_search?" + trailingEndURL;
		console.log("formattedURL="+formattedURL);
	};

	generateURL();




});