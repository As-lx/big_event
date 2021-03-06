$(function () {
  $("#login").on("click",function () {
    console.log("hello")
    $(".sign-box").hide();
    $(".log-box").show();

  })
  $("#signUp").on("click",function () {
   $(".log-box").hide();
   $(".sign-box").show();
  })
  //自定义form验证规则，从layui中调用form
  let form=layui.form
  //从layui中调用layer
  let layer=layui.layer
  form.verify({
    //自定义一个验证规则，属性名随便写
    pass: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ],
   //校验两次密码是否一致
    repass:function(val){
      //通过形参拿到是设置了该属性的表单元素的值，在此处即确认密码框中的值
      let password=$(".sign-box [name='password']").val();
      if(val !== password){
        return "两次密码不一致,请重新输入!";
      }
    }
  })
  //ajaxPrefilter函数的作用
  //在每次调用$.get()或者$.post()的时候，都会预先调用这个函数
  //将地址与配置的参数拼接
  $.ajaxPrefilter(function (options) {
    //再发起真正的ajax请求之前拼接出真正的url路径
    options.url="http://ajax.frontend.itheima.net"+options.url;
  })
  //登录按钮功能
  //注册按钮功能
  $("#sign").on("click",function (e) {
    //组织默认表单的跳转
   e.preventDefault();
   // let form=new FormData($("#sign_form")[0]);
   // console.log(form);
   $.ajax({
     type:"post",
     data: {username:$("#sign_form [name='username']").val(),
            password:$("#sign_form [name='password']").val()
            },
     url:"/api/reguser",
     success:function (res) {
       if(res.status!==0){
         return layer.msg("注册失败");
       }
       layer.msg("注册成功,请登录");
       //模拟点击，跳转到登陆页面
       $("#login").click()
     }

   })
  })
  //登录按钮
  $("#login-form").submit(function (e) {
   e.preventDefault();
   $.ajax({
     method:"post",
     url:"/api/login",
     data:$(this).serialize(),
     success:(res)=>{
        if(res.status!==0){
          return layer.msg("登陆失败")
        }
        // console.log(res.token);
        //跳转后台主页
       localStorage.setItem("token",res.token);
       location.href="./index.html"
    }
   })

  })
})