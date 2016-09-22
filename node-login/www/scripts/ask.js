/**
 * Created by Administrator on the 2016/9/20.
 */
console.log($.cookie() )
var petname = $.cookie('petname')
if(petname){
    $('.dropdown-toggle').find('span').last().text(petname)
}
$('form').submit(function(ev){
    ev.preventDefault()
    var data = $(this).serialize()
    $.post('/ask', data, function(res){
        $('.modal-body').text(res.message)
        $('.modal').modal('show').on('hidden.bs.modal', function(){
            if( res.code == 'success' ){
                location.href = '/'
            }
        })
    })
})