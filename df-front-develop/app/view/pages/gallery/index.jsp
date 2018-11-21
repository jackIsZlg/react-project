<% extends "../base/layout.jsp" %>
<% block title %>分类筛选-时尚库-DEEPFASHION<% endblock %>
<% block style %>
<style>
        .water-fall-no-result{
            font-size: 24px;
            color: #E5E5E5;
        }
</style>
<% endblock %>
<% block content %>
<div id="app">
    <div id="content">
            <div id="pinterest_search"></div>
            <div class="header-labs">
                </div>
                <div class="category-filter-panel"></div>
                <div class="container">
                    <div id="water-fall-panel" style="min-height: 400px">
        
                    </div>
                </div>
        <% include "../base/footer.jsp" %>
    </div>
</div>
<% endblock %>
