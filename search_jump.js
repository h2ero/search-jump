// ==UserScript==
// @name        sJump
// @namespace   http://blog.h2ero.cn
// @include     *
// @version     0.1
// @description  search jump
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript==
// style 
GM_addStyle(".sJump-inspact{ border:1px solid !important; } .sJump-inspact-notify{ color:#000; background-color:#f00; font-size:13px; padding:2px; z-index=999999;}"+
            ".sJump-menu {z-index:999999999999; background: none repeat scroll 0 0 #2D2D2D; position: fixed; right: -70px; top: 50px; width: 80px; padding:0px 5px; box-shadow:1px 1px 10px #000; -moz-transition:all .2s ease; } .sJump-menu:hover{ right: 0px; } .sJump-menu a{ color:#bbb; text-decoration:none; font-size: 14px; line-height: 20px; padding:2px; font-weight:bold; } .sJump-menu a:hover{ color:#fff; }"+
            ".sJump-popup { background: none repeat scroll 0 0 rgba(0, 0, 0, 0.79); box-shadow: 1px 1px 20px #000000; display: none; height: 50px; position: fixed; right: -300px; top: 300px; width: 300px;-moz-transition:all .2s ease;}"+
            ".sJump-popup-show{display:block !important;right:0px;}"+
            ".sJump-search-bar{margin:20px 0px;background: none repeat scroll 0 0 #FFFFFF; box-shadow: 1px 1px 5px #000000; font-size: 14px; height: 30px; line-height: 30px; padding-left: 20px;}"+
            ".sJump-search-bar a{margin:0px 5px;}"); 
//global 
var sJumpDebug = true;
var inspactEl = 'div,p,a,input,button,form,b,i,span,h1,h2,h3,h4,h5';
var excludeInspactEl = '.sJump-menu *,.sJump-menu';

var log;
if (sJumpDebug) {
    log = console.log;
}else{
    log = function(){};
}
log("sJump load!")


var searchs = {};
var positions = {};
if (GM_getValue("sJump_searchs")) {
    searchs = JSON.parse(GM_getValue("sJump_searchs"))
}
if (GM_getValue("sJump_positions")) {
    positions = JSON.parse(GM_getValue("sJump_positions"))
}
log(positions);
log(searchs);

// http://stackoverflow.com/questions/3620116/get-css-path-from-dom-element
var cssPath = function(el) {
    if (!(el instanceof Element)) 
        return;
    var path = [];
    while (el.nodeType === Node.ELEMENT_NODE) {
        var selector = el.nodeName.toLowerCase();
        if (el.id) {
            selector += '#' + el.id;
            path.unshift(selector);
            break;
        } else {
            var sib = el, nth = 1;
            while (sib = sib.previousElementSibling) {
                if (sib.nodeName.toLowerCase() == selector)
                   nth++;
            }
            if (nth != 1)
                selector += ":nth-of-type("+nth+")";
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(" > ");
}

$(function(){
    $('body').after('<div class="sJump-menu"> <a href="#" class="sJump-icon">s</a> <a href="#" class="sJump-add-search">+</a> <a href="#" class="sJump-after-search">-</a></div><div class="sJump-popup"></div> ');


    var sJump = {};
    sJump.event = {};
    
    // save form --------------------------------------------------------------------------------
    sJump.clearInspact = function(){
        $("*").removeClass("sJump-inspact");
        $(".sJump-inspact-notify").remove();
    }
    sJump.getFormAction = function(el){
        while(el.parent()[0].nodeName != 'FORM' || el.parent()[0].nodeName == 'BODY'){
            el = el.parent()
        }
        return el.parent().attr("action");
    }
    sJump.event.inspact = function(e){
        log("%chover:%c"+cssPath($(this)[0]), "color:green", "color:black");
        sJump.clearInspact();
        $(this).addClass("sJump-inspact");
        $(this).append("<b class=\"sJump-inspact-notify\">"+cssPath($(this)[0])+"</b>");
        e.stopPropagation();
    }

    sJump.event.getFavicon = function(e){
        $("link").each(function(){
            regex = /\.ico$/;
            if(regex.test($(this).attr("href")))
                 return $(this).attr("href");
        });
    }

    sJump.event.doInspact = function(e){
        log("%cclick:%c"+cssPath($(this)[0]), "color:red", "color:black");
        if ($(this)[0].nodeName=='INPUT') {
            var action = sJump.getFormAction($(this))
            var queryName = $(this).attr("name");
            sUrl = action +"?"+ queryName + "=";
            sFav = sJump.event.getFavicon();
            sJump.store.saveSearch(sUrl)
            log(sUrl, sFav);
        } else {
            sJump.store.savePosition(cssPath($(this)[0]))
        }
        e.stopPropagation();
        return false;
    }

    // store value --------------------------------------------------------------------------------
    sJump.store = {}
    sJump.store.saveSearch = function(url){
        var searchName = prompt("input search");
        if (searchName) {
            searchs[btoa(escape(searchName))] = {url:url}
            var value = JSON.stringify(searchs);
            GM_setValue("sJump_searchs", value)
            log("%csave search:"+value,"color:blue")
        }
    }

    sJump.store.savePosition = function(cssPath){
        var position = prompt("input position");
        if (position) {
            positions[document.domain] = {cssPath:cssPath}
            var value = JSON.stringify(positions);
            GM_setValue("sJump_positions", value)
            log("%csave position:"+value,"color:blue")
        }
    }
    sJump.store.reset = function(){
        GM_setValue("sJump_searchs", "{}")
        GM_setValue("sJump_positions", "{}")
    }
    // dom --------------------------------------------------------------------------------
    sJump.dom = {}
    sJump.dom.addSearchBar = function(){
        log("add search bar:"+positions[document.domain].cssPath);

        var searchDiv = "";
        for (i in searchs) {
            searchDiv += "<a href=\""+searchs[i].url+"\" >"+unescape(atob(i))+"</a>"
        };

        $(positions[document.domain].cssPath).after("<div class=\"sJump-search-bar\">"+searchDiv+"</div>")
    }



    var iel = $(inspactEl).not(excludeInspactEl);
    //binding 
    sJump.event.bind = function(){
        // inspact ---------------------------------------------------------------------------
        iel.bind("mouseenter", sJump.event.inspact);
        iel.bind("mouseleave", sJump.clearInspact);
        
        // get form field --------------------------------------------------------------------
        $("body").on("click",".sJump-inspact", sJump.event.doInspact);
    }
    sJump.event.unbind = function(){
        // inspact ---------------------------------------------------------------------------
        iel.unbind("mouseenter", sJump.event.inspact);
        iel.unbind("mouseleave", sJump.clearInspact);

        // get form field --------------------------------------------------------------------
        $("body").on("click",".sJump-inspact", sJump.event.doInspact);

    }
    $(".sJump-icon").click(function(){
        $(".sJump-popup").toggleClass("sJump-popup-show");
    });
    $(".sJump-add-search").click(function(){
        log("inspact start!");
        sJump.event.bind();
    });
    $(".sJump-after-search").click(function(){
        log("inspact cancle!");
        sJump.event.unbind();
    });
    sJump.dom.addSearchBar();
});
