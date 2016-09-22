/**
 * Created by Administrator on 2016/9/20.
 */
//$('#user').click(function(){
//    location.href = 'login.html'
//})
console.log($.cookie() )
var petname = $.cookie('petname')
if( petname ){
    $('#user').find('span').last().text(petname)
} else {
    $('#user').removeAttr('data-toggle').find('span').last().click(function(){
        location.href = 'login.html'
    })
}
$('.dropdown-menu li').last().click(function(){

    $.get('/user/signout', null, function(res){
        //console.log(res)
        if( res == 'success' ){
            location.href = '/'
        }
    })
})
//如果存在登录用户名，可跳转到提问页面，否则，跳转到登录页面
$('#ask').click(function(){
    if( petname ){
        location.href = 'ask.html'
    } else {
        location.href = 'login.html'
    }
})
//显示提问的问题
$.get('/questions', null, function(res){
    console.log(res)
    var datas = res.questions
    console.log(datas)
    //console.log(datas[0].answers[0].content)
    var divs = ''
//    遍历取出所有的提问的内容
    for( var i = 0; i < datas.length; i++){
        var times = datas[i].time
        var fileName = new Date(times).getTime()
        //var len = datas[i].answers.length
        divs += "<div class='main' questions='"+ fileName + "'>"
        divs += "<div class='main-left'>"
        divs += "<img src='uploads/" + datas[i].petname + ".jpg' />"
        divs += "</div>"
        divs += "<div class='main-right'>"
        divs += "<h4>" + datas[i].petname + "</h4>"
        divs += "<p>" + datas[i].content + "</p>"
        divs += "<p>" + datas[i].time1 + "</p>"
        divs += "</div>"
        divs += "</div>"


        if(datas[i].hasOwnProperty('answers') == true){
            var  obj = datas[i].answers
            var len = obj.length
            console.log(len)
            for(var j= 0;j< len;j++){
                divs += "<div class='main' >"
                divs += "<div class='ans-left'>"
                divs += "<img src='uploads/" + datas[i].answers[j].petname + ".jpg' />"
                divs += "</div>"
                divs += "<div class='ans-right'>"
                divs += "<h4>" + datas[i].answers[j].petname + "</h4>"
                divs += "<p>" + datas[i].answers[j].content + "</p>"
                divs += "<p>" + datas[i].answers[j].time1 + "</p>"
                divs += "</div>"
                divs += "</div>"
            }
        }
        else{
            console.log('回答问题')
        }

    }
    $('.questions').html(divs)
    $('.main').click(function(){
        //console.log('111')
        $.cookie('questions',$(this).attr('questions'))
        if(petname){
            location.href = 'answer.html'
        }
        else{
            location.href = 'login.html'
        }
        //location.href = 'answer.html'
    })
})


