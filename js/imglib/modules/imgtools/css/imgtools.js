/********************************************************************
 * imgLib Image Tools v0.01 23.11.2009
 * Contact me at dev@jstoys.org.ua
 * Site: http://jstoys.org.ua/
 * This copyright notice MUST stay intact for use.
 ********************************************************************/

/************************ Image Tools ****************************/
var imageTools=function(){function z(){var a=document.getElementsByTagName("script")[0];c=window.location.href;c=c.substring(c.indexOf("#")+1).split("|");o=c.length>1?c[1]:o;c=decodeURI(c[0]);if(!c||c.length===0)return alert(e.errorLoadData),window.close(),!1;o&&(b.action+="&setConfig=configName");a.parentNode.insertBefore(createElement("script",{type:"text/javascript",async:!0,src:"../../imglib.php?getConfig"+(o?"="+o:"")+"&module=imgtools"}),a)}function A(){minTabs.init("tabs");if(!b.src)return alert(e.errorLoadData),
window.close(),!1;var a=new Image;a.onload=function(){i=a.width;j=a.height;b.imgResizeOpt.loadingSrc=b.loadingIndicator;imageResizer.init(b.src,b.imgResizeOpt);u();$(q).src=b.src;imageCropper.init(q,b.imgCropOpt);$(p).src=b.src;translateLabels(e.labels);k();a.onload=function(){}};a.onerror=function(){alert(e.errorLoadData);window.close();return!1};addEvent($("resize_content_tab"),"click",function(){imageCropper.hide();setTimeout(function(){imageResizer.setWidth(h)},200)});addEvent($("crop_content_tab"),
"click",function(){B()});addEvent($("rotate_content_tab"),"click",function(){if(b.src&&!rotateFlipImage.getState()){var a={imageSrc:b.src,previewURL:b.action+(b.action.indexOf("?")==-1?"?":"&")+b.previewArg+"=1",previewImageURLArg:b.srcArg,previewRotateArg:b.rotateArg,previewFlipArg:b.flipArg};b.imgRotateFlipOpt=extend(b.imgRotateFlipOpt,a||{});rotateFlipImage.init(p,b.imgRotateFlipOpt);$(r).checked=$(s).checked=!1}imageCropper.hide()});addEvent($("apply_resize"),"click",function(){C()});addEvent($("apply_crop"),
"click",function(){D()});addEvent($("apply_rotate_flip"),"click",function(){E()});addEvent($("reset_resize"),"click",function(){imageResizer.reset()});addEvent($("rotate_ccw"),"click",function(a){l(0,-90);cancelEvent(a)});addEvent($("rotate_cw"),"click",function(a){l(0,90);cancelEvent(a)});addEvent($(r),"click",function(){l(1)});addEvent($(s),"click",function(){l(1)});addEvent($("reset_rotate_flip"),"click",function(a){l(-1,0);cancelEvent(a)});addEvent($("close_button"),"click",function(a){window.close();
cancelEvent(a)});addEvent(window,"resize",u);m();a.src=b.src}function u(){var a=getWindowGeometry(),b=$("resize_content"),f=$("crop_content"),b=b.style.display==""?w:f.style.display==""?x:y,b=getElPos($(b)),f=b.width,b=a.height-getElPos($("footer")).height-b.top-10;$(w).style.height=b+"px";$(x).style.height=b+"px";$(y).style.height=b+"px";a.width>0&&i>f-10||j>b-10?(h=i/f-10>j/b-10?f-10:i/(j/b)-10,$(q).style.width=h+"px",$(p).style.width=h+"px",setTimeout(function(){imageResizer.setWidth(h)},200)):
h=i}function v(){if(!b.src)return!1;var a=new Image;a.onload=function(){i=a.width;j=a.height;u();$("image_resize").src=$(p).src=$(q).src=a.getAttribute("src");imageResizer.reloadImage();imageResizer.setWidth(h);imageCropper.resetPos();imageCropper.reloadImage();imageCropper.hide();l(-1);a.onload=function(){}};a.src=b.src+(b.src.indexOf("?")==-1?"?":"&")+"rnd="+Math.random()}function B(){b.src&&setTimeout(function(){imageCropper.resetPos()},100)}function D(){if(b.src){var a=imageCropper.getCrop();
if(a.X2-a.X1>0||a.Y2-a.Y1>0)m(e.cropImageWait),a="cmd=edit&"+b.srcArg+"="+encodeURIComponent(c)+"&"+b.dstArg+"="+encodeURIComponent(c)+"&"+b.cropArg+"="+a.X1+","+a.Y1+","+(a.X2-a.X1)+","+(a.Y2-a.Y1),sendXMLHttpReq(b.action,{mode:"POST",parameters:a,onsuccess:function(a){a.responseText!="OK"?alert(e.errorPrefix+a.responseText):v();k()}})}}function C(){if(b.src){var a=imageResizer.getSize(),d=a.height,a=a.width;if(a>0&&d>0&&(a!=i||d!=j))m(e.resizeImageWait),a="cmd=edit&"+b.srcArg+"="+encodeURIComponent(c)+
"&"+b.dstArg+"="+encodeURIComponent(c)+"&"+b.resizeArg+"="+a+","+d,sendXMLHttpReq(b.action,{mode:"POST",parameters:a,onsuccess:function(a){a.responseText!="OK"?alert(e.errorPrefix+a.responseText):v();k()}})}}function E(){if(b.src&&!(d==0&&n==-1||d==180&&n==2)){m(e.rotateFlipImageWait);var a="cmd=edit&"+b.srcArg+"="+encodeURIComponent(c)+"&"+b.dstArg+"="+encodeURIComponent(c)+"&"+b.rotateArg+"="+d+"&"+b.flipArg+"="+n;sendXMLHttpReq(b.action,{mode:"POST",parameters:a,onsuccess:function(a){a.responseText!=
"OK"?alert(e.errorPrefix+a.responseText):v();k()}})}}function l(a,c){if(rotateFlipImage.getState()){if(!b.src)return!1;if(a==0)d+=parseInt(c),d%=360,d=d<0?d+360:d,m(e.loadingPreview),rotateFlipImage.rotate(d);else if(a==1){var f=$(s),g=$(r);n=f.checked==!0&&g.checked==!0?2:g.checked==!0?0:f.checked==!0?1:-1;m(e.loadingPreview);rotateFlipImage.flip(n)}else rotateFlipImage.reset(),d=0,n=-1,$(r).checked=$(s).checked=!1;f=$(p);d==90||d==270?(f.style.height=h+"px",f.style.width=""):(f.style.width=h+"px",
f.style.height="");return!0}}function m(a,c,d){var a=a||e.loading,g=$(t);if(!g){c=c||"#fff";d=d||"#000";g=document.createElement("div");g.id=t;with(g.style)position="absolute",height=width="100%",left=top="0";g.innerHTML='<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: '+c+';"></div><div style="position: relative; margin: 0 auto; width: 100%; top: 50%; text-align: center; color: '+d+'; font-weight: bold; "><img src="'+b.loadingIndicator+'" aligh="center" /><span></span></div>';
document.body.appendChild(g);setTransparency(g.getElementsByTagName("div")[0],70)}g.getElementsByTagName("span")[0].innerHTML=a;g.style.display=""}function k(){if($(t))$(t).style.display="none"}var b={uploadPath:void 0,action:"../../imglib.php?module=imgtools",srcArg:"src",dstArg:"dst",previewArg:"preview",resizeArg:"resize",cropArg:"crop",rotateArg:"rotate",flipArg:"flip",loadingIndicator:"loading.gif",imgResizeOpt:{id:"image_resize",loadingSrc:"loading.gif",saveProportion:!0,chSizeStep:5,minBarScale:1,
maxBarScale:200},imgCropOpt:{overlay:{show:!0},cropArea:{borderWidth:"1"},dragSquare:{show:!0},cropAreaGrid:{show:!0,opacity:20},onCrop:function(a){if(b.src)$("crop_sel_start").innerHTML=a.X1+","+a.Y1,$("crop_sel_end").innerHTML=a.X2+","+a.Y2}},imgRotateFlipOpt:{onRotate:function(){k()},onFlip:function(){k()}},msg:{errorLoadData:"Error loading data!",cropImageWait:"Crop image. Please wait.",resizeImageWait:"Resize image. Please wait.",rotateFlipImageWait:"Rotate/Flip image. Please wait.",loadingPreview:"Loading preview....",
errorPrefix:"Error: ",loading:"Loading...."}},e=b.msg,i,j,h,d=0,n=-1,q="image_crop",p="rotate_flip_img",r="flip_h",s="flip_v",w="resize_edit_area",x="crop_edit_area",y="rotate_edit_area",t="LoadingStatus",c,o;return{init:function(a){b=extend(b,a||{});b.src=b.uploadPath+getURIEncPath(c);A()},loadConfig:function(){addEvent(window,"load",z)}}}();imageTools.loadConfig();
/************************ Tabs support ***************************/

/*
	Minimal Tabs
	Ver. 0.1
	dev@jstoys.org.ua
*/
var minTabs=function(){function d(a){return document.getElementById(a)}function c(a,b){return a.getElementsByTagName(b)}function e(a){for(var a=c(c(d(a),"ul")[0],"li"),b=0,f=a.length;b<f;b++)a[b].className="",d(a[b].getElementsByTagName("a")[0].getAttribute("rel")).style.display="none"}return{init:function(){var a=arguments.length;if(a!=0)if(a>1)for(;--a>=0;)this.init(arguments[a]);else{var b=arguments[0];if(a=c(d(b),"ul")[0])a.onclick=function(a){var a=a||window.event,a=a.target||a.srcElement,c= d(a.getAttribute("rel"));if(c)e(b),c.style.display="",a.parentNode.className="active";return!1},e(b),a=a.getElementsByTagName("li")[0],a.className="active",d(a.getElementsByTagName("a")[0].getAttribute("rel")).style.display=""}}}}();

/************************ Resize suport **************************/

/*
	Image resize script
	Ver 0.0141
	dev@jstoys.org.ua
*/
var imageResizer=function(){function v(){c=parseInt($(j).value);f=parseInt($(k).value)}function o(){$(j).value=c;$(k).value=f;w&&w(imageResizer.getSize())}function x(){with($(p).style)width=c+"px",height=f+"px"}function y(){v();l==1?g&&(f=parseInt(c*(e.height/e.width))):l==2&&g&&(c=parseInt(f*(e.width/e.height)));c=c<1||isNaN(c)||typeof c!="number"?1:c;f=f<1||isNaN(f)||typeof f!="number"?1:f;o();x();q()}function z(a,b){v();var b=g?1:b,d,h=parseInt(e.width*(r/100))<=0?Math.ceil(1/(e.width/100)):r;
b==1||g?d=c/e.width:b==2&&(d=f/e.height);d*=100;d=C(a==0?d-h:d+h);d=d==i+r?r:d;d=d<=0?i:d;if(g||!g&&b==1)c=parseInt(e.width*(d/100));if(g||!g&&b==2)f=parseInt(e.height*(d/100));o();x();q()}function q(){var a,b;a=c/e.width;a=a<=0||isNaN(a)?i/100:a;a=C(parseInt(a*100));b=f/e.height;b=b<=0||isNaN(b)?i/100:b;b=C(parseInt(b*100));getElPos(s);$(E).innerHTML=(a<=0?i:a)+" %";a=a>h?h:a;$(A).style.left=getElPos(s).left+a-getElPos(A).width/2+"px";getElPos(t);$(F).innerHTML=(b<=0?i:b)+" %";b=b>h?h:b;$(B).style.left=
getElPos(t).left+b-getElPos(B).width/2+"px"}function G(){$(u).checked?(g=!0,D()):g=!1}function D(){$(j).value=e.width;$(k).value=e.height;v();x();$(u).checked=g;q()}function H(a){var b=new Image,d=$(p);b.onload=function(){var a=b.width,d=b.height,c;$(j).value=a;$(k).value=d;$(p).setAttribute("src",b.src);$(p).src=b.src;c=a>d?{width:a/d,height:1}:{width:1,height:d/a};e.width=a;e.height=d;$(I).innerHTML=a>d?c.width.toFixed(2)+"x"+c.height:c.width+"x"+c.height.toFixed(2);D();b.onload=function(){}};b.src=
a||d.getAttribute("src")}function N(){q()}function O(a){if(m){a=fixEvent(a);v();if(m==1){var b=a.pageX-getElPos(s).left,b=b>h?h:b<=0?i:b;c=parseInt(e.width*(b/100));g&&(f=parseInt(e.height*(b/100)))}else m==2&&(b=a.pageX-getElPos(t).left,b=b>h?h:b<=0?i:b,g&&(c=parseInt(e.width*(b/100))),f=parseInt(e.height*(b/100)));o();x();q();cancelEvent(a)}}function P(a){a=a||{};p=a.id||"image_resize";g=typeof a.saveProportion!="undefined"?a.saveProportion:!0;u=a.savePropId||"saveProp";j=a.widthInpId||"width";
k=a.heightInpId||"height";s=a.widthScaleBarId||"sizeBarW";A=a.widthScalePointerId||"sizePointerW";E=a.widthScaleLabelId||"widthScaleLabel";t=a.heightScaleBarId||"sizeBarH";B=a.heightScalePointerId||"sizePointerH";F=a.heightScaleLabelId||"heightScaleLabel";J=a.widthSizeDecId||"sizeDecW";K=a.widthSizeIncId||"sizeIncW";L=a.heightSizeDecId||"sizeDecH";M=a.heightSizeIncId||"sizeIncH";I=a.imgPropId||"imgProp";r=a.chSizeStep||5;i=a.minBarScale||1;h=a.maxBarScale||200;w=a.onResize||w}var p,n,u,j,k,s,A,E,
t,B,F,J,K,L,M,I,e={},g,r,i,h,m,l,c,f,w,C=Math.round;return{init:function(a,b){if(a)P(b),addEvent($(j),"keyup",function(){l=1;y()}),addEvent($(k),"keyup",function(){l=2;y()}),addEvent($(u),"change",G),addEvent($(u),"click",G),addEvent($(J),"click",function(){z(0,1)}),addEvent($(K),"click",function(){z(1,1)}),addEvent($(L),"click",function(){z(0,2)}),addEvent($(M),"click",function(){z(1,2)}),addEvent($(A),"mousedown",function(a){m=1;cancelEvent(a)}),addEvent($(B),"mousedown",function(a){m=2;cancelEvent(a)}),
addEvent(document,"mouseup",function(){m=null}),addEvent(document,"mousemove",O),addEvent(window,"resize",N),$(s).style.width=h+"px",$(t).style.width=h+"px",H(a),n=!0},getSize:function(){if(!n)return!1;return{width:c,height:f}},reset:function(){if(!n)return!1;return D()},reloadImage:function(){if(!n)return!1;return H()},setWidth:function(a){if(!n)return!1;c=parseInt(a);o();l=1;return y()},setHeight:function(a){if(!n)return!1;f=parseInt(a);o();l=2;return y()}}}();

/************************ Crop suport ***************************/

/*
	Image crop script
	Ver 0.0271
	dev@jstoys.org.ua
	Opera cursor hack from imgAreaSelect jQuery plugin by Michal Wojciechowski, http://odyniec.net/
*/
var imageCropper=function(){function G(a){a=fixEvent(a);s=a.pageX;t=a.pageY;q=!1;h=a.pageY-c.top;l=a.pageX-c.left;m=h;o=l;if(!k){n=document.createElement("div");k=document.createElement("div");k.className=ea;n.className=fa;if(A){var e=document.createElement("div");e.className=ga;e.innerHTML='<div class="tl"></div><div class="tr"></div><div class="br"></div><div class="bl"></div><div class="tc"></div><div class="rc"></div><div class="bc"></div><div class="lc"></div>';for(var b=e.getElementsByTagName("div"), d=b.length;d-- >0;)b[d].style.border=H+"px solid "+I,b[d].style.background=J,setTransparency(b[d],K)}if(B)for(d=4;d-- >0;)j[d]=document.createElement("div"),j[d].style.background=L,j[d].className=ha,k.appendChild(j[d]),setTransparency(j[d],M);a=document.createElement("div");document.createElement("div");a.className=ia;a.innerHTML='<div class="t"></div><div class="r"></div><div class="b"></div><div class="l"></div>';for(var b=a.getElementsByTagName("div"),g=d=b.length,f="0 0 0 "+C+"px 0 0 0";d-- > 0;){with(b[d].style)border=C+"px "+N+" "+O,borderWidth=f.substring(2*(g-1-d),f.length-2*d);setTransparency(b[d],P)}if(Q)b=document.createElement("div"),d=document.createElement("div"),g=document.createElement("div"),f=x+"px "+R+" "+S,b.className=ja,d.className=ka,d.style.border=f,d.style.borderWidth="0 "+x+"px",g.className=la,g.style.border=f,g.style.borderWidth=x+"px 0",b.appendChild(d),b.appendChild(g),setTransparency(d,D),setTransparency(g,D),n.appendChild(b);n.appendChild(a);A&&n.appendChild(e); if(T){e=document.createElement("div");e.id=i+U+V;with(e.style)height="100%",position="absolute",width="100%";n.appendChild(e)}with(k.style)top=c.top+"px",left=c.left+"px",width=c.width+"px",height=c.height+"px";q=!1;addEvent(k,"mousedown",E);addEvent(n,"mousedown",E);addEvent(document,"mousemove",ma);k.appendChild(n);$(i).parentNode.appendChild(k)}W();k.style.display="none";$(i).style.cursor="crosshair";r=!1}function X(){if(!r)k.style.display="",r=!0;with(n.style)top=h+"px",left=l+"px",width=o-l+ "px",height=m-h+"px";if(B){j[0].style.height=h+"px";with(j[1].style)top=h+"px",left=o+"px",width=c.width-o+"px",height=m-h+"px";with(j[2].style)top=m+"px",height=c.height-m+"px";with(j[3].style)top=h+"px",width=l+"px",height=m-h+"px"}Y&&(toggle(n),toggle(n));u&&u(imageCropper.getCrop())}function E(a){if(r){var a=fixEvent(a),e=c.left+l,b=c.top+h,d=c.left+o,g=c.top+m;q=!1;if(a.pageY<b-f||a.pageX<e-f||a.pageX>d+f||a.pageY>g+f)p=$(i),G(a),cancelEvent(a);else if(a.pageY<b+f||a.pageX<e+f||a.pageX>d-f|| a.pageY>g-f){s=y(e,d);t=y(b,g);s=a.pageX-f>s?y(e,d):Z(e,d);t=a.pageY-f>t?y(b,g):Z(b,g);if((a.pageY<b+f||a.pageY>g-f)&&a.pageX>e+f&&a.pageX<d-f)q="w";else if((a.pageX<e+f||a.pageX>d-f)&&a.pageY>b+f&&a.pageY<g-f)q="h";p=$(i)}else p=n,aa=a.pageY-(c.top+h),ba=a.pageX-(c.left+l)}else p=$(i),G(a);cancelEvent(a)}function na(){p&&v&&v(imageCropper.getCrop());p=null}function ma(a){var a=fixEvent(a),e=c.left+l,b=c.top+h,d=c.left+o,g=c.top+m;if(!p&&r){var j;a.pageY<b+f?j=a.pageX<e+f?"nw":a.pageX>d-f?"ne":"n": a.pageY>g-f?j=a.pageX<e+f?"sw":a.pageX>d-f?"se":"s":a.pageX<e+f?j="w":a.pageX>d-f&&(j="e");$(i).style.cursor=k.style.cursor=j?j+"-resize":"move";T&&toggle(i+U+V)}if(p)if(p.id==i){e=s-c.left;d=t-c.top;t>a.pageY?(g=d,d=a.pageY-c.top):g=a.pageY-c.top;s>a.pageX?(b=e,e=a.pageX-c.left):b=a.pageX-c.left;q=="w"?(e=l,b=o):q=="h"&&(d=h,g=m);d<0&&(d=0);e<0&&(e=0);if(b>c.width)b=c.width;if(g>c.height)g=c.height;b-e<F||g-d<F||(l=e,o=b,h=d,m=g,X());cancelEvent(a)}else p.id==n.id&&(e=a.pageX-c.left-ba,b=a.pageY- c.top-aa,d=m-h,g=o-l,b<0&&(b=0),b+d>c.height&&(b=c.height-d),e<0&&(e=0),e+g>c.width&&(e=c.width-g),h=b,m=b+d,l=e,o=e+g,X(),cancelEvent(a))}function ca(){var a=getElPos(i);c.top=a.top;c.left=a.left;c.width=a.width;c.height=a.height;if(k){with(k.style)top=c.top+"px",left=c.left+"px",width=c.width+"px",height=c.height+"px";imageCropper.hide()}}function da(){var a=new Image;a.onload=function(){c.realWidth=a.width;c.realHeight=a.height;a.onload=function(){}};a.src=$(i).src}function W(){l=h=o=m=0;u&&u(imageCropper.getCrop()); v&&v(imageCropper.getCrop())}var s=0,t=0,l=0,h=0,o=0,m=0,ba=0,aa=0,c={},p=null,i,w,U="_croper",V="_opera_fix",ea="imgCroper",fa="cropArea",ga="drawSq",ha="overlay",ia="border",ja="drawGrid",ka="drawGridW",la="drawGridH",B,L,M,C,N,O,P,A,J,I,H,K,F,f,Q,x,R,S,D,u=null,v=null,q=!1,T=window.opera?!0:!1,Y=navigator.appName=="Microsoft Internet Explorer"?!0:!1,k,n,j=[],r=!1,z=Math.round,Z=Math.max,y=Math.min;return{init:function(a,e){if(a&&$(a)){i=a;var b;b=e||{};b.overlay=b.overlay||{};b.cropArea=b.cropArea|| {};b.dragSquare=b.dragSquare||{};b.cropAreaGrid=b.cropAreaGrid||{};with(b)B=typeof overlay.show!="undefined"?overlay.show:!0,L=overlay.backgroundColor||"#000",M=overlay.opacity||50,C=cropArea.borderWidth||1,N=cropArea.borderStyle||"dashed",O=cropArea.borderColor||"#fff",P=cropArea.borderOpacity||100,A=typeof dragSquare.show!="undefined"?dragSquare.show:!0,J=dragSquare.background||"#81bee7",I=dragSquare.borderColor||"blue",H=dragSquare.borderWidth||1,K=dragSquare.opacity||75,Q=typeof cropAreaGrid.show!= "undefined"?cropAreaGrid.show:!0,x=cropAreaGrid.width||1,R=cropAreaGrid.style||"solid",S=cropAreaGrid.color||"#ddd",D=cropAreaGrid.opacity||30;F=b.minDragStart||0;f=b.cornerSize||10;u=b.onCrop||u;v=b.onCropEnd||v;addEvent($(i),"mousedown",E);addEvent(document,"mouseup",na);addEvent(window,"resize",ca);b=getElPos(i);c={top:b.top,left:b.left,width:b.width,height:b.height,src:$(i).src};da();Y&&$(i).setAttribute("galleryimg","no");$(i).style.cursor="crosshair";w=!0}},getCrop:function(){if(!w)return!1; if(r){var a=c.realWidth/c.width,e=c.realHeight/c.height;return{X1:z(l*a),Y1:z(h*e),X2:z(o*a),Y2:z(m*e)}}return{X1:0,Y1:0,X2:0,Y2:0}},resetPos:function(){if(!w)return!1;return ca()},reloadImage:function(){if(!w)return!1;return da()},hide:function(){if(!w)return!1;r=!1;W();$(i).style.cursor="crosshair";return k?k.style.display="none":!0}}}();

/************************ Rotate/Flip suport **********************/

/*
	Image rotate & flip script
	Ver 0.011
	dev@jstoys.org.ua
	For Microsoft Internet Explorer the <xml:namespace ns="urn:schemas-microsoft-com:vml" prefix="v" /> must be placed alfer <body> tag
	and add this to style table "v\:image { behavior:url(#default#VML); display:inline-block;}"
	Tested IE 5
*/
var rotateFlipImage=function(){function w(a,b){if(a){preloadImg=new Image;if(typeof b=="function")preloadImg.onload=function(){b(preloadImg)};preloadImg.src=a}}function u(){if(n){e=document.createElement("v:image");e.src=d;with(e.style);}else e=document.createElement("canvas"),g=e.getContext("2d");c.parentNode.insertBefore(e,c.nextSibling);c.style.display="none";return!0}function x(a){h=a;if(n)e.style.flip=a==0?"x":a==1?"y":a==2?"x y":"",rotateImage(i);else{if(a==-1)return!0;var b=0,c=0,f=1,d=1;a!= 0&&(c=j-1,d=-1);a!=1&&(b=k-1,f=-1);g.translate(b,c);g.scale(f,d)}return!0}function v(a,b){e.style.width=a+"px";e.style.height=b+"px";n||(e.setAttribute("width",a),e.setAttribute("height",b));return!0}function D(a){a=a||{};d=a.imageSrc||d;s=a.previewURL||"index.php";y=a.previewImageURLArg||"src";z=a.previewRotateArg||"rotate";A=a.previewFlipArg||"flip";o=a.onRotate||o;p=a.onFlip||p}function q(){return{angle:i,flip:h}}var t=function(){var a=!1;try{a=!!document.createElement("canvas").getContexts("2d")}catch(b){try{a= !!document.createElement("canvas").getContext}catch(e){}}return a}(),n=navigator.userAgent.toLowerCase().indexOf("msie")!=-1?!0:!1,r=!1,c,d,f,k,j,l,m,e=null,g,h=-1,i=0,s,y,z,A,o=null,p=null,B=Math.sin,C=Math.cos,t=n?!0:t;rotateImage=function(){return t&&!n?function(a){e||u();a=parseInt(a);a=isNaN(a)?0:a;a%=360;var a=(a<0?a+360:a)*Math.PI/180,b=k*l*B(a),c=k*l*C(a),d=j*m*B(a),i=j*m*C(a),c=(c<0?-c:c)+(d<0?-d:d),b=(b<0?-b:b)+(i<0?-i:i);v(c,b);g.save();g.translate(c/2,b/2);g.rotate(a);g.scale(l,m);g.translate(-k/ 2,-j/2);x(h);g.drawImage(f,0,0);g.restore();o&&o(q())}:n?function(a){e||u();a=parseInt(a);a=isNaN(a)?0:a;a%=360;a=a<0?a+360:a;if(h==0||h==1)a=-a;v(k*l,j*m);e.style.rotation=a;o&&o(q())}:function(a){a=parseInt(a);a=isNaN(a)?0:a;a%=360;var a=a<0?a+360:a,b;b=a==0&&h==-1||a==180&&h==2?d:s+(s.indexOf("?")==-1?"?":"&")+y+"="+encodeURIComponent(d)+"&"+z+"="+a+"&"+A+"="+h;w(b,function(){c.src=b;o&&o(q())})}}();flipImage=function(){return t&&!n?function(a){e||u();a=a!=-1&&a!=1&&a!=2?0:a;i!=0?(h=a,rotateImage(i)): (v(k*l,j*m),g.save(),g.scale(l,m),x(a),g.drawImage(f,0,0),g.restore());p&&p(q())}:n?function(a){e||u();a=a!=-1&&a!=1&&a!=2?0:a;v(k*l,j*m);x(a);p&&p(q())}:function(a){h=a!=-1&&a!=1&&a!=2?0:a;var b;b=i==0&&h==-1||i==180&&h==2?d:s+(s.indexOf("?")==-1?"?":"&")+y+"="+encodeURIComponent(d)+"&"+z+"="+i+"&"+A+"="+h;w(b,function(){c.src=b;p&&p(q())})}}();return{init:function(a,b){if(a&&$(a))c=$(a),D(b),d=d||c.getAttribute("src"),t?(w(d,function(){f.width>0&&(r=!0);k=f.width;j=f.height;c.offsetWidth>0?(l=c.offsetWidth/ k,m=c.offsetHeight/j):l=m=1;f.onload=function(){}}),f=new Image,f.onload=function(){f.width>0&&(r=!0);k=f.width;j=f.height;c.offsetWidth>0?(l=c.offsetWidth/k,m=c.offsetHeight/j):l=m=1;f.onload=function(){}},f.src=d):r=!0},rotate:function(a){if(r)return i=a,rotateImage(a);return!1},flip:function(a){if(r)return flipImage(a);return!1},getState:function(){if(r)return q();return!1},reset:function(){if(r)return h=-1,i=0,rotateImage(0),!0;return!1}}}();