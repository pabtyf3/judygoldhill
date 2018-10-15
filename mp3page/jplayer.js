$(function(){
   $("#jquery_jplayer_1").jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				mp3: "/mp3page/andrea Kunder.mp3"
				
			});
		},
		play: function() { // To avoid both jPlayers playing together.
			$(this).jPlayer("pauseOthers");
		},
		repeat: function(event) { // Override the default jPlayer repeat event handler
			if(event.jPlayer.options.loop) {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					$(this).jPlayer("play");
				});
			} else {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerNext", function() {
					$("#jquery_jplayer_2").jPlayer("play", 0);
				});
			}
		},
		swfPath: "/js/jplayer",
		supplied: "mp3",
		wmode: "window"
	}); 
    
    //dick joyce.mp3
    
      $("#jquery_jplayer_2").jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				mp3: "/mp3page/dick joyce.mp3"
				
			});
		},
		play: function() { // To avoid both jPlayers playing together.
			$(this).jPlayer("pauseOthers");
		},
		repeat: function(event) { // Override the default jPlayer repeat event handler
			if(event.jPlayer.options.loop) {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					$(this).jPlayer("play");
				});
			} else {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerNext", function() {
					$("#jquery_jplayer_3").jPlayer("play", 0);
				});
			}
		},
		swfPath: "/js/jplayer",
		supplied: "mp3",
        cssSelectorAncestor: "#jp_container_2",
		wmode: "window"
	});  
    
      $("#jquery_jplayer_3").jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				mp3: "/mp3page/eric timmerman.mp3"
				
			});
		},
		play: function() { // To avoid both jPlayers playing together.
			$(this).jPlayer("pauseOthers");
		},
		repeat: function(event) { // Override the default jPlayer repeat event handler
			if(event.jPlayer.options.loop) {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					$(this).jPlayer("play");
				});
			} else {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerNext", function() {
					$("#jquery_jplayer_4").jPlayer("play", 0);
				});
			}
		},
		swfPath: "/js/jplayer",
		supplied: "mp3",
        cssSelectorAncestor: "#jp_container_3",
		wmode: "window"
	});  
          $("#jquery_jplayer_4").jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				mp3: "/mp3page/lori allen final.mp3"
				
			});
		},
		play: function() { // To avoid both jPlayers playing together.
			$(this).jPlayer("pauseOthers");
		},
		repeat: function(event) { // Override the default jPlayer repeat event handler
			if(event.jPlayer.options.loop) {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					$(this).jPlayer("play");
				});
			} else {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerNext", function() {
					$("#jquery_jplayer_5").jPlayer("play", 0);
				});
			}
		},
		swfPath: "/js/jplayer",
		supplied: "mp3",
        cssSelectorAncestor: "#jp_container_4",
		wmode: "window"
	});  
           $("#jquery_jplayer_5").jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				mp3: "/mp3page/pete marenfeld.mp3"
				
			});
		},
		play: function() { // To avoid both jPlayers playing together.
			$(this).jPlayer("pauseOthers");
		},
		repeat: function(event) { // Override the default jPlayer repeat event handler
			if(event.jPlayer.options.loop) {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					$(this).jPlayer("play");
				});
			} else {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerNext", function() {
					$("#jquery_jplayer_6").jPlayer("play", 0);
				});
			}
		},
		swfPath: "/js/jplayer",
		supplied: "mp3",
        cssSelectorAncestor: "#jp_container_5",
		wmode: "window"
	});  
    
          $("#jquery_jplayer_6").jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				mp3: "/mp3page/Chuck Duganf.mp3"
				
			});
		},
		play: function() { // To avoid both jPlayers playing together.
			$(this).jPlayer("pauseOthers");
		},
		repeat: function(event) { // Override the default jPlayer repeat event handler
			if(event.jPlayer.options.loop) {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					$(this).jPlayer("play");
				});
			} else {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerNext", function() {
					$("#jquery_jplayer_7").jPlayer("play", 0);
				});
			}
		},
		swfPath: "/js/jplayer",
		supplied: "mp3",
        cssSelectorAncestor: "#jp_container_6",
		wmode: "window"
	});  
    
        $("#jquery_jplayer_7").jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				mp3: "/mp3page/steve Pompea.mp3"
				
			});
		},
		play: function() { // To avoid both jPlayers playing together.
			$(this).jPlayer("pauseOthers");
		},
		repeat: function(event) { // Override the default jPlayer repeat event handler
			if(event.jPlayer.options.loop) {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					$(this).jPlayer("play");
				});
			} else {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerNext", function() {
					$("#jquery_jplayer_8").jPlayer("play", 0);
				});
			}
		},
		swfPath: "/js/jplayer",
		supplied: "mp3",
        cssSelectorAncestor: "#jp_container_7",
		wmode: "window"
	});  
            $("#jquery_jplayer_8").jPlayer({
		ready: function () {
			$(this).jPlayer("setMedia", {
				mp3: "/mp3page/tod lauer final.mp3"
				
			});
		},
		play: function() { // To avoid both jPlayers playing together.
			$(this).jPlayer("pauseOthers");
		},
		repeat: function(event) { // Override the default jPlayer repeat event handler
			if(event.jPlayer.options.loop) {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerRepeat", function() {
					$(this).jPlayer("play");
				});
			} else {
				$(this).unbind(".jPlayerRepeat").unbind(".jPlayerNext");
				$(this).bind($.jPlayer.event.ended + ".jPlayer.jPlayerNext", function() {
					$("#jquery_jplayer_1").jPlayer("play", 0);
				});
			}
		},
		swfPath: "/js/jplayer",
		supplied: "mp3",
        cssSelectorAncestor: "#jp_container_8",
		wmode: "window"
	});  
    
})
	