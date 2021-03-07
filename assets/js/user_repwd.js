$(function () {
  let form=layui.form;
  let layer=layui.layer;
  $.ajaxPrefilter(function (options) {
    //再发起真正的ajax请求之前拼接出真正的url路径
    options.url = "http://ajax.frontend.itheima.net" + options.url;
    //统一为有权限的接口，设置headers请求头,只给需要访问权限的url添加请求头
    if (options.url.indexOf("/my/") !== -1) {
      options.headers = {
        Authorization: localStorage.getItem("token")
      }
    }
  })
  form.verify({
    pwd: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],
    newpwd:function(val){
      let oldPwd=$(".layui-input-oldPwd").val();
      if(val ==oldPwd){
        return "两次密码一致,请输入不同的密码!";
      }
    },
    repwd:function(val){
      //通过形参拿到是设置了该属性的表单元素的值，在此处即确认密码框中的值
      let newpwd=$(".layui-input-newPwd").val();
      if(val !== newpwd){
        return "两次密码不一致,请重新输入!";
      }
    }
  })
  $(".layui-form").submit(function (e) {
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/my/updatepwd",
      data:$(this).serialize(),
      success:function (res) {
          if(res.status!==0){
            layer.msg("更新密码失败！");
          }
        layer.msg("更新成功");
          //重置表单
        $(".layui-form")[0].reset();
      }
    })
  })
})