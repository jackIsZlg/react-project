<% extends "../mobile/base/layout.jsp" %>
<% block title %>操作成功<% endblock %>
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
<div class="wrapper">
    <span class="success"></span><span>操作成功</span>
</div>
<% endblock %>