<% extends "../../base/layout.jsp" %>
    <% block title %>品牌详情<% endblock %>
    <% block content %>
    <div id="app">
        <div id="content">
            <div class="brand-filter-selection"></div>
            <div class="container fix-condition">
                <div id="water-fall-panel" class="water-fall-panel-new"></div>
            </div>
        </div>
    </div>
    <script> var followId = '{{followId}}'  </script>
<% endblock %>
<% block js %>
    <script>
    $('.brand-name').text('{{name | safe}}')
    </script>
<% endblock %>
