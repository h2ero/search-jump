// ==UserScript==
// @name        sJump
// @namespace   http://blog.h2ero.cn
// @include     *
// @version     0.1
// @description  search jump
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript==

/*
 * store value: search:[name,icon, url], position:[url,cssPath,searchs]
 *
 *  
 *
 *
 *
 * todo: 1. added + - to increase and decrease div level.
 *
 *
 *
 */

// style 
GM_addStyle(".inspact{ border:1px solid !important; } .inspact-notify{ color:#000; background-color:#f00; font-size:13px; padding:2px; z-index=999999;}"+
            ".sJump-menu {z-index:999999999999; background: none repeat scroll 0 0 #2D2D2D; position: fixed; right: -40px; top: 50px; width: 50px; padding:0px 5px; box-shadow:1px 1px 10px #000; -moz-transition:all .2s ease; } .sJump-menu:hover{ right: 0px; } .sJump-menu a{ color:#bbb; text-decoration:none; font-size: 14px; line-height: 20px; padding:2px; font-weight:bold; } .sJump-menu a:hover{ color:#fff; }"); 
//global 
var sJumpDebug = true;
var inspactEl = 'div,p,a,input,form,b,i,span,h1,h2,h3,h4,h5';
var excludeInspactEl = '.sJump-menu *,.sJump-menu';

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

var log;
if (sJumpDebug) {
    log = console.log;
}else{
    log = function(){};
}
log("sJump load!")

$(function(){
    $('body').after('<div class="sJump-menu"> <a href="#" class="sJump-icon">s</a> <a href="#" class="sJump-add-search">+</a> <a href="#" class="sJump-after-search">-</a> </div> ');
    var sJump = {};
    sJump.event = {};
    
    // save form --------------------------------------------------------------------------------
    sJump.save = function (name, value){
        window.localStorage.setItem(escape(name), escape(value));
    }
    sJump.get = function(name){
        unescape(window.localStorage.getItem(escape(name)));
    }
    sJump.clearInspact = function(){
        $("*").removeClass("inspact");
        $(".inspact-notify").remove();
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
        $(this).addClass("inspact");
        $(this).append("<b class=\"inspact-notify\">"+cssPath($(this)[0])+"</b>");
        e.stopPropagation();
    }
    sJump.event.doInspact = function(e){
        log("%cclick:%c"+cssPath($(this)[0]), "color:red", "color:black");
        if ($(this)[0].nodeName=='INPUT') {
            var action = sJump.getFormAction($(this))
            var queryName = $(this).attr("name");
            sUrl = action +"?"+ queryName + "=";
            log(sUrl);
        }
        e.stopPropagation();
        return false;
    }
    var iel = $(inspactEl).not(excludeInspactEl);

    //binding 
    sJump.event.bind = function(){
        // inspact --------------------------------------------------------------------------------
        iel.bind("mouseenter", sJump.event.inspact);
        iel.bind("mouseleave", sJump.clearInspact);
        
        // get form field --------------------------------------------------------------------------------
        $("body").on("click",".inspact", sJump.event.doInspact);
    }
    sJump.event.unbind = function(){
        // inspact --------------------------------------------------------------------------------
        iel.unbind("mouseenter", sJump.event.inspact);
        iel.unbind("mouseleave", sJump.clearInspact);

        // get form field --------------------------------------------------------------------------------
        $("body").on("click",".inspact", sJump.event.doInspact);

    }
    $(".sJump-add-search").click(function(){
        log("inspact start!");
        sJump.event.bind();
    });
    $(".sJump-after-search").click(function(){
        log("inspact cancle!");
        sJump.event.unbind();
    });
});