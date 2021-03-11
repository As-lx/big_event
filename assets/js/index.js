$(function () {
  let layer=layui.layer;
  $.ajaxPrefilter((options)=>{
    options.url="http://ajax.frontend.itheima.net" +options.url
    //统一为有权限的接口，设置headers请求头,只给需要访问权限的url添加请求头
    if(options.url.indexOf("/my/") !== -1){
      options.headers={
        Authorization:localStorage.getItem("token")
      }
    }
    //全局统一挂载complete函数
    //无论请求是失败还是成功，都会执行complete回调函数
    options.complete=(res)=>{
      //获得返回的数据，res.responseJSON
      console.log("hello");
      if(res.responseJSON.status===1 && res.responseJSON.message===
          "身份认证失败！"){
        localStorage.removeItem("token");
        location.href="./login.html";
      }
    }
  })
  getUserInfo()
  //获取用户信息
  function getUserInfo() {
      $.ajax({
        method:"get",
        url:"/my/userinfo",
        //headers请求头配置对象
        success:(res)=>{
          if(res.status!==0){
            return layer.msg("获取用户信息失败")
          }
          //渲染用户名称和头像
          renderAvar(res.data);
          },
      })
  }
  //渲染用户头像
  function renderAvar(user) {
    let name=user.nickname || user.username
    $("#welcome").html("欢迎"+" "+name);
    //渲染用户头像
    if(user.user_pic){
       $(".layui-nav-img").attr('src',user.user_pic).show();
       $(".text-avatar").hide();
    }else{
      let first=name[0].toUpperCase();
      $(".text-avatar").hide().html(first).show();
      $(".layui-nav-img").hide();
    }
  }
  $("#btn_logout").on("click",function () {
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){
      //1.清空本地存储的token
      localStorage.removeItem("token");
      //2.重新跳转到登陆页面
      location.href="./login.html";
      //关闭confirm页面
      layer.close(index);
    });
  })

})