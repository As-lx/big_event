$(function () {
  let form = layui.form;
  let layer = layui.layer;
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
    //自定义一个验证规则，属性名随便写
    nickname: function (val) {
      if (val.length < 6) {
        return "昵称的长度必须在1～6个字符";
      }
    }
  })
  initUserinfo()

  function initUserinfo() {
    $.ajax({
      type: "get",
      url: "/my/userinfo",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg("获取用户信息失败");
        }
        //form.val()为表单快速赋值
        form.val("form_userinfo", res.data)
      }
    })
  }

  $("#btn_reset").on("click", function (e) {
    //阻止表单默认重置行为
    e.preventDefault();
    //重新加载数据，就是重置
    initUserinfo();
  })
  //表单的提交，修改用户信息。
  $(".layui-form").on("submit", function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/my/userinfo",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) {
          layer.msg("修改信息失败")
        }
        //子窗口调父窗口中的方法
      parent.getUserInfo();
      }
    })
  })

})