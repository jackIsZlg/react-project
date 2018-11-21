<% extends "../base/layout.jsp" %>
<% block title %>DeepFashion-拒绝访问<% endblock %>
<% block content %>
<div id="app">
    <div id="content">
        <div class="deny-folder-pane container">
            <i class="icon-folder-private"></i>
            <div class="main-tip">啊哦！这个精选集的状态为私密，不能让别人查看</div>
            <div class="sub-tip">如果是别人分享的，请联系创建者调整状态为公开后，刷新查看</div>
            <a href="/" class="btn-gradient-deep-blue btn-round">返回首页</a>
        </div>
    </div>
</div>
<% endblock %>