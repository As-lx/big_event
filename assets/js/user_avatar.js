$(function() {
  var layer = layui.layer;
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
  // 1.1 获取裁剪区域的 DOM 元素
  var $image = $('#image')
  // 1.2 配置选项
  const options = {
    // 纵横比，宽高比：1/1
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
  }

  // 1.3 创建裁剪区域
  $image.cropper(options)

  // 为上传按钮绑定点击事件
  $("#btn_loadup").on("click",function () {
    //模拟上传文件的点击
      $("#file").click();
  })
  //更改图片切割区域的图片为选择的图片
  $("#file").on("change",function (e) {
   if(e.target.files.length==0){
     return layer.msg("请选择文件")
   }
   let file=e.target.files[0];
   //根据文件路径创建一个地址
    let path=URL.createObjectURL(file)
    $image
        .cropper("destroy")    //销毁旧的裁剪区域；
        .attr("src",path)      //重新设置文件路径
        .cropper(options)     //重新初始化裁剪区域
  })
  //头像上传
 $("#btn_loadup").on("click",function () {
   //获取用户裁剪后的图像
   var dataURL = $image
       .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
         width: 100,
         height: 100
       })
       .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字
 //调用接口把图像上传至服务器
   $.ajax({
     type:"post",
     url:"/my/update/avatar",
     data:{
       avatar:dataURL
     },
     success:(res)=>{
        if(res.status !==0){
          return layer.msg("上传头像失败");
        }
        layer.msg("上传成功");
        window.parent.getUserInfo();
     }
   })
 })

})
