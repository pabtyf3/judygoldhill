function fade(f,I){function v(e){var g=e.fadeConf,f=g.current+g.step;f<g.stop&&g.step>0||f>g.stop&&g.step<0?(setTransparency(e,f),g.current=f,setTimeout(function(){v(e)},g.time)):(setTransparency(e,g.stop),g.handle&&g.handle(),delete g.current)}var f=$(f),e=extend({start:100,stop:0,step:5,time:400},I||{});e.time=Math.round(e.time/((e.start-e.stop)/e.step));e.start>e.stop&&(e.step*=-1);f.fadeConf=extend(f.fadeConf||{},e);if(!("current"in f.fadeConf))setTransparency(f,e.start),f.fadeConf.current=e.start,
setTimeout(function(){v(f)},e.time)}
function slide(f,I){function v(e){var g=e.fadeConf,f=g.current+g.step;f<g.stop&&g.step>0||f>g.stop&&g.step<0?(setTransparency(e,f),g.current=f,setTimeout(function(){v(e)},g.time)):(setTransparency(e,g.stop),g.handle&&g.handle(),delete g.current)}var f=$(f),e=extend({start:100,stop:0,step:5,time:400},I||{});e.time=Math.round(e.time/((e.start-e.stop)/e.step));e.start>e.stop&&(e.step*=-1);f.fadeConf=extend(f.fadeConf||{},e);if(!("current"in f.fadeConf))setTransparency(f,e.start),f.fadeConf.current=e.start,
setTimeout(function(){v(f)},e.time)}
var iGallery=function(){function f(a,d,b){var c=new Image;if(d)c.onload=function(){d(c);c.onload=function(){}};if(b)c.onerror=b;c.src=a;return c}function I(a){if(a){var d=function(a,d){if(w){var a=fixEvent(a),b;a.wheelDelta?b=a.wheelDelta/120:a.detail&&(b=-a.detail/3);b&&(d(b),cancelEvent(a))}};addEvent(window,"DOMMouseScroll",function(b){d(b,a)});addEvent(window,"mousewheel",function(b){d(b,a)});addEvent(document,"mousewheel",function(b){d(b,a)})}}function v(){var a=createElement("div",{className:"scrollLeft",
innerHTML:"&larr;",href:"#"}),d=createElement("div",{className:"scrollRight",innerHTML:"&rarr;",href:"#"}),e=createElement("div",{className:y+"prev",href:"#",innerHTML:"&larr;"}),f=createElement("div",{className:y+"next",href:"#",innerHTML:"&rarr;"}),g=createElement("div",{className:"inputs"}),h=createElement("div",{className:"caption"}),i=createElement("input",{type:"checkbox",id:"toggle_item_info",defaultChecked:b.showItemInfo}),l=createElement("label",{innerHTML:n[12],htmlFor:"toggle_item_info"}),
j=createElement("div",{className:"delay"}),m=createElement("span",{className:"delay_val",innerHTML:b.slideshowDelay}),u=createElement("span",{innerHTML:n[0]+":"}),q=createElement("div",{className:y+U+"inc",href:"#",innerHTML:"+"}),r=createElement("div",{className:y+U+"dec",href:"#",innerHTML:"-"}),s=createElement("div",{className:y+U+"exit",href:"#",innerHTML:"X",title:n[1]}),t=createElement("div",{className:y+U+"help",href:"#",innerHTML:"?",title:n[2]}),p=createElement("div",{className:"overlay"}),
v=createElement("span",{className:"box"});infoOverlayElement=p.cloneNode(1);x=createElement("div",{className:"igallery"});z=createElement("div",{className:"thumbnail"});L=createElement("div",{className:"body"});V=createElement("div",{className:"bottomContainer"});E=createElement("ul",{className:"messages"});A=createElement("div");A.appendChild(a);A.appendChild(d);z.appendChild(A);k=createElement("ul");z.appendChild(k);B=createElement("img");L.appendChild(B);M=createElement("div",{className:"info"});
ca=createElement("span",{className:"text"});v.appendChild(infoOverlayElement);v.appendChild(ca);M.appendChild(v);N=createElement("div",{href:"#",className:y+"play",innerHTML:n[3]});o=createElement("div",{className:"controll"});h.appendChild(i);h.appendChild(l);j.appendChild(u);j.appendChild(m);j.appendChild(q);j.appendChild(r);g.appendChild(j);g.appendChild(h);o.appendChild(e);o.appendChild(N);o.appendChild(f);o.appendChild(g);o.appendChild(s);o.appendChild(t);o.appendChild(p);o.appendChild(createElement("div",
{className:"clear"}));V.appendChild(M);V.appendChild(o);setTransparency(p,75);setTransparency(infoOverlayElement,75);addEvent(A,"mousedown",function(a){cancelEvent(fixEvent(a))});addEvent(A,"click",function(a){cancelEvent(fixEvent(a))});addEvent(k,"click",function(a){a=fixEvent(a);for(a=a.target;a;)if("galleryIndex"in a){c=a.galleryIndex;K();break}else a=a.parentNode});addEvent(k,"mouseover",function(a){a=fixEvent(a);for(a=a.target;a;)if("galleryIndex"in a){da(a.galleryIndex);break}else a=a.parentNode});
addEvent(k,"mouseout",function(a){a=fixEvent(a);for(a=a.target;a;)if("galleryIndex"in a){la(a.galleryIndex);break}else a=a.parentNode});addEvent(a,"click",va);addEvent(d,"click",wa);addEvent(e,"click",W);addEvent(N,"click",X);addEvent(f,"click",F);addEvent(s,"click",J);addEvent(t,"click",ma);addEvent(o,"mousemove",function(a){clearTimeout(G);cancelEvent(fixEvent(a))});addEvent(z,"mousemove",function(a){clearTimeout(G);cancelEvent(fixEvent(a))});addEvent(q,"click",function(){m.innerHTML=++b.slideshowDelay});
addEvent(r,"click",function(){if(b.slideshowDelay>1)m.innerHTML=--b.slideshowDelay});addEvent(i,"click",function(){b.showItemInfo=i.checked;ea()});addEvent(o,"mousedown",function(a){cancelEvent(fixEvent(a))});addEvent(window,"resize",na);addEvent(document,"keydown",function(a){a=fixEvent(a);if(w&&!a.ctrlKey&&!a.altKey)if(a.keyCode==32||a.charCode==32)X();else if(a.keyCode==34||a.keyCode==39||a.keyCode==40)F();else if(a.keyCode==33||a.keyCode==37||a.keyCode==38)W();else if(a.keyCode==27)J();else if(a.keyCode==
72)ma();else if(a.keyCode==73)i.checked=b.showItemInfo=!b.showItemInfo,ea()});I(function(a){a>0?W():F()});addEvent(x,"mousemove",oa);x.appendChild(z);x.appendChild(L);x.appendChild(V);x.appendChild(E)}function e(){O||(O=document.getElementsByTagName("body")[0]);x||v();k.style.right=0;P=[];var a=O.childNodes,d;for(d=a.length;d-- >0;)if(a[d].style)P.push([a[d],a[d].style.display]),a[d].style.display="none";O.appendChild(x);w=!0;na();a=window.location.hash;pa=a.indexOf("slideshow")!==1?a:"";l=b.elements;
h=l.length;h==0&&(alert(n[4]),J());c=b.startIndex||0;a=fa();a!==!1&&(c=a-1);p=-1;i=c;w=!0;Y();for(a=h;a-- >0;)if(!l[a].title)l[a].title=l[a].src.substr(l[a].src.lastIndexOf("/")+1);K();k.innerHTML="";for(a=k.style.right=0;a<h;a++)if(d=l[a],d=createElement("li",{innerHTML:sprintf(n[6],b.thmbWidth,b.thmbHeight,u,d.th),galleryIndex:a,className:"loading"}),k.appendChild(d),setTransparency(d,b.thmbTransparency),a==0)q=getElPos(d).width,C=getElPos(k).left,j=r((m-C*2)/q),k.style.width=q*h+u,da(c),Q();b.autoPlay&&
(X(),H(n[5]));if(b.onShow)b.onShow(b)}function J(){var a;for(a=P.length;a-- >0;)P[a][0].style.display=P[a][1];clearTimeout(G);clearInterval(R);for(a=h;a-- >0;)"thL"in l[a]&&delete l[a].thL;O.removeChild(x);w=!1;Y();if(b.onExit)b.onExit(b)}function g(){if(ga.length>0&&!Z&&w){var a=ga.shift(),d=l[a];!("thL"in d)&&k.childNodes[a]?(Z=!0,f(d.th,function(c){var e=c.width/c.height,f=aa,h=aa,i=0,j=k.childNodes[a],l=j.getElementsByTagName("img")[0];e>b.thmbWidth/b.thmbHeight?(f=b.thmbWidth+u,i=s((b.thmbHeight-
b.thmbWidth/e)/2)):h=b.thmbHeight+u;d.thL=1;l.src=c.src;l.style.width=f;l.style.height=h;l.style.top=i+u;j.className="";Z=!1;setTimeout(g,50)},function(){Z=!1;g()})):g()}}function K(){if(w&&p!==c){i===c&&(S=!1);S||(i=c);T=!1;Y();var a=l[c];"srcL"in a?"srcL"in a&&!a.srcL?qa():ha():(a.srcL=0,qa(),f(a.src,function(d){a.srcL=1;a.width=d.width;a.height=d.height;ia();ha()},function(){H(sprintf(n[7],a.title));ia();ja()?F():W();delete a.srcL}))}}function xa(){if(b.smartPreload){var a,d;ja();a=ja()?(c+1==
h?-1:c)+1:(c==0?h:c)-1;d=l[a];if(!("srcL"in d))d.srcL=0,f(d.src,function(b){d.srcL=1;d.width=b.width;d.height=b.height;c==a&&ha()},function(){H(sprintf(n[7],d.title));delete d.srcL})}}function ha(){Q();xa();la(p);da(c);p=c;ea();Y();ia();B.parentNode.removeChild(B);B=createElement("img",{src:l[c].src});L.appendChild(B);ra();clearTimeout(R);ba&&(R=setTimeout(F,b.slideshowDelay*1E3))}function ja(){return!!(c==0&&p+1==h||c>p&&!(p==0&&c+1==h))}function F(){ba&&c==h-1&&!b.loopPlay&&X();p=c;c+1==h?c=0:c++;
K()}function W(){p=c;c==0?c=h-1:c--;K()}function X(){(ba=!ba)?(H(n[8]),N.className=y+"pause",R=setTimeout(F,b.slideshowDelay*1E3),G=setTimeout(sa,s(ta*1500))):(H(n[9]),N.className=y+"play",clearTimeout(R),oa())}function oa(){clearTimeout(G);ka||(fade(o,{start:0,stop:100}),fade(z,{start:0,stop:100}),ka=!0);G=setTimeout(sa,ta)}function sa(){ya||(fade(o),fade(z),ka=!1)}function da(a){if(k.childNodes[a]&&(a==c&&!T||a!=c))fade(k.childNodes[a],{start:b.thmbTransparency,stop:100,time:200}),a==c&&!T&&(T=
!T)}function la(a){a!=-1&&a<k.childNodes.length&&k.childNodes[a]&&a!=c&&fade(k.childNodes[a],{start:100,stop:b.thmbTransparency,time:800})}function Q(){var a=S?i:c,d=(k.childNodes[a]||{}).offsetLeft,b=!0,e=0,f=h-1;if(k.childNodes[a]){j>=h?(d=-s((m-q*h-C*2)/2),b=!1):d+q/2+C>m/2&&d<q*h-m/2?(d=d+q/2+C-m/2,e=a-s(j/2),f=a+s(j/2)):d>q*h-m/2?(d=q*h+C*2-m,e=h-j-1):(d=0,f=j);A.style.display=b?"":"none";k.style.right=d+u;for(a=e;a<=f;a++)ga.push(a);g()}}function va(){S=!0;i<=r(j/2)?i=0:i>=h-r(j/2)?i=h-r(j/
2)-1:i-=r(j/2);i<0&&(i=0);Q()}function wa(){S=!0;i>=h-r(j/2)?i=h-1:i<r(j/2)?i=r(j/2)+1:i+=r(j/2);i>=h&&(i=h-1);Q()}function qa(){if(!D){D=createElement("div",{className:"loading",innerHTML:sprintf('<div class="box"><div class="text">%1</div></div>',n[10])});var a=createElement("div",{className:"overlay"});D.firstChild.appendChild(a);L.appendChild(D);setTransparency(a,75)}D.style.display=""}function ia(){if(D)D.style.display="none"}function H(a,b){if(a&&!(a.length<1)&&E){var c=createElement("li",{innerHTML:a});
E.insertBefore(c,E.firstChild);fade(c,{start:0,stop:85});setTimeout(function(){fade(c,{start:85,handle:function(){E.removeChild(c)}})},b?ua*b:ua)}}function ea(){var a=l[c].title;b.showItemInfo&&(!a||a.length>0)?(ca.innerHTML=a,M.style.display=""):M.style.display="none"}function ma(){H(sprintf(n[11],za),3)}function na(){if(w){var a=getWindowGeometry();m=a.width;t=a.height;x.style.height=t+u;l[c]&&(j=r((m-C*2)/q),Q(),ra())}}function ra(){var a=l[c],d=a.width,e=a.height,f=d/e,h=m/t*b.imgFillLevel,d=
d>m*b.imgFillLevel||e>t*b.imgFillLevel,g=aa,i=aa,j=0,k=B.style;if("srcL"in a&&t)b.enlargeSmallImages&&!d||d?f>h?(g=s(m*b.imgFillLevel)+u,j=s((t-m*b.imgFillLevel/f)/2)):(i=s(t*b.imgFillLevel)+u,j=s((t-t*b.imgFillLevel)/2)):j=s((t-e)/2),k.width=g,k.height=i,k.top=j+u}function Aa(){var a;a=fa();a!==!1?(w||e(),a-1!==c&&(c=a-1,K())):w&&J()}function fa(){var a=window.location.hash,b=!1;if(a.indexOf("slideshow")==1)if(a=a.split("/"),a.length>1){if(a=parseInt(a[1]),!isNaN(a)&&(!h||a<=h&&a>0))b=a}else b=1;
return b}function Y(){if(w){if(fa()!==c+1)window.location.hash="slideshow/"+(c+1)+"/"+encodeURI(encodeURI(l[c].src))}else window.location.hash=pa}var b={elements:[],imgFillLevel:1,thmbShow:!0,thmbTransparency:50,thmbWidth:80,thmbHeight:60,enlargeSmallImages:!1,autoShow:!0,autoPlay:!0,loopPlay:!0,startIndex:0,slideshowDelay:3,showItemInfo:!0,stateCheckInterval:0.2,smartPreload:!0,onShow:!1,onExit:!1,empty:!0},za=0.1,w=!1,l=b.elements,h,O,P=[],x,z,A,k,L,D,B,V,M,ca,o,N,E,m,t,q,C,j,ga=[],Z=!1,G,ka,ya,
ta=3E3,S,T,ua=3E3,R,ba,c,p,i,pa,u="px",aa="auto",y="button ",U="small ",s=Math.round,r=Math.floor,n=["seconds","Exit","Show help",'<b class="s1 f"></b><b class="s2"></b><b class="s3"></b><b class="s4"></b><b class="s5"></b><b class="s6"></b><b class="s7"></b><b class="s8"></b><b class="s9"></b><b class="s8"></b><b class="s7"></b><b class="s6"></b><b class="s5"></b><b class="s4"></b><b class="s3"></b><b class="s2"></b><b class="s1"></b>',"No items found!","Press F11 to fulscreen mode",'<div class="thmbBox" style="width: %1%3; height: %2%3;"><div class="overlay"></div><img title="%4" alt="%4" /></div>',
"Error on loading &quot;%1&quot;, skip.","Play","Pause","Loading.....",'iGallery ver: %1 [<a href="http://jstoys.org.ua/" target="_blank">jstoys.org.ua</a>]<br /><br /><b>Keyboard shortcut:</b><ul><li>Left/Up/Page Up/Mouse Whell Up - Previous image</li><li>Right/Down/Page Down/Mouse Whell Down - Next image</li><li>Space - Play/Stop slideshow</li><li>H - This help</li><li>I - Toggle the information about the item</li><li>Esc - Exit</li></ul>',"Captions"];return{init:function(a){extend(b,a||{});setInterval(Aa,
b.stateCheckInterval*1E3);b.autoShow&&e()},show:function(a){if(a)b.elements=a;e()},exit:function(){J()}}}();