                 var tim =0;
     var slideCount=0;
     var currentSlide=0;
     
               function nextSlide(){
           // clearInterval(tim);
           //$(this).disable();
            if(slideCount>1){
           stopSlides();
           disableNextPrev();
                                 var p = getNext();
                 $(".activeSlide").removeClass("activeSlide").fadeOut(800,function(){
                    $("#swrap"+p).fadeIn(800).addClass("activeSlide");
                    currentSlide = p;
                    $(".current").html(currentSlide+" / "+slideCount);
                                        $("#activeCaption").hide().html($("#caption"+p).html()).fadeIn(800);
                                        $(".nyroModal").css("zIndex",1);
                    $("#nM"+p).css("zIndex",1500);
                     playSlides();
                     enableNextPrev();
                 });
                }
            // tim = setInterval("nextSlide()",8000);   
           }
           
           function prevSlide(){
            if(slideCount>1){
            stopSlides();
            disableNextPrev();
             
                 var p = getPrev();
                 $(".activeSlide").removeClass("activeSlide").fadeOut(800,function(){
                    $("#swrap"+p).fadeIn(800).addClass("activeSlide");

                    
                    currentSlide = p;
                    $(".current").html(currentSlide+" / "+slideCount);
                    $("#activeCaption").hide().html($("#caption"+p).html()).fadeIn(800);
                    $(".nyroModal").css("zIndex",1);
                    $("#nM"+p).css("zIndex",1500);
                     playSlides();
                     enableNextPrev();
                 });
             
               // tim = setInterval("nextSlide()",8000);
               }
           }
           
           function disableNextPrev(){
            $(".next,.prev").click(function(){return false;})
           }
           
           function getNext(){
                if(currentSlide!=slideCount){
                    var ne =currentSlide+1 
                    return(ne);
                }else{
                    return(1);
                }
           }
           function getPrev(){
                if(currentSlide==1){
                    return(slideCount);
                }else{
                    pr = currentSlide-1
                    return(pr);
                }
           }
           
           function enableNextPrev(){
            $(".next").click(function(){
                nextSlide();
            })
            $(".prev").click(function(){
                prevSlide();
            })
           }
           
                    function stopSlides(){
                        if(auto=="auto"){
             clearInterval(tim);
             tim=false;
             }
           }
           function playSlides(){
            if(auto=="auto"){
            if(tim==false){
            tim=setInterval("nextSlide()",4000);
            }
            }
           }
                     function initSlides(startID){
            //alert("hello");
            slideCount = $("#slides_container li").size();
            currentSlide = startID;
            if(startID!=""){
                $("#swrap"+startID).addClass("activeSlide");
            }else{
                $("#swrap1").addClass("activeSlide");
            }
            //$(".swrap").hide();
            

            $(".current").html(currentSlide+" / "+slideCount);
            $(".activeSlide").fadeIn(800);
            $("#activeCaption").hide().html($("#caption"+startID).html()).fadeIn(800);
$("#nM"+startID).css("zIndex",1500);
            //tim = setInterval("nextSlide()",8000);
            if(slideCount>1){
            if(auto=="auto"){
            playSlides();
            }
            }else{
          disableNextPrev();
            }
            
            
           }
           
           //JQUERY STUFF
           
           
        $(function(){



            //$(window).load(function(){
                var winWidth = $(window).width();
            var winHeight = $(window).height();
            //$(".current").html($(window).width())
            var nWidth = winWidth - 366;
            var nHeight = winHeight - 120;
           // alert(nWidth)
           //$("#page_content").width(nWidth+"px").height(nHeight+"px");
           $("#page_content").width(nWidth+"px").height(nHeight+"px");
           $("#slides").width(nWidth+"px").height(nHeight+"px");
            function resizePC(){
            var winWidth = $(window).width();
            var winHeight = $(window).height();
            //alert(winWidth)
            var nWidth = winWidth - 366;
            var nHeight = winHeight - 120;
            //alert(nWidth)
           $("#page_content").width(nWidth+"px").height(nHeight+"px");
           $("#slides").width(nWidth+"px").height(nHeight+"px");
           
              //$('#slides').bAutoSize('resize',[true]);
              //$("#slides_container").bAutoSize('resize',[true]);              
           }
           
           
            
           var TO = false;
$(window).resize(function(){
 if(TO !== false)
    clearTimeout(TO);
 TO = setTimeout(resizePC, 200); //200 is time in miliseconds
});


if (window.DeviceOrientationEvent) {
  window.addEventListener('orientationchange', resizePC, false);
} 


           

            $("#slides").touchwipe({
wipeLeft: function() {
nextSlide();
},
wipeRight: function() {
prevSlide();
},
min_move_x: 20,
min_move_y: 20,
preventDefaultEvents: true
});
           
            
            $(".next").click(function(){
                nextSlide();
            })
            $(".prev").click(function(){
                prevSlide();
            })
            $(".swrap").hover(function(){
                stopSlides();
            },function(){
                //tim=setInterval("nextSlide()",8000);
                playSlides();
            })
            
            $(window).blur(function(){
               stopSlides(); 
            });
            $(window).focus(function(){
                 playSlides();
            })
            
            
            
            //$("#slides").addClass("playing");


            
            /*///////////////////////////////////*/
            
            $.nyroModalSettings({
		debug: false,
		
		endShowContent: function(elts, settings) {
	      
           stopSlides();
           if(slideCount>1){
           $("#nyroModalFull").prepend("<div id=\"MYDIV\" style=\"width:100%; height:100%; \" ><span style=\"width:31px; margin-left:40px; display:block; height:100%; position:absolute; \" id=\"MYPREV\"></span><span  style=\"width:31px;  display:block; height:100%; position:absolute;  right:40px;\" id=\"MYNEXT\"></span>           </div>");
           //alert($("#nyroModalBg").css("zIndex"));
	       $("#MYPREV, #MYNEXT").css("zIndex",3000);
           $("#MYPREV").click(function(){
	          $(".nyroModalPrev").click();
              $(".prev").click(); 
              stopSlides();
	       });
           $("#MYNEXT").click(function(){
	          $(".nyroModalNext").click(); 
              $(".next").click();
              stopSlides();
	       });
           }
           $(".nyroModalPrev,.nyroModalNext").hide();
            //elts.contentWrapper.css({ margin:"40px"})
           $("#nyroModalImg").click(function(){
            $.nyroModalRemove()
           });
           
		},
        endRemove: function(elts, settings){
          // $("#MYDIV").hide();
            
    playSlides();
            },
            showBackground: function (elts, settings, callback) {
			elts.bg.css({opacity:100,backgroundColor:"#262626"}).fadeTo(500, 1, callback);
		},
        hideContent: function(elts,settings,callback){
            $("#MYDIV").fadeOut();
            
            callback();
            }
        
        
        
	    });
        
        
$(".nyroModal").nyroModal({zIndexStart:2000,galleryLoop:true,closeButton:""});
        });
    