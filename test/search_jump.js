// search jump -------------------------------------------------------------------------------- 
//
// @author: h2ero <122750707@qq.com> 
// @date 2013-09-23 13:41:16
// https://gist.github.com/h2ero/6666782
//
// comment --------------------------------------------------------------------------------
$(function(){
    dd  = function (e){
        console.dir(e.data);
    }
    $("body").bind("click", {el:this},dd);

    $("body").bind("click", function(){
        console.log(32223);
    });

    $("a").click(function(){
        console.log("unbind");
        $("body").unbind("click", function(){
            console.log(333);
        });
    });
});
