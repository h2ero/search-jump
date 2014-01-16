// search jump -------------------------------------------------------------------------------- 
//
// @author: h2ero <122750707@qq.com> 
// @date 2013-09-23 13:41:16
// https://gist.github.com/h2ero/6666782
//
// comment --------------------------------------------------------------------------------
$(function(){
    $('.sJump-tabs .tab-name li').click(function(){
        var index = $(this).attr('index');
        $('.sJump-tabs .tab-content').hide();
        $('.sJump-tabs .tab-content[index="'+index+'"]').show();
    });
});
