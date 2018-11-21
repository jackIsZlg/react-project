<% extends "../base/layout.jsp" %>
<% block title %>DEEPFASHION-每天都想刷的时尚<% endblock %>
<% block style %>
<style>
body {
    margin: 0;
    background: #edece9;
}

* {
    box-sizing: border-box;
}

.wrapper {
    width: 590px;
    margin: 20px auto 60px;
    text-align: center;
    background: #fff;
    border-radius: 3px;
    box-shadow: 0 2px 3px 0 rgba(0, 0, 0, 0.20);
}

.header {
    padding: 21px 0 19px;
    border-bottom: 1px solid #f0f0f0;
}

.content {
    padding: 27px 0 24px;
}

.title-tips {
    font-size: 18px;
    color: #323232;
}

.share-contnent {
    padding: 22px 0 37px;
}

.share-qrcode,
.share-image {
    display: inline-block;
    width: 140px;
    height: 140px;
    border-radius: 3px;
    overflow: hidden;
    vertical-align: top;
    background-size: cover;
    background-position: center;
}

.share-qrcode {
    position: relative;
    margin-left: 15px;
    border: 1px solid #D7D8DF;
}

.share-qrcode:before {
    content: '';
    position: absolute;
    top: 64px;
    left: 0;
    border-left: 8px solid #d7d8df;
    border-top: 6px solid transparent;
    border-bottom: 6px solid transparent;
}

#qr-code {
    margin: 10px auto 0;
    width: 120px;
    height: 120px;
}

.wx-tips {
    font-size: 12px;
    color: #4A4A4A;
}

.hidden {
    display: none;
}
</style>
<% endblock %>
<% block content %>
<div id="app">
    <div id="content">
        <div class="wrapper hidden">
            <div class="header">
                <img src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/df-share-logo.png" width="50">
            </div>
            <div class="content">
                <div class="title-tips">分享到微信</div>
                <div class="share-contnent">
                    <div class="share-image">

                    </div>
                    <div class="share-qrcode">
                        <div id="qr-code">

                        </div>
                    </div>
                </div>
                <div class="wx-tips">
                    用微信“扫一扫”扫描二维码，<br/>
                    即可把链接分享给您的微信好友或朋友圈。
                </div>
            </div>
        </div>
    </div>
</div>

<% endblock %>