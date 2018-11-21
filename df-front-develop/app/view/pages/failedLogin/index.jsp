<% extends "../mobile/base/layout.jsp" %>
<% block title %>操作失败<% endblock %>
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
        background: red url('/public/resource/close.png') no-repeat center 8px;
        background-size: 50% 50%;
        border-radius: 100%;
    }
</style>
<% endblock %>

<% block content %>
<div class="wrapper"> <span class="success"></span><span>操作失败</span></div>
<% endblock %>