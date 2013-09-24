// ==UserScript==
// @name        sJump
// @namespace   http://blog.h2ero.cn
// @include     *
// @version     0.1
// @description  search jump
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript==
// style 
GM_addStyle(".sJump-inspect{ border:1px solid !important; } .sJump-inspect-notify{ color:#000; background-color:#f00; font-size:13px; padding:2px; z-index=999999;}"+
            ".sJump-menu {z-index:999999999999; background: none repeat scroll 0 0 #2D2D2D; position: fixed; right: -70px; top: 50px; width: 80px; padding:0px 5px; box-shadow:1px 1px 10px #000; -moz-transition:all .2s ease; } .sJump-menu:hover{ right: 0px; } .sJump-menu a{ color:#bbb; text-decoration:none; font-size: 14px; line-height: 20px; padding:2px; font-weight:bold; } .sJump-menu a:hover{ color:#fff; }"+
            ".sJump-popup { background: none repeat scroll 0 0 rgba(0, 0, 0, 0.79); box-shadow: 1px 1px 20px #000000; display: none; height: 50px; position: fixed; right: -300px; top: 300px; width: 300px;-moz-transition:all .2s ease;}"+
            ".sJump-popup-show{display:block !important;right:0px;}"+
            ".sJump-search-bar{clear:both;margin:20px 0px;background: none repeat scroll 0 0 #FFFFFF; box-shadow: 1px 1px 5px #000000; font-size: 14px; height: 30px; line-height: 30px; padding-left: 20px;}"+
            ".sJump-search-bar a{margin:0px 5px;}"); 
//global 
var sJumpDebug = true;
var inspectEl = 'div,p,a,input,button,form,b,i,span,h1,h2,h3,h4,h5';
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
        $("*").removeClass("sJump-inspect");
        $(".sJump-inspect-notify").remove();
    }
    sJump.getFormAction = function(el){
        while(el.parent()[0].nodeName != 'FORM' || el.parent()[0].nodeName == 'BODY'){
            el = el.parent()
        }
        var action = el.parent().attr("action");
        if (!/^\/\//.test(action)&&/^\//.test(action)) {
            action = document.location.origin+action;
        }
        return  action;
    }
    sJump.event.inspect = function(e){
        log("%chover:%c"+cssPath($(this)[0]), "color:green", "color:black");
        sJump.clearInspact();
        $(this).addClass("sJump-inspect");
        $(this).append("<b class=\"sJump-inspect-notify\">"+cssPath($(this)[0])+"</b>");
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
            console.dir(e.ctrlKey);
            var method = 'after';
            if (e.ctrlKey) {
                method = 'before';
            }
            sJump.store.savePosition(cssPath($(this)[0]), method)
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

    sJump.store.savePosition = function(cssPath,method){
        var position = prompt("input position");
        if (position) {
            positions[document.domain] = {cssPath:cssPath, method:method}
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
        if(positions.hasOwnProperty(document.domain)){
            log("add search bar:"+positions[document.domain].cssPath);

            var searchDiv = "";
            for (i in searchs) {
                searchDiv += "<a href=\""+searchs[i].url+"\" >"+unescape(atob(i))+"</a>"
            };
            if (positions[document.domain].method == 'after') {
                $(positions[document.domain].cssPath).after("<div class=\"sJump-search-bar\">"+searchDiv+"</div>")
            }else{
                $(positions[document.domain].cssPath).before("<div class=\"sJump-search-bar\">"+searchDiv+"</div>")
            }
        }
    }



    var iel = $(inspectEl).not(excludeInspactEl);
    //binding 
    sJump.event.bind = function(){
        // inspect ---------------------------------------------------------------------------
        iel.bind("mouseenter", sJump.event.inspect);
        iel.bind("mouseleave", sJump.clearInspact);
        
        // get form field --------------------------------------------------------------------
        $("body").on("click",".sJump-inspect", sJump.event.doInspact);
    }
    sJump.event.unbind = function(){
        // inspect ---------------------------------------------------------------------------
        iel.unbind("mouseenter", sJump.event.inspect);
        iel.unbind("mouseleave", sJump.clearInspact);

        // get form field --------------------------------------------------------------------
        $("body").on("mousedown,",".sJump-inspect", sJump.event.doInspact);

    }
    $(".sJump-icon").click(function(){
        $(".sJump-popup").toggleClass("sJump-popup-show");
        return false;
    });
    $(".sJump-add-search").click(function(){
        log("inspect start!");
        sJump.event.bind();
        return false;
    });
    $(".sJump-after-search").click(function(){
        log("inspect cancle!");
        sJump.event.unbind();
        return false;
    });
    sJump.dom.addSearchBar();
});
