<html>
<head>
    <meta charset="utf-8" />
    <meta name="keywords" content="">
    <% block meta %>
    <meta name="description" content="DeepFashion，服装设计师灵感的海洋！帮你收集最新的潮流街拍，秀场大片。更有各色服装手绘，花型文字等设计素材激发你的设计灵感">
    <% endblock %>
    <script type="text/javascript" src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/tingyun-rum.js"></script>
    <title><% block title %>DeepFashion<% endblock %></title>
    <% block style %><% endblock %>
    <link rel="shortcut icon" href="/public/resource/favicon.ico" type="image/x-icon">
    <script type="text/javascript">
        if (Element && !Element.prototype.matches) {
            var proto = Element.prototype;
            proto.matches = proto.matchesSelector ||
                proto.mozMatchesSelector || proto.msMatchesSelector ||
                proto.oMatchesSelector || proto.webkitMatchesSelector;
        }
        window.zhuge = window.zhuge || [];window.zhuge.methods = "_init debug identify track trackLink trackForm page".split(" ");
        window.zhuge.factory = function(b) {return function() {var a = Array.prototype.slice.call(arguments);a.unshift(b);
            window.zhuge.push(a);return window.zhuge;}};for (var i = 0; i < window.zhuge.methods.length; i++) {
            var key = window.zhuge.methods[i];window.zhuge[key] = window.zhuge.factory(key);}window.zhuge.load = function(b, x) {
            if (!document.getElementById("zhuge-js")) {var a = document.createElement("script");var verDate = new Date();
                var verStr = verDate.getFullYear().toString()+ verDate.getMonth().toString() + verDate.getDate().toString();
                a.type = "text/javascript";a.id = "zhuge-js";a.async = !0;a.src = (location.protocol == 'http:' ? "http://sdk.zhugeio.com/zhuge.min.js?v=" : 'https://zgsdk.zhugeio.com/zhuge.min.js?v=') + verStr;
                a.onerror = function(){window.zhuge.identify = window.zhuge.track = function(ename, props, callback){if(callback && Object.prototype.toString.call(callback) === '[object Function]')callback();};};
                var c = document.getElementsByTagName("script")[0];c.parentNode.insertBefore(a, c);window.zhuge._init(b, x)}};
        window.zhuge.load('f70f69943d324bd9aceacb7f30e1947f',{autoTrack:true});//配置应用的AppKey
        // gio
        !function(e,t,n,g,i){e[i]=e[i]||function(){(e[i].q=e[i].q||[]).push(arguments)},n=t.createElement("script"),tag=t.getElementsByTagName("script")[0],n.async=1,n.src=('https:'==document.location.protocol?'https://':'http://')+g,tag.parentNode.insertBefore(n,tag)}(window,document,"script","assets.growingio.com/2.1/gio.js","gio");
        gio('init','941227602a3bdadd', {});
        gio('send');
    </script>
    <script src="/public/{{ctx.app.config.version}}/common/common.js"></script>
    <script src="/public/{{ctx.app.config.version}}/common/vendor.js"></script>
    <script src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/jquery.min.js"></script>
    <script src="//web-monitor.zhiyitech.cn/public/catch.js"></script>
    <link rel="stylesheet" type="text/css" href="/public/{{ctx.app.config.version}}/style/index.css"/>
</head>
<body>
    <div id="progress" class="start"></div>
    <div id="header">
        <div class="container">
            <div id="logo">
                <a href="/index"><i class="iconfont icon-new-logo"></i></a>
            </div>
            <div>
                <ul id="channel">
                    <li class="channel-0">Instagram</li>
                    <li class="channel-2">订阅</li>
                    <li class="channel-ins">Ins博主</li>
                    <!-- <li class="channel-10">发现</li> -->
                    <li class="channel-4">秀场</li>
                    <li class="channel-9">精选集</li>
                    <li class="channel-download">
                        <span>下载App</span>
                        <div class="download-code">
                            <img src="https://zhiyi-image.oss-cn-hangzhou.aliyuncs.com/self-selected/1534925554121_580.png?x-oss-process=image/resize,w_500/format,jpg/interlace,1" alt="">
                            手机扫描二维码<br/>
                            下载DeepFashion App
                        </div>
                    </li>
                </ul>
            </div>
            <div class="header-right">
                <div id="login"></div>
                <div id="notice-pop"></div>
                <div id="upload-img"></div>
                <div id="btn-search"></div>
            </div>
        </div>
    </div>
    <% block content %><% endblock %>
    <div id="df-side-wrapper"></div>
    <script src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/react.min.js"></script>
    <script src="https://cdn.bootcss.com/babel-polyfill/7.0.0-alpha.19/polyfill.min.js"></script>
    <script src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/qrcode-arale.js"></script>
    <script src="https://pv.sohu.com/cityjson"></script>
    <% block otherjs %><% endblock %>
    <% if component %>
    <script src="/public/{{ctx.app.config.version}}/pages/{{component}}.js"></script>
    <% endif %>
    <% block js %><% endblock %>
</body>
</html>
