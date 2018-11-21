<% extends "../base/layout.jsp" %>
    <% block title %>最新-INS-DeepFashion<% endblock %>
    <% block content %>
            <div id="app">
            <div id="content">
            <div id="pinterest_search"></div>
            <div class="header-labs">
                <div class="header-lab-lists">
                    <a href="/index">最新</a>
                    <a href="/hot" class='current'>榜单</a>
                    <a href="/owner/recom/home" >时尚博主</a>
                    <a href="/gallery/styles" >分类找图</a>
                    <a href="/users/ins/list">我的INS</a>
                </div>
            </div>
            <div id="page-intro">
            </div>
            <div id="hot-filter-wrapper" class="container">
            </div>
            <div class="container index-wrapper">
            <div class="index-banner">
            <div class="special-page">
            </div>
            </div>
            <div class="water-fall-filter">
                <div class='filter-title'>
                    <ul class="filter-type">
                        <li class="filter-type-item selected">今日最热</li>
                        <li class="filter-type-item">本周最热</li>
                        <li class="filter-type-item">本月最热</li></ul>
                    </ul>      
                </div>
            </div>
            <div id="water-fall-panel">
                <!-- <% asyncEach item in resultList %> -->
                    <!-- <img src="{{helper.ossImg(item.mediaUrl, 1)}}" width="0" height="0"  alt=''> -->
                    <!-- <img src="" width="0" height="0"  alt='deepfashion'> -->
                <!-- <% endeach %> -->
            </div>
            </div>
            <div id="df-side-wrapper">
            </div>
    <% include "../base/footer.jsp" %>
    </div>
    </div>
<% endblock %>
