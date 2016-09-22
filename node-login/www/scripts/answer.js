/**
 * Created by Administrator on 2016/9/20.
 */
console.log($.cookie() )
var petname = $.cookie('petname')
if(petname){
    $('.dropdown-toggle').find('span').last().text(petname)
}
$('form').submit(function(ev){
    ev.preventDefault()
    var data = $(this).serialize()
    $.post('/answer', data, function(res){
        console.log(res)
        location.href = '/'
    })
})