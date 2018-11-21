<% extends "../../base/layout.jsp" %>
<% block title %>秀场-DeepFashion<% endblock %>
<% block style %>
<style>
    body {background: #111111;}
    .water-fall-no-result{color: #fff}
</style>
<% endblock %>
<% block content %>
<div id="app">
    <div id="content">
        <div class="gallery-channel">
            <a href="/tag/classify" class="gallery-channel-item">
            <span class="channel-name-ch">分类</span>
            <span class="channel-name-en">CATEGORY</span>
            </a>
            <a href="/show/runway" class="gallery-channel-item current">
            <span class="channel-name-ch">秀场</span>
            <span class="channel-name-en">RUNWAY</span>
            </a>
            </div>
            <div class="title">
            <div id="filter-category-wrap"></div>
            <div class="classify">
            <div class="runway-filter container">
            <div id="word-filter-wrapper">
            </div>
            <div id="cascade-filter-wrapper">
            </div>
            </div>
            </div>
            </div>
            <div class="container">
            <div id="water-fall-panel" class="water-fall-panel-new">
            <li>
            <div class="banner-img-bg"></div>
            <div class="banner-img-footer null">
            <span class="designer"></span>
            <span class="season"></span>
            <span class="city"></span>
            </div>
            </li>
            <li>
            <div class="banner-img-bg"></div>
            <div class="banner-img-footer null">
            <span class="designer"></span>
            <span class="season"></span>
            <span class="city"></span>
            </div>
            </li>
            <li>
            <div class="banner-img-bg"></div>
            <div class="banner-img-footer null">
            <span class="designer"></span>
            <span class="season"></span>
            <span class="city"></span>
            </div>
            </li>
            <li>
            <div class="banner-img-bg"></div>
            <div class="banner-img-footer null">
            <span class="designer"></span>
            <span class="season"></span>
            <span class="city"></span>
            </div>
            </li>
            <li>
            <div class="banner-img-bg"></div>
            <div class="banner-img-footer null">
            <span class="designer"></span>
            <span class="season"></span>
            <span class="city"></span>
            </div>
            </li>
            <li>
            <div class="banner-img-bg"></div>
            <div class="banner-img-footer null">
            <span class="designer"></span>
            <span class="season"></span>
            <span class="city"></span>
            </div>
            </li>
            </div>
            </div>
        <% include "../../base/footer.jsp" %>
    </div>
</div>
<% endblock %>