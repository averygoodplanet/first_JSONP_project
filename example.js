$(document).ready(){
	var window.m = function(){
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
};