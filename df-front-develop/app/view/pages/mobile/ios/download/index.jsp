<% extends "../../base/layout.jsp" %>
<% block title %>时尚雷达<% endblock %>
<% block style %>
<style>
    html, body {
        width: 100%;
        height: 100%;
        overflow: hidden;
    }
</style>
<% endblock %>
<% block content %>
<div id="download-panal">
        <header>
            跳转失败、无法下载？点击右上角用safari打开
        </header>
        <div class="tip-panel">
            <img src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/mobile-df-logo-1.1.png"
                 width="120px">
            <div class="text-tip">
                <div>DEEP FASHION</div>
                <div>每天都想刷的时尚</div>
            </div>
        </div>
        <a href='https://itunes.apple.com/cn/app/deepfashion/id1239723393?l=zh&ls=1&mt=8'>下载APP</a>
</div>
<% endblock %>
<% block js %>
<script>
        var ua = navigator.userAgent.toLowerCase();
        if ((/micromessenger/i).test(ua) && (/iphone/i).test(ua)) {
            document.querySelector('header').style.opacity = 1;
        }
</script>
<% endblock %>
        