/********************************************************************
 * imgLib v0.1.2 09.04.2011
 * Contact me at dev@jstoys.org.ua
 * Site: http://jstoys.org.ua/
 * This copyright notice MUST stay intact for use.
 ********************************************************************/
var imgLibManager={init:function(a){a=a||{};this.width=a.width||600;this.height=a.height||500;this.returnTo=a.returnTo||"";this.url=a.url||"/scripts/imglib/index.html";this.configName=a.configName||""},open:function(a,b,c,d){b=window.location.search;b.length<1&&(b="?");this.url=this.url+b+"&type="+c+(this.configName?"#configName="+this.configName:"");tinyMCE.activeEditor.windowManager.open({file:this.url,title:"ImgLib v.0.1.2",width:this.width,height:this.height,resizable:"yes",inline:"no",close_previous:"no",popup_css:!1},{window:d,input:a});return!1}};