<% extends "../base/layout.jsp" %>
<% block title %>品牌精选单图<% endblock %>
<% block content %>
<style>
    .category-filter-selection.brand-header{
        position:static;
    }
    .brand-header{
       background-color:#fff;
       top:77px;
    }
    .brand-header .title{
        padding:30px 0 5px 0;
        font-family: PingFangSC-Medium;
        font-size: 36px;
        font-weight: normal;
        font-stretch: normal;
        letter-spacing: -0.9px;
        color: #111111;
    }
</style>
<div id="app">
    <div id="content">
        <div class="category-filter-selection brand-header"></div>
        <div class="container">
        <div id="water-fall-panel"></div>
        </div>
        <div id="df-side-wrapper"></div>
    </div>
</div>
<% endblock %>