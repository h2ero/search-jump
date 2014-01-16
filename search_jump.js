// ==UserScript==
// @name        sJump
// @namespace   http://blog.h2ero.cn
// @include     *
// @version     0.1
// @grant       GM_getValue
// @grant       GM_setValue
// @description  search jump
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// ==/UserScript==
// style 

GM_addStyle(".sJump-inspect{ border:1px solid !important; } .sJump-inspect-notify{ color:#000; background-color:#f00; font-size:13px !important; padding:2px; z-index=999999;}"+
            ".sJump-menu {z-index:999999999999; background: none repeat scroll 0 0 #2D2D2D; position: fixed; right: -70px; top: 50px; width: 80px; padding:0px 5px; box-shadow:1px 1px 10px #000; -moz-transition:all .2s ease; } .sJump-menu:hover{ right: 0px; } .sJump-menu a{ color:#bbb; text-decoration:none; font-size: 14px; line-height: 20px; padding:2px; font-weight:bold; } .sJump-menu a:hover{ color:#fff; }"+
            ".sJump-popup { z-index:10000; font-size:14px;background: none repeat scroll 0 0 rgba(0, 0, 0, 0.79); box-shadow: 1px 1px 20px #000000; display: none; /*height: 50px; */padding:5px;position: fixed; right: -300px; top: 200px; width: 300px;-moz-transition:all .2s ease;}"+
            ".sJump-popup li {display:inline-block;list-style:none;color:#bbb;width:100px;}"+
            ".sJump-popup-show{display:block !important;right:0px;}"+
            ".sJump-search-bar{clear:both;margin:20px 0px;background:none repeat scroll 0 0 rgba(255, 255, 255, 0.23); box-shadow: 1px 1px 5px #000000; font-size: 14px;height: 30px; line-height: 30px; padding-left: 20px;}"+
            ".sJump-search-bar img{width:16px;height:16px;vertical-align:middle;margin-right:1px;}"+
            "#sJump-favicon{top:300px;position:fixed;right:0px;}"+
            ".sJump-search-bar a{color: #000000; margin: 0 5px; text-decoration: none; text-shadow: 1px 1px 1px #9C9C9C;}"+
            ".sJump-save,.sJump-update-favicon { margin:0px 2px;background: none repeat scroll 0 0 #F5F5F5; border: medium none; border-radius: 3px 3px 3px 3px; color: #3E3D3D; float: right;}"); 

//global 

// DEBUG
var sJumpDebug = true;

// 允许选择的元素.
var inspectEl = 'div,p,a,input,button,form,b,i,span,h1,h2,h3,h4,h5';

// 排除的元素
var excludeInspectEl = '.sJump-menu *,.sJump-menu,.sJump-popup *, .sJump-popup';

// 日志输出
var log;
if (sJumpDebug) {
    log = console.log;
}else{
    log = function(){};
}

// 载入提示.
log("sJump load!")


// 全局OBJ
var sJump_searchs = {};
var sJump_positions = {};
var sJump_forms = {}

// 从GM中获取元素的方法.
var getObjFromGM = function(name){
    if (GM_getValue(name)) {
        return JSON.parse(GM_getValue(name))
    }else{
        return {}
    }
}

// 载入设置值
sJump_searchs = getObjFromGM("sJump_searchs")
sJump_positions = getObjFromGM("sJump_positions")
sJump_forms = getObjFromGM("sJump_forms")


log(sJump_positions);
log(sJump_searchs);
log(sJump_forms)

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
            if (nth != 1){
                selector += ":nth-of-type("+nth+")";
            } else {
                if (el.classList.length != 0 && el.classList[0]!='sJump-inspect') {
                    selector += "."+el.classList[0];
                }
            }
        }
        path.unshift(selector);
        el = el.parentNode;
    }
    return path.join(" > ");
}

$(function(){
    $('body').after('<div class="sJump-menu"><a href="#" class="sJump-icon">s</a> <a href="#" class="sJump-add-search">+</a> <a href="#" class="sJump-after-search">-</a></div><div class="sJump-popup"></br><input type="button" class="sJump-save" value="保存"><input type="button" class="sJump-update-favicon" value="更新favicon"></div><canvas id="sJump-favicon" width="16px" height="16px"></canvas>');


    var sJump = {};
    sJump.event = {};
    
    // save form --------------------------------------------------------------------------------
    sJump.clearInspect = function(){
        $("*").removeClass("sJump-inspect");
        $(".sJump-inspect-notify").remove();
    }

    sJump.getFormAction = function(el){
        while(el.parent()[0].nodeName != 'FORM' && el.parent()[0].nodeName != 'BODY'){
            el = el.parent()
            console.log(el.parent()[0].nodeName);
        }
        var action = el.parent().attr("action");
        console.log(action)
        if (!/^http/.test(action)&&action != undefined) {
            if (!/^\//.test(action)) {
                action = document.location.origin+"/"+action;
            } else {
                action = document.location.origin+action;
            }
        }else{
            return undefined;
        }
        return  action;
    }

    sJump.event.inspect = function(e){
        log("%chover:%c"+cssPath($(this)[0]), "color:green", "color:black");
        sJump.clearInspect();
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

    sJump.event.doInspect = function(e){
        log("%cclick:%c"+cssPath($(this)[0]), "color:red", "color:black");
        if ($(this)[0].nodeName=='INPUT') {
            var action = sJump.getFormAction($(this))
            var sUrl = '';
            if (action != undefined) {
                var queryName = $(this).attr("name");
                sUrl = action +"?"+ queryName + "=";
            }else{
                sUrl = prompt("please input search url")
            }

            console.log(sUrl, cssPath($(this)[0]))
            sJump.store.saveSearch(sUrl, cssPath($(this)[0]))
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
        sJump.event.unbind();
        return false;
    }

    // store value --------------------------------------------------------------------------------
    sJump.store = {}
    sJump.store.saveSearch = function(url, cssPath){
        var searchName = prompt("input search");
        if (searchName) {
            sJump_searchs[btoa(escape(searchName))] = {url:url, enable:true}
            var value = JSON.stringify(sJump_searchs);
            GM_setValue("sJump_searchs", value)
            log("%csave search:"+value,"color:blue")

            //forms
            sJump_forms[document.domain] = {cssPath:cssPath, searchName:btoa(escape(searchName))}
            var value = JSON.stringify(sJump_forms);
            GM_setValue("sJump_forms", value)
            log("%csave form:"+value,"color:blue")
        }
    }

    sJump.store.savePosition = function(cssPath,method){
        var sJump_position = prompt("input position");
        if (sJump_position) {
            sJump_positions[document.domain] = {cssPath:cssPath, method:method}
            var value = JSON.stringify(sJump_positions);
            GM_setValue("sJump_positions", value)
            log("%csave position:"+value,"color:blue")
        }
    }
    sJump.store.reset = function(){
        GM_setValue("sJump_searchs", "{}")
        GM_setValue("sJump_positions", "{}")
        GM_setValue("sJump_forms", "{}")
    }
    sJump.store.getSearchWord = function(){
        if (sJump_forms.hasOwnProperty(document.domain)) {
            return $(sJump_forms[document.domain].cssPath).val();
        }else{
            return "";
        }
    }

    // dom --------------------------------------------------------------------------------
    sJump.dom = {}
    sJump.dom.addSearchBar = function(){
        if(sJump_positions.hasOwnProperty(document.domain)){
            var searchDiv = "";
            var word = sJump.store.getSearchWord();
            if (!word) {
                return false;
            }
            log("add search bar:"+sJump_positions[document.domain].cssPath);
            log("catch search word:"+word)
            for (i in sJump_searchs) {
                if (sJump_searchs[i].enable == true) {
                    searchDiv += "<a href=\""+sJump_searchs[i].url+word+"\" ><img src=\""+sJump_searchs[i].favicon+"\">"+unescape(atob(i))+"</a>"
                }
            };
            var logo = "<b style=\"color: rgb(0, 0, 0);\">SJ</b>"
            if (sJump_positions[document.domain].method == 'after') {
                $(sJump_positions[document.domain].cssPath).after("<div class=\"sJump-search-bar\">"+logo+searchDiv+"</div>")
            }else{
                $(sJump_positions[document.domain].cssPath).before("<div class=\"sJump-search-bar\">"+logo+searchDiv+"</div>")
            }
        }
    }

    //upate
    sJump.update = {}
    sJump.update.enable = function(searchHash, flag=true){
        sJump_searchs[searchHash].enable = flag;
        GM_setValue("sJump_searchs", JSON.stringify(sJump_searchs));
    }
    sJump.update.favicon = function(searchHash){
        var searchUrl = sJump_searchs[searchHash].url
        regex = /\/\/(.*?)\//
        var domain = searchUrl.match(regex)[1]
        console.log(domain);
        var canvas = document.getElementById('sJump-favicon');
        var context = canvas.getContext('2d');
        context.clearRect(0,0,16,16);
        context.rect(20,20,150,100);
        context.fillStyle="white";
        context.fill();
        var imageObj = new Image();

        imageObj.onload = function() {
          context.drawImage(imageObj, 0, 0);
          log(canvas.toDataURL())
          sJump.update.saveFavicon(searchHash, canvas.toDataURL());
        };
        imageObj.src = 'http://www.google.com/s2/favicons?domain='+domain;
    }
    sJump.update.saveFavicon = function(searchHash, dataUrl){
        sJump_searchs[searchHash].favicon = dataUrl;
        GM_setValue("sJump_searchs", JSON.stringify(sJump_searchs));
    }




    var iel = $(inspectEl).not(excludeInspectEl);

    //binding 
    sJump.event.bind = function(){
        // inspect ---------------------------------------------------------------------------
        iel.bind("mouseenter", sJump.event.inspect);
        iel.bind("mouseleave", sJump.clearInspect);
        
        // get form field --------------------------------------------------------------------
        $("body").on("click",".sJump-inspect", sJump.event.doInspect);
    }

    sJump.event.unbind = function(){
        // inspect ---------------------------------------------------------------------------
        iel.unbind("mouseenter", sJump.event.inspect);
        iel.unbind("mouseleave", sJump.clearInspect);

        // get form field --------------------------------------------------------------------
        $("body").on("mousedown,",".sJump-inspect", sJump.event.doInspect);

    }

    $(".sJump-icon").click(function(){
        var checkbox = "";
        for(i in sJump_searchs){
            var checked = '';
            if (sJump_searchs[i].enable == true) {
                checked = ' checked="checked" ';
            }
            checkbox += "<li><input type=\"checkbox\" "+checked+"value=\""+i+"\">"+unescape(atob(i))+"</li>";
        }
        $(".sJump-popup").toggleClass("sJump-popup-show").prepend(checkbox);
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

    $(".sJump-save").click(function(){
        log("save form");
        $(".sJump-popup input[type='checkbox']").each(function(){
            if ($(this).attr("checked")=='checked') {
                sJump.update.enable($(this).val());
            }else{
                sJump.update.enable($(this).val(), false);
            }
        });
    });

    $(".sJump-update-favicon").click(function(){
        log("update favicion");
        $(".sJump-popup input[type='checkbox']").each(function(){
            if ($(this).attr("checked")=='checked') {
                sJump.update.favicon($(this).val());
            }
        });
    });

    sJump.dom.addSearchBar();

});
