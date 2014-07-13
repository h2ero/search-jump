// ==UserScript==
// @name        sJump
// @namespace   http://blog.h2ero.cn
// @include     *
// @version     0.1
// @description  search jump
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min.js
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
                .sJump * { all:initial-only-support-firefox; font-size:14px; list-style:none;}
                .sJump-inspect{ border:1px solid !important; } .sJump-inspect-notify{ color:#000; background-color:#f00; font-size:13px !important; padding:2px; z-index=999999;}
                .sJump-menu {z-index:999999999999; background: none repeat scroll 0 0 #2D2D2D; position: fixed; right: -70px; top: 50px; width: 80px; padding:0px 5px; box-shadow:1px 1px 10px #000; -moz-transition:all .2s ease; } .sJump-menu:hover{ right: 0px; } .sJump-menu a{ color:#bbb; text-decoration:none; font-size: 14px; line-height: 20px; padding:2px; font-weight:bold; } .sJump-menu a:hover{ color:#fff; }
                .sJump-search-bar{clear:both;margin:20px 0px;background:none repeat scroll 0 0 rgba(255, 255, 255, 0.23); box-shadow: 1px 1px 5px #000000; font-size: 14px;height: 30px; line-height: 30px; padding-left: 20px; position:relative; z-index:1000000;}
                .sJump-search-bar img{width:16px;height:16px;vertical-align:middle;margin-right:1px;}
                #sJump-favicon{top:300px;position:fixed;right:0px;}
                .sJump-search-bar a{color: #000000; margin: 0 5px; text-decoration: none; text-shadow: 1px 1px 1px #9C9C9C;}
                .sJump-import,.sJump-save,.sJump-update-favicon { position:absolute; bottom:5px; margin:0px 2px;background: none repeat scroll 0 0 #F5F5F5; border: medium none; border-radius: 3px 3px 3px 3px; color: #3E3D3D; }
                .sJump-save{right:10px;}
                .sJump-import{right:10px;}
                .sJump-update-favicon{right:70px;}
                .sJump-tabs ul.tab-name {width:90px; padding:0px 20px;}
                .sJump-tabs ul.tab-list {width:auto;padding:0px;}
                .sJump-tabs .tab-name li {
                    color:#74E806;
                    padding:5px;
                    cursor: pointer;
                }
                .sJump-tabs .tab-name li:hover{
                    color:#D7005F;
                }
                .sJump-popup-show{display:block !important; }
                .sJump-popup {
                    -moz-transition:all .9s ease;
                    background:none repeat scroll 0 0 rgba(35, 35, 35, 0.89);
                    box-shadow: 1px 2px 10px;
                    left: 100px;
                    padding: 10px 0;
                    position: absolute;
                    top: 100px;
                    min-width: 600px;
                    z-index: 20000000;
                    display:none;
                }
                .sJump-tabs .tab-name, .sJump-tabs .tab-list {
                    float:left;
                }
                .sJump-tabs .tab-name, .sJump-tabs .tab-list {
                }
                .sJump-tabs .tab-list .tab-content {
                    display:none;
                }
                .sJump-tabs .tab-list .tab-content:nth-child(1) {
                    display:block;
                    width:450px;
                }
                .sJump-tabs .tab-list .tab-content:nth-child(1) li{
                    float:left;
                    color:#D7005F;
                    margin:5px;
                }
                .sJump-tabs .tab-list .tab-content:nth-child(1) li input{
                    margin-left:1px;
                }
                .sJump-tabs .tab-content.about{
                    color:#ccc;
                    padding: 55px;
                }
                .sJump-tabs .tab-content .import{
                    height: 100px;
                    width: 450px;
                    margin-bottom: 25px;
                    margin-right: 25px;
                }
    */});
    $('body').after(style);
}
loadCss();


// DEBUG
var sJumpDebug = true;

// 允许选择的元素.
var inspectEl = 'div,p,a,input,button,form,b,i,span,h1,h2,h3,h4,h5';

// 排除的元素
var excludeInspectEl = '.sJump-menu *,.sJump-menu,.sJump-popup *, .sJump-popup';

// 日志输出
var log;
if (sJumpDebug) {
    log = function(arguments){
        Function.prototype.call.call(console.log, console, Array.prototype.slice.call(arguments));
    }
}else{
    log = function(){};
}

if (window !== window.parent) {
    log('skip frame');
    // throw{name:'iframe', message:'skip iframe'}
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
sJump_update_favicon = GM_getValue("sJump_update_favicon")

log(sJump_positions);
log(sJump_searchs);
log(sJump_forms);
log(sJump_update_favicon);

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
                <a href="#" class="sJump-add-search">+</a>
                <a href="#" class="sJump-after-search">-</a>
            </div>
            <div class="sJump-popup sJump">
                <div class="sJump-tabs">
                    <ul class="tab-name">
                        <li index="1">选择搜索</li>
                        <li index="2">更新fav</li>
                        <li index="3">导入导出</li>
                        <li index="4">关于</li>
                    </ul>
                    <ul class="tab-list">
                        <li index="1" class="tab-content"> 
                            <div> </div>
                            <input class="sJump-save" value="保存" type="button">
                            <input class="sJump-update-favicon" value="更新Fav" type="button">
                        </li>
                        <li index="2" class="tab-content"> 
                        </li>
                        <li index="3" class="tab-content">
                            <textarea class="import">
                            </textarea>
                            <input type="button" class="sJump-import" value="导入">
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

    $(".sJump-popup .tab-content[index='1'] div").html(checkbox);

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
        } else {
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


    sJump.dom.addSearchBar();

});
