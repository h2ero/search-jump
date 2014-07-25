// ==UserScript==
// @name        sJump
// @namespace   http://blog.h2ero.cn
// @include     *
// @version     0.2
// @description search jump
// @update      2014-07-20 06:00:30
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// ==/UserScript==
// style 

jQuery.fn.center = function ()
{
    this.css("position","fixed");
    this.css("top", ($(window).height() / 2) - (this.outerHeight() / 2));
    this.css("left", ($(window).width() / 2) - (this.outerWidth() / 2));
    return this;
}

var m = function(f) {
  return f.toString().split('\n').slice(1, -1).join('\n');
}
var gm = {};
loadCss = function(){
    var style = document.createElement('style');
    style.type = 'text/css';
    style.textContent = m(function(){/*
                .sJump * {
                    // all: initial;//-only-support-firefox;
                    font-size: 14px;
                    list-style: none;
                }
                .sJump-inspect {
                    border: 1px solid !important;
                }
                .sJump-inspect-notify {
                    color: #000;
                    background-color: #f00;
                    font-size: 13px !important;
                    padding: 2px;
                    z-index=999999;
                }
                .sJump-menu {
                    z-index: 999999999999;
                    background: none repeat scroll 0 0 #2D2D2D;
                    position: fixed;
                    right: -70px;
                    top: 50px;
                    width: 80px;
                    padding: 0px 5px;
                    box-shadow: 1px 1px 10px #000;
                    -moz-transition: all .2s ease;
                }
                .sJump-menu:hover {
                    right: 0px;
                }
                .sJump-menu a {
                    color: #bbb;
                    text-decoration: none;
                    font-size: 14px;
                    line-height: 20px;
                    padding: 2px;
                    font-weight: bold;
                    cursor:pointer;
                }
                .sJump-menu a:hover {
                    color: #fff;
                    background: #3377AA;
                }
                .sJump-search-bar {
                    clear: both;
                    margin: 20px 0px;
                    background: none repeat scroll 0 0 rgba(255, 255, 255, 0.23);
                    box-shadow: 1px 1px 5px #000000;
                    font-size: 14px;
                    height: 30px;
                    line-height: 30px;
                    padding-left: 20px;
                    position: relative;
                    z-index: 1000000;
                }
                .sJump-search-bar img {
                    width: 16px;
                    height: 16px;
                    vertical-align: middle;
                    margin-right: 1px;
                    display:inline;
                }
                #sJump-favicon {
                    top: 300px;
                    position: fixed;
                    right: 0px;
                }
                .sJump-search-bar a {
                    color: #000000;
                    margin: 0 5px;
                    text-decoration: none;
                    text-shadow: 1px 1px 1px #9C9C9C;
                    display:inline;
                }
                input.sJump-btn {
                    background-color: #F5F5F5;
                    background-image: linear-gradient(to bottom, #FFFFFF, #E6E6E6);
                    background-repeat: repeat-x;
                    border-color: rgba(0, 0, 0, 0.1) rgba(0, 0, 0, 0.1) #B3B3B3;
                    border-radius: 4px;
                    border-style: solid;
                    border-width: 1px;
                    box-shadow: 0 1px 0 rgba(255, 255, 255, 0.2) inset, 0 1px 2px rgba(0, 0, 0, 0.05);
                    color: #333333;
                    cursor: pointer;
                    display: inline-block;
                    font-size: 14px;
                    line-height: 20px;
                    margin-bottom: 0;
                    padding: 4px 12px;
                    text-align: center;
                    text-shadow: 0 1px 1px rgba(255, 255, 255, 0.75);
                    vertical-align: middle;
                    bottom:10px;
                }
                .sJump-btn-group{
                    bottom: 10px;
                    position: absolute;
                    right: 10px;
                }
                .sJump-tabs ul.tab-name {
                    width: 90px;
                    padding: 0px 20px;
                }
                .sJump-tabs ul.tab-list {
                    width: auto;
                    padding: 0px;
                }
                .sJump-tabs .tab-name li {
                    color: #303030;
                    display:block;
                    padding: 5px;
                    cursor: pointer;
                }
                .sJump-tabs .tab-name li:hover {
                    color: #D7005F;
                }
                .sJump-popup-show {
                    display: block !important;
                }
                .sJump-popup {
                    -moz-transition: all .9s ease;
                    background: #fff;
                    box-shadow: 1px 2px 10px;
                    left: 100px;
                    padding: 10px 0;
                    position: absolute;
                    top: 100px;
                    min-width: 600px;
                    min-height: 200px;
                    z-index: 20000000;
                    display: none;
                }
                .sJump-tabs .tab-name,
                .sJump-tabs .tab-list {
                    float: left;
                }
                .sJump-tabs .tab-name,
                .sJump-tabs .tab-list {} .sJump-tabs .tab-list .tab-content {
                    display: none;
                }
                .sJump-tabs .tab-list .tab-content:nth-child(1) {
                    display: block;
                    width: 450px;
                }
                .sJump-tabs .tab-list .tab-content:nth-child(1) li {
                    float: left;
                    color: #D7005F;
                    margin: 5px;
                }
                .sJump-tabs .tab-list .tab-content:nth-child(1) li input {
                    margin-left: 1px;
                    margin-right: 5px;
                }
                .sJump-tabs .tab-content.about {
                    color: #ccc;
                    padding: 55px;
                }
                .sJump-tabs .tab-content .import {
                    background:#fff;
                    height: 150px;
                    width: 450px;
                    margin-bottom: 25px;
                    margin-right: 25px;
                }
                */});
    $('body').after(style);
}


// DEBUG
var sJumpDebug = true;

// Inspect type w->word p->position
var inspectType = 'w';

// 允许选择的元素.
var inspectEl = 'div,p,a,input,button,form,b,i,span,h1,h2,h3,h4,h5';

// 排除的元素
var excludeInspectEl = '.sJump-menu *,.sJump-menu,.sJump-popup *, .sJump-popup';

// 日志输出
var log;
if (sJumpDebug) {
    log = function(arguments){
        Function.prototype.call.call(console.log, console, arguments);
    }
}else{
    log = function(){};
}

if (window !== window.parent) {
    log('skip frame');
    throw{name:'iframe', message:'skip iframe'}
}


// 载入提示.
log("sJump load!")
loadCss();
log("load css")


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
sJump_update_favicon = GM_getValue("sJump_update_favicon")

log({"sJump_positions": sJump_positions});
log({"sJump_searchs": sJump_searchs});
log({"sJump_forms":sJump_forms});
log({"sJump_update_favicon":sJump_update_favicon});

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
    var html = m(function(){/*
            <div class="sJump-menu sJump">
                <a href="#" class="sJump-icon">s</a>
                <a href="#" class="sJump-inspect-search-wrods">w</a>
                <a href="#" class="sJump-inspect-search-position">p</a>
                <a href="#" class="sJump-cancle-inspect">c</a>
            </div>
            <div class="sJump-popup sJump">
                <div class="sJump-tabs">
                    <ul class="tab-name">
                        <li index="1">选择搜索</li>
                        <li index="2">分类</li>
                        <li index="3">导入导出</li>
                        <li index="4">关于</li>
                    </ul>
                    <ul class="tab-list">
                        <li index="1" class="tab-content sJump-man-search"> 
                            <div class="sJump-man-search-list"> </div>
                            <div class="sJump-btn-group">
                                <input class="sJump-save sJump-btn" value="保存" type="button">
                                <input class="sJump-update-favicon sJump-btn" value="更新Fav" type="button">
                                <input class="sJump-toggle-select sJump-btn" value="反选" type="button">
                                <input class="sJump-del-search sJump-btn" value="删除" type="button">
                            </div>
                        </li>
                        <li index="2" class="tab-content"> 
                        </li>
                        <li index="3" class="tab-content">
                            <textarea class="import">
                            </textarea>
                            <div class="sJump-btn-group">
                                <input type="button" class="sJump-import sJump-btn" value="导入">
                            </div>
                        </li>
                        <li index="4" class="tab-content about">
                            repo:https://github.com/h2ero/search-jump
                            <br>
                            by: h2ero <122750707@qq.com> 
                        </li>
                    </ul>
                </div>
            </div>
            <canvas id="sJump-favicon" width="16px" height="16px"></canvas>
        */}); 

    $('body').after(html);

    // 添加到选择
    var checkbox = "";
    for(i in sJump_searchs){
        var checked = '';
        if (sJump_searchs[i].enable == true) {
            checked = ' checked="checked" ';
        }
        checkbox += "<li><input type=\"checkbox\" "+checked+"value=\""+i+"\">"+unescape(atob(i))+"</li>";
    }

    $(".sJump-popup .tab-content[index='1'] div.sJump-man-search-list").html(checkbox);

    // 添加到导入
    $('.sJump-tabs .import').text(JSON.stringify({
        // DOM信息,
        'sJump_positions':sJump_positions,
        // 提交URL, 是否启用, favicon
        'sJump_searchs':sJump_searchs,
        // cssPath , search name
        'sJump_forms':sJump_forms
    }));

    var sJump = {};
    sJump.event = {};
    
    // save form --------------------------------------------------------------------------------
    sJump.clearInspect = function(){
        $(".sJump-inspect-notify").remove();
        $('.sJump-inspect').removeClass('sJump-inspect');
    }

    sJump.getFormAction = function(el){
        while(el.parent()[0].nodeName != 'FORM' && el.parent()[0].nodeName != 'BODY'){
            el = el.parent()
            console.log(el.parent()[0].nodeName);
        }
        var action = el.parent().attr("action");
        console.log(action);
        if (!/^http/.test(action) && action != undefined) {
            if (!/^\//.test(action)) {
                action = document.location.origin+"/"+action;
            } else {
                action = document.location.origin+action;
            }
        }
        return  action;
    }

    sJump.event.inspect = function(e){
        log("%chover:%c"+cssPath($(this)[0]), "color:green", "color:black");
        sJump.clearInspect();
        $(this).addClass('sJump-inspect');
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
        el = $(e.target);
        log("%cclick:%c"+cssPath(el), "color:red", "color:black");
        if (el[0].nodeName=='INPUT') {
            var action = sJump.getFormAction(el)
            var sUrl = '';
            if (action != undefined) {
                var queryName = el.attr("name");
                sUrl = action +"?"+ queryName + "=";
            }else{
                sUrl = prompt("please input search url")
            }
            console.log(sUrl, cssPath(el))
            sJump.store.saveSearch(sUrl, cssPath(el[0]))
            log(sUrl);
        } else if(inspectType == 'w'){
            sJump.store.saveSearch(undefined, cssPath(el[0]))
        }else{
            console.dir(e.ctrlKey);
            var method = 'after';
            if (e.ctrlKey) {
                method = 'before';
            }
            sJump.store.savePosition(cssPath(el[0]), method)
        }
        e.stopPropagation();
        sJump.event.unbind();
        return false;
    }

    // store value --------------------------------------------------------------------------------
    sJump.store = {}
    sJump.store.saveSearch = function(url, cssPath){
        var searchName = prompt("input search");
        if (searchName && url) {
            sJump_searchs[btoa(escape(searchName))] = {url:url, enable:true}
            var value = JSON.stringify(sJump_searchs);
            GM_setValue("sJump_searchs", value)
            log("%csave search:"+value,"color:blue")

        }
        //forms
        sJump_forms[document.domain] = {searchName:btoa(escape(searchName))}
        if (sJump_forms[document.domain].cssPath) {
            sJump_forms[document.domain].cssPath.concat(sJump_forms[document.domain].cssPath);
        }else{
            sJump_forms[document.domain].cssPath = [cssPath];
        }

        var value = JSON.stringify(sJump_forms);
        GM_setValue("sJump_forms", value);
        log("%csave form:"+value,"color:blue");

    }
    sJump.store.delSearch = function(searchHash){
        if (searchHash) {
            console.log(searchHash);
            delete sJump_searchs[searchHash];
            var value = JSON.stringify(sJump_searchs);
            GM_setValue("sJump_searchs", value)
            console.log('delete'+unescape(atob(searchHash)));
        }
    }
    sJump.store.savePosition = function(cssPath,method){
        var sJump_position = prompt("input position");
        if (sJump_position) {
            console.log(sJump_position);
            sJump_positions[document.domain] = [{cssPath:cssPath, method:method}]
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
            for( index in sJump_forms[document.domain].cssPath){
                var el = $(sJump_forms[document.domain].cssPath[index]);
                var word = "";
                if (el[0].nodeName == 'INPUT') {
                    word = el.val();
                }else{
                    word = el.text();
                }
                if (word) {
                    return word;
                }
            }
            return "";
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
            log("catch search word:"+word)
            for (i in sJump_searchs) {
                if (sJump_searchs[i].enable == true) {
                    searchDiv += "<a href=\""+sJump_searchs[i].url+word+"\" ><img src=\""+sJump_searchs[i].favicon+"\">"+unescape(atob(i))+"</a>"
                }
            };
            var logo = "<b style=\"color: rgb(0, 0, 0);\">SJ</b>";
            console.log(sJump_positions[document.domain]);
            for( index in sJump_positions[document.domain]){
                var pathInfo = sJump_positions[document.domain][index];
                log("add search bar:"+pathInfo.cssPath);
                if (pathInfo.method == 'after') {
                    $($(pathInfo.cssPath)[0]).after("<div class=\"sJump-search-bar\">"+logo+searchDiv+"</div>")
                }else{
                    $($(pathInfo.cssPath)[0]).before("<div class=\"sJump-search-bar\">"+logo+searchDiv+"</div>")
                }
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
        log(domain);
        var canvas = document.getElementById('sJump-favicon');
        var context = canvas.getContext('2d');
        var imageObj = new Image();

        imageObj.onload = function() {
            context.clearRect(0,0,16,16);
            context.rect(20,20,150,100);
            context.fillStyle="white";
            context.drawImage(imageObj, 0, 0);
            context.fill();
            log(canvas.toDataURL());
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
        $('body').bind("mousedown", sJump.event.doInspect);
    }

    sJump.event.unbind = function(){
        // inspect ---------------------------------------------------------------------------
        iel.unbind("mouseenter", sJump.event.inspect);
        iel.unbind("mouseleave", sJump.clearInspect);
        $('body').unbind("mousedown", sJump.event.doInspect);
    }

    $(".sJump-icon").click(function(){
        $(".sJump-popup").center().toggleClass("sJump-popup-show");
        return false;
    });



    $(".sJump-inspect-search-wrods, .sJump-inspect-search-position").click(function(){
        inspectType = $(this).text();
        log("inspect start!");
        sJump.event.bind();
        return false;
    });

    $(".sJump-cancle-inspect").click(function(){
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
        GM_setValue('sJump_update_favicon', 1);
        window.location = 'http://www.google.com/s2/favicons?domain=google.com'
    });

    if (sJump_update_favicon == 1) {
        log("update favicion");
        $(".sJump-popup input[type='checkbox']").each(function(){
            if ($(this).attr("checked")=='checked') {
                sJump.update.favicon($(this).val());
            }
        });
        GM_setValue('sJump_update_favicon', 0);
    }
    $(".sJump-popup .tab-name li").click(function(){
        var index = $(this).attr('index');
        $('.sJump-tabs .tab-content').hide();
        $('.sJump-tabs .tab-content[index="'+index+'"]').show();
    });

    // 导入操作
    $(".sJump-import").click(function(){
        var data = JSON.parse($('.sJump-tabs .import').val());
        log('improt data');
        for (i in data) {
            GM_setValue(i, JSON.stringify(data[i]));
        }
    });

    // toggle select
    $(".sJump-toggle-select").click(function(){
        var el = $("input", $(this).parent());
        el.each(function(){
            $(this).prop("checked", !$(this).prop("checked"));
        });
    });

    // delete search
    $('.sJump-del-search').click(function(){
        $(".sJump-man-search input[type='checkbox']").each(function(){
            if($(this).attr('checked') == 'checked'){
                var searchName = $(this).val()
                // delete
                var isDel = confirm("deltet "+ unescape(atob(searchName)) + "?")
                if (isDel) {
                    sJump.store.delSearch(searchName);
                    $(this).parent().fadeOut();
                }
            }
        });
    });


    sJump.dom.addSearchBar();

    $(".sJump-search-bar img").on('error', function(){
        log('image load error');
        // todo replace src with domain.com/favicon
    });

});
