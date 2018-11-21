<% extends "../base/layout.jsp" %>
<% block title %>DEEP FASHION<% endblock %>
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
<div id="share-guide">
    <div class="share-guide-download">
        网·罗·全·球·时·尚
        <button class="other-down">
        下载APP
        </button>
    </div>
    <div class="share-guide-content">
        <img id="useravator" src="" alt="">
        <div class="share-guide-user">
            <span id="username"></span>邀请您注册deepfashion
        </div>
        <div class="code-body">
            <input type="text" class="invite-code" readonly value=''/>
            <div class="copy-btn-h5">点击可复制</div>
        </div>
        <div class="other-tip">
            * 注册时记得填写邀请码哦
        </div>
    </div>
    <div class="share-guide-message">

    </div>
</div>
<% endblock %>
<% block js %>
<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.0/clipboard.min.js"></script>
<script type="text/javascript">
    var inviteCode ='{{inviteCode}}';
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
        