$(function () {
   let layer=layui.layer;
   let form =layui.form;
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
  // 1. 初始化图片裁剪器
  var $image = $('#image')

  // 2. 裁剪选项
  var options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }

  // 3. 初始化裁剪区域
  $image.cropper(options)
  initEditor();
  //请求文章类别
  getArticeleClass()
  function getArticeleClass() {
     $.ajax({
       method:"get",
       url:"/my/article/cates",
       success:(res)=>{
         if(res.status!==0){
           return layer.msg("获取文章类别失败")
         }
          let htmlStr=template("option",res);
         $("#select_type").html(htmlStr);
         //渲染成功后，一定要加form.render()，对表单进行重新渲染
         form.render();
       }

     })
  }
  //上传图片
  $("#uploadImg").on("click",function () {
     $("#imgFile").click();
  })
  //获取input的change事件，监听用户是否选择文件
  $("#imgFile").on("change",function (e) {
    if (e.target.files.length===0){
      return layer.msg("请选择文件")
    }
    let file=e.target.files[0];
    let newImgURL = URL.createObjectURL(file);
    $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
  })
  let art_state="已发布";
  $('#save_2').on("click",function () {
    art_state="草稿";
  })
  $("#articleForm").on("submit",function (e) {
    e.preventDefault();
    //基于form表单，快速创建formdata对象
    let fd=new FormData($("#articleForm")[0]);
    fd.append("state",art_state);
    //将裁减的图片，输出为文件
    $image.cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
          width: 400,
          height: 280
        }).toBlob(function(blob) {// 将 Canvas 画布上的内容，转化为文件对象
          // 得到文件对象后，进行后续的操作
          //将文件存储到fd中
          fd.append("cover_img",blob);
          publish(fd)
          })
  })
  //发布文章
  function publish(fd) {
    //发起ajax请求
    $.ajax({
      type: "post",
      url: "/my/article/add",
      data: fd,
      //fd格式的数据必须添加以下配置项
      contentType:false,
      processData:false,
      success: (res) => {
        if (res.status !== 0) {
          return layer.msg("发布文章失败");
        }
        layer.msg("发布成功");
        //跳转至文章列表页
        location.href="./artilce_list.html"
      }
    })
  }
  //
})