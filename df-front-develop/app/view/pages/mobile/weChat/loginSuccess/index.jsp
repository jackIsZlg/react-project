<% extends "../../base/layout.jsp" %>
<% block title %>登录成功<% endblock %>
<% block style %>
<style>
    .wrapper {
        margin-top: 100px;
        text-align: center;
    }

    .wrapper * {
        vertical-align: middle;
    }

    .success {
        display: inline-block;
        width: 30px;
        height: 30px;
        margin-right: 5px;
        background: #09BB08 url(https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/success.png) no-repeat center 1px;
        background-size: 80% 80%;
        border-radius: 100%;
    }
</style>
<% endblock %>
<% block content %>
<body>
    <div class="wrapper">
        <span class="success"></span><span>登录成功</span>
        <div><span class="show">3</span>秒后，关闭当前窗口</div>
    </div>
    </body>
<% endblock %>
        