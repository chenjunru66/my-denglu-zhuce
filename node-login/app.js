var express = require('express'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    multer = require('multer'),
    fs = require('fs')
//实例化对象
var app = express(),
    form = multer()

//设置文件存储
var storage = multer.diskStorage({
        destination: 'www/uploads',
        filename: function(req, file, callback){
            var petname = req.cookies.petname
            callback(null, petname + '.jpg')
        }
    }),
    uploads = multer({storage})

//设置中间件
app.use(express.static('www'))
app.use(bodyParser.urlencoded({extended:false}))
app.use(cookieParser())
/*-------------------- 注册  --------------------*/
app.post('/user/register', function(req, res){
    console.log(req.body)
    req.body.ip = req.ip
    req.body.date = new Date()
    //将用户名作为文件名保存，判断用户名是否存在，如果存在，返回用户已注册，否则添加文件
    /*前提是判断文件夹是否存在，如果存在，直接保存文件，否则，添加文件夹后保存文件*/
    var fileName = 'user/' + req.body.petname + '.txt'
    function send(code, message){
        res.status(200).json({code, message})
    }
    function saveFile(){
        fs.exists(fileName, function(ex){
            if(ex){
                send('registered', '该用户已注册')
            } else {
                fs.appendFile(fileName, JSON.stringify(req.body),  function(err){
                    if(err){
                        send('file error', '系统错误哦')
                    } else {
                        send('success', '恭喜，注册成功，请登录')
                    }
                })
            }
        })
    }
//    文件夹是否存在
    fs.exists('user', function(ex){
        if( !ex ){
            fs.mkdirSync('user')
            saveFile()
        } else {
            saveFile()
        }
    })
})

/*----------------  登录请求  -------------------*/
app.post('/user/login', function(req, res){
    console.log(req.body)
//    判断用户是否存在，如果存在，判断密码是否正确 登录错误提示密码错误，不存在则提示用户未注册
    function send(code, message){
        res.status(200).json( {code, message} )
    }
    var fileName = 'user/' + req.body.petname + '.txt'
    fs.exists(fileName, function(ex){
        if( !ex ){
            send('register', '该用户未注册')
        } else {
            fs.readFile(fileName,  function(err, data){
                if( err ){
                    send('file error', '系统错误哦！')
                } else {
                    var user = JSON.parse(data)
                    if( user.password == req.body.password ){
                        res.cookie('petname', req.body.petname)
                        send('success', '用户登录成功')
                    } else {
                        send('failed', '用户名或密码错误')
                    }
                }
            })
        }
    })
})

/*---------------- 退出请求 ---------------------------*/
app.get('/user/signout', function(req, res){
    res.clearCookie('petname')
    res.status(200).send('success')
})
/*--------------------文件上传处理 --------------------*/
app.post('/user/photo',uploads.single('photo'), function(req, res){
    res.status(200).json({code:'success', message:'上传成功,'})
})

/*------------------------提问请求---------------------*/
app.post('/ask', function(req, res){
    var petname = req.cookies.petname

    console.log(req.body)
//    把当前提问的内容保存至某个文件中，文件名以当前时间取名，便于查询及后期的回答
//    设置时间+Ip
    var time = new Date()
    var time1 = (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString()
    req.body.petname = petname
    req.body.ip = req.ip
    req.body.time1 = time1
    req.body.time =time
//封装返回服务器信息的方法
    function send(code, message){
        res.status(200).json({ code, message })
    }
//    封装保存文件的方法
    function saveFile(){
    //    设置文件名 -- 以当前时间取名
        var fileName = 'questions/' + time.getTime() + '.txt'
        fs.appendFile(fileName, JSON.stringify(req.body), function(err){
            if( err ){
                send('error', '保存文件失败')
            } else {
                send('success', '问题提交成功')

            }
        })
    }
//    判断文件夹是否存在
    fs.exists('questions', function(ex){
        if( !ex ){
            fs.mkdirSync('questions')
            saveFile()
        } else {
            saveFile()
        }
    })
})
/*----------------- 首页获取提问的内容信息 ---------------*/
app.get('/questions', function(req, res){
    function send(code, message, questions){
        //code:读取是否成功，message:是否成功相对应的信息;questions:读到的文件的内容数据
        res.status(200).json({ code, message, questions })
    }

    function reads(i, files, questions, cb){
        var filePath = 'questions/' + files[i]
        if( i < files.length ){
            fs.readFile( filePath, function(err, data){
                if(err){
                    send('error', '获取数据失败')
                } else {
                    questions.push( JSON.parse(data) )
                }
                reads(++i, files, questions, cb)
            })
        } else {
            cb()
        }
    }
//    判断文件夹是否存在
    fs.exists('questions', function(ex){
        if(!ex){
            send('error', '文件系统错误','空')
        } else {
        //    读取文件夹内部的所有文件的内容
            fs.readdir('questions', function(err, files){
                if(err){
                    send('error', '文件系统错误')
                } else {
                    var files = files
                    //console.log(files)
                    var questions = []
                    reads(0, files, questions, function(){
                        send('success', '获取数据成功', questions)
                    })
                }
            })
        }
    })
})
//回答数据处理
app.post('/answer',function(req,res){
    var aname = req.cookies.petname
    var fileName = 'questions/' + req.cookies.questions + '.txt'

    req.body.ip = req.ip
    req.body.time = new Date()
    req.body.time1 = (new Date()).toLocaleDateString() + ' ' + (new Date()).toLocaleTimeString()
    req.body.petname = aname

    //fs.appendFile(fileName,',' + JSON.stringify(req.body),function(err){
    //       if(err){
    //           res.send('保存失败')
    //       }else{
    //           res.send('保存成功')
    //       }
    //})

    fs.readFile(fileName,function(err,data){
        if(err){
            res.send('保存失败')
        }else{
            var datas = JSON.parse(data)
        //    data:{}
        //    console.log(datas)
            if(!datas.answers){
                datas.answers = []
            }

            datas.answers.push(req.body)
            fs.writeFile(fileName,JSON.stringify(datas),function(err){
                if(err){
                    res.send('保存数据失败')
                }else{
                    res.send('回答提交成功')
                }
            })
        }
    })



})


app.listen(4000, function(){
    console.log( 'ask-answer is runnig' )
})
