$(function () {

  let layer=layui.layer;
  let laypage=layui.laypage;
  let form=layui.form
 //定义查询的参数，以便每次向服务器发出请求信息
  let q={
    "pagenum":1,
    "pagesize":2,
    "cate_id":"",
    "state":""
  }
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
  initCate();
  initTable();

  //初始化文章表格，加载数据
  function initTable() {
    $.ajax({
      method:"get",
      url:"/my/article/list",
      data:q,
      success:(res)=>{
        if(res.status!==0){
          return layer.msg("获取文章失败");}
        let htmlStr=template("article_list",res);
        $("tbody").empty(). append(htmlStr);
        renderPage(res.total);
    }
    })
  }
  //渲染分页栏
  function renderPage(total) {
    //渲染分页结构： laypage.render()
    laypage.render({
      elem: 'pageBox', //在何处渲染数据，id不需要加#
      count: total,   //总数据条数
      limit:q.pagesize, //每页显示的条数
      curr: q.pagenum ,  //选择默认的起始页
      //jump触发的条件：
      //1.点击页码的时候，会触发jump函数
      //2.调用了laypage.render()函数，自动触发jump函数
      jump: function(obj, first){
        //obj包含了当前分页的所有参数，比如：
        //obj.curr得到当前页，以便向服务端请求对应页的数据。
        q.pagenum=obj.curr;
        //将最新的条目数赋值给q.pagesize,更具layout重新渲染页面
        //obj.limit得到每页显示的条数
        q.pagesize=obj.limit;
        //重新请求数据，渲染页面
        //首次不执行
        if(!first){
          //first首次执行laypage.render()函数时，值为true
          //如果first值为true，则证明是通过第二2种方式触发的。
          //第二次执行之后值均为undefined。
          //借用此机制，解决jump函数平凡触发
          initTable();
        }
      },
      //自定义排版
      layout:["count","limit","prev","page","next","skip"],   //数组中元素的顺序，决定了页面显示的顺序
      //在定义了layout之后，通过limits设置可选的每页显示条数
      limits:[2,3,4,5]
    })
  }
  //通过template定义美化事间的函数
  template.defaults.imports.dataFormat=function(date){
    const dt=new Date(date);
    let y=dt.getFullYear();
    let m=addZero(dt.getMonth());
    let d=addZero(dt.getHours());
    let hh=addZero(dt.getHours());
    let mm=addZero(dt.getMinutes());
    let ss=addZero(dt.getSeconds());
    return y+"-"+m+"-"+d+" "+hh+":"+mm+":"+ss
  }
  //定义补零函数
  function addZero(n){
    return n<9 ? "0"+n:n
  }
  //获取文章分类

  function initCate() {
    $.ajax({
      method: "get",
      url: "/my/article/cates",
      success: (res) => {
        if (res.status !== 0) {
          layer.msg("获取分类失败！")
        }
        let htStr = template("articl_options", res);
        $("[name=cate_id]").html(htStr);
        //再插入数据后，一定要记得调用form.render()函数，否则可能看不到效果。
        form.render();

      }
    })
  }
  //通过代理的形式，为删除文章按钮绑定事件
  $("tbody").on("click",".btn-delete",function () {
    let id=$(this).attr("data-id");
    //获取删除按钮的个数，判断是否当前页有数据
    let leng=$(".btn-delete").length;
    layer.confirm('是否确认删除?', {icon: 3, title:'提示'}, function(){
      //do something
      $.ajax({
        method:"GET",
        url:"/my/article/delete/"+id, //如果url中动态参数是id，则这个这个值必须赋值给id，让其拼接入url中
        success:(res)=>{
          if(res.status!==0){
            return layer.msg("删除文章失败！")
          }
          layer.msg("删除成功！");
          //当删除数据成功后，需要判断当前页是否还有数据，
          //如果没有数据，则将页码值减1，在重新调用initTable()渲染表单
          if(leng===1) {
            q.pagenum= q.pagenum===1 ? 1:q.pagenum-1;
          }
          initTable();
        }
      })
    })
  })
  //给筛选表单绑定事件
  $("#select_form").submit(function (e) {
       e.preventDefault();
       let cate_id=$("[name=cate_id]").val();
       let state=$("[name=sate]").val();
        q.cate_id=cate_id;
        q.state=state;
        //通过initTable重新渲染数据
       initTable();

  })
})