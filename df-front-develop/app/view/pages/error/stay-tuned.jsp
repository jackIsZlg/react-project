<% extends "../base/layout.jsp" %>
<% block title %>下线<% endblock %>
<% block content %>
<div id="app">
    <div id="content">
        <div class="down">此功能已下线</div>
        <div class="to-index">
            <a class='stay' href="/">回到首页</a>
            <span class="error-time-count">5秒</span>后，自动回到首页
        </div>
    </div>
</div>
<% endblock %>