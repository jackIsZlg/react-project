<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8" />
    <meta name="viewport" content="user-scalable=0,width=device-width,initial-scale=1, minimum-scale=1, maximum-scale=1">
    <meta name="format-detection" content="telephone=no"/>
    <title><% block title %>DeepFashion<% endblock %></title>
    <% block style %><% endblock %>
    <link rel="shortcut icon" href="/public/favicon.ico" type="image/x-icon">
    <link rel="stylesheet" type="text/css" href="/public/{{ctx.app.config.version}}/style/mobileCommon.css"/>
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
    <script src="http://web-monitor.zhiyitech.cn/public/catch.js"></script>
    <script src="https://cdn.bootcss.com/zepto/1.2.0/zepto.min.js"></script>
    
</head>
<body>
    <% block content %><% endblock %>
    <div id="df-side-wrapper"></div>
    <script src="https://res.wx.qq.com/open/js/jweixin-1.2.0.js"></script>
    <% block js %><% endblock %>
    <% if component %>
    <script src="/public/{{ctx.app.config.version}}/pages/{{component}}.js"></script>
    <% endif %>
</body>
</html>
