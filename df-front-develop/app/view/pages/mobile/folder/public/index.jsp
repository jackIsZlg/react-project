<% extends "../../base/layout.jsp" %>
<% block title %>精选集详情<% endblock %>
<% block content %>
<div id="folder-share">
    <div class="folder-info">
        <div class="name"></div>
        <div class="num"></div>
        <div class="wrapper">
            <!-- <ul class="tag"></ul> -->
            <div class="avatar"></div>
            <div class="creator-name"></div>
        </div>
        <div class="intro">
        </div>
        <button class="collect-btn">收藏精选集</button>
    </div>
    <div class="folder-share-content">
        <div class="image-list">
            <div class="left-pane"></div>
            <div class="right-pane"></div>
        </div>
        <div class="loading">
            <span id="loading" style="display:none;">加载中……</span>
        </div>
    </div>
</div>
<% endblock %>
<% block js %>
<script>
    var folderId = '{{folderId}}'
</script>
<% endblock %>