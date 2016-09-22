$('#goBack').click(function(){
    history.go(-1)
})
$('#register').click(function(){
    location.href = 'register.html'
})
$('form').submit(function(ev){
    ev.preventDefault()
    var pass = $(':password').map(function(){
        return $(this).val()
    })
    if( pass[0] == pass[1] ){
        var data = $(this).serialize()
        $.post('/user/register', data, function(res){
            console.log(res)
            if( res.code == 'success' ){
                //alert(res.message )
                $('.modal-body').text(res.message)
                $('.modal').modal('show').on('hidden.bs.modal', function(){
                    if( res.code == 'success' ){
                        location.href = 'login.html'
                    }
                })


            } else {
                //alert('该用户已注册')
                $('.modal-body').text(res.message)
                $('.modal').modal('show')
            }
        })
    } else {
        //alert('两次输入的密码不一致，请重新输入')
        $('.modal-body').text('两次输入的密码不一样！')
        $('.modal').modal('show')
    }
})