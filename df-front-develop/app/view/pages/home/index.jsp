<% extends "../base/layout.jsp" %>
<% block title %>DEEPFASHION-每天都想刷的时尚<% endblock %>
    <% block style %>
    <style>
    html, body {
    position: relative;
    height: 100%;
    }
    body {
    font-family: Helvetica Neue, Helvetica, Arial, sans-serif;
    font-size: 14px;
    color:#000;
    margin: 0;
    padding: 0;
    }
    .swiper-container {
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    }
    .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;

    /* Center slide text vertically */
    display: -webkit-box;
    display: -ms-flexbox;
    display: -webkit-flex;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    -webkit-justify-content: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    -webkit-align-items: center;
    align-items: center;
    }
    </style>
    <% endblock %>
<% block content %>
<div id="app">
    <div id="content" class="container" style="padding-bottom: 40px;">
        <div id="index-banner">
        </div>
        <div id="hot-collection">
            <div>
            <div class="floor-header">
                <div class="floor-header-title">热门精选集<span>体现了流行款式和设计热点的精选图集</span>
                </div><div class='see-more' onclick="openPage('more')">查看更多</div> </div>
                <ul class="hot-content"> 
                    <% asyncEach item in folderList %>
                        <% include "../design/hotfolder/index.nj" %>
                    <% endeach %>
                </ul>
            </div>
        </div>
        <div id="ins-blogger">
            <div>
            <div class="floor-header">
                <div class="floor-header-title">
                    热门INS博主 <span>精选自设计师们在instagram上关注的服装设计领域的优质博主</span>
                </div>
                <div  class='see-more'>查看更多</div>
            </div>
            <div class="blogger-group">
                <div class="blogger-content">
                <div class="swiper-container">
                <div class="swiper-wrapper">
                    <% asyncEach item in insList %>
                        <% include "../design/hotins/index.nj" %>
                    <% endeach %>
                </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    </div>
</div>
<% endblock %>
<% block otherjs %>
<script src="https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/swiper.min.js"></script>
<% endblock %>
