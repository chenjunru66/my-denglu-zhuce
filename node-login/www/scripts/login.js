$('#goBack').click(function(){
    history.go(-1)
})
$('#register').click(function(){
    location.href = 'register.html'
})
$('form').submit(function(ev){
    ev.preventDefault()
    var data = $(this).serialize()
    $.post('/user/login',data, function(res){
        //console.log(res)

        $('.modal-body').text( res.message )
        $('.modal').modal('show').on('hidden.bs.modal', function(){
            if( res.code == 'success' ){
                location.href = '/'
            }
        })

    })
})