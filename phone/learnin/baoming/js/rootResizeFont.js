//自适应手机
(function () {

	var rootHtml = $(":root");

	var rootResize = function () {

		var fontSize = $(window).width() < 640 ? $(window).width() / 16 : 40;

		//if(fontSize>=67.5) fontSize = 67.5;

		rootHtml.css("font-size", fontSize);

	}

	rootResize();

	$(window).resize(function () {

		rootResize();



	});

})();
//自适应手机结束
