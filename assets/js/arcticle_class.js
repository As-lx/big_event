$(function () {
   let layer=layui.layer;
   let layer_add_index=null;
   let layer_edit_index=null;
   let form=layui.form;
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
      if(res.responseJSON.status===1 && res.responseJSON.message===
          "身份认证失败！"){
        localStorage.removeItem("token");
        location.href="./login.html";
      }
    }
  })
  //渲染数据
  getAcrticleData()
  function getAcrticleData() {
    $.ajax({
      method:"GET",
      url:"/my/article/cates",
      success:(res)=>{
        let htmlStr=template("tmp_table",res);
        $("tbody").html(htmlStr)
      }
    })
  }
  //添加类别的弹出层
  $("#btn_add").on("click",function () {
    //保存弹出层缩影
    layer_add_index=layer.open({
      type:1,
      area:["500px","250px"],
      title: '添加文章分类',
      content: $("#addClass").html()
    })
  })
  //动态添加的元素需要通过代理的方式添加事件，否则绑定事件无法生效
  $("body").on("submit","#form-add",function (e) {
    e.preventDefault();
    $.ajax({
      type:"post",
      url:"/my/article/addcates",
      data:$("#form-add").serialize(),
      success:(res)=>{
        if(res.status!==0){
          layer.msg("添加文章类别失败")
        }

        layer.msg("添加类别成功");
        //自动关闭弹出层
        layer.close(layer_add_index);
        getAcrticleData();
    }
    })
  })
  //为编辑按钮添加事件，弹出层，采用事件冒泡的方式
  $("tbody").on("click",".btn-edit",function () {
     layer_edit_index=layer.open({
       type:1,
       area:["500px","250px"],
       title: '修改文章分类',
       content: $("#editClass").html()
     })
    let id=$(this).attr("data-id");
     $.ajax({
       method:"get",
       url:"/my/article/cates/"+id,
       success:(res)=>{
         //快速给表单填充数据，需要设置form表单的lay-filter属性
         form.val("form-edit",res.data);
       }
     })
  })
  //修改分类
  $("tbody").on("submit","#form-edit",function (e) {
    e.preventDefault();
    $.ajax({
      method:"post",
      url:"/my/article/updatecate",
      data:$(this).serialize(),
      success:(res)=>{
        if(res.status!==0){
          layer.msg("修改失败");
        }
        layer.msg("修改成功");
        layer.close( layer_edit_index);
        getAcrticleData();
      }
    })

  })
  //删除文章
  $("tbody").on("click",".layui-btn-danger",function (){
    let id=$(this).attr("data-id");
    layer.confirm('确定删除分类?', {icon: 3, title:'提示'}, function(index){
      $.ajax({
        method:"get",
        url:"/my/article/deletecate/"+id,
        success:(res)=>{
          if(res.status!==0){
            return layer.msg("删除失败");
          }
          layer.msg("删除成功");
          //关闭confirm页面
          layer.close(index);
          getAcrticleData();
        }
      })

    });

  })
})