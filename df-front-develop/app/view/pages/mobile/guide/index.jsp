<% extends "../base/layout.jsp" %>
<% block title %>最新-INS-DeepFashion<% endblock %>
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
    <div id="guide-download">
        <div class="guide-tip"> 链接打不开？请点击右上角 选择“在浏览器打开”</div>
        <div class="guide-header">
        <div class="guide-logo"></div><p>网 · 罗 · 全 · 球 · 时 · 尚</p></div>
        <div class="download-btn">立即下载</div>
        <div class="guide-iphone"></div>
    </div>
<% endblock %>
<% block js %>
    <script type="text/javascript">
        (function (doc, win) {
            var docEl = doc.documentElement,
            resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
            recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
            if (clientWidth >= 750) {
            // 这里的750 取决于设计稿的宽度
            } else {
            docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
            }
            };
    
            if (!doc.addEventListener) return;
            win.addEventListener(resizeEvt, recalc, false);
            doc.addEventListener('DOMContentLoaded', recalc, false);
        })(document, window);
    </script>
<% endblock %>
        