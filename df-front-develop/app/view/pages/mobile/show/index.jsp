<% extends "../base/layout.jsp" %>
<% block title %>{{designerName}}的秀场<% endblock %>
<% block style %>
<style> body {background: #111!important;}</style>
<% endblock %>
<% block content %>
<div id="show-share">
        <div class="show-image">
    
        </div>
        <div class="show-info">
            <div class="designer">
                {{designerName}}
            </div>
            <div class="city-season">
                {{city}}，{{season}}
            </div>
        </div>
    </div>
<% endblock %>
<% block js %>
<script>
     var blogId ='{{id}}',
        mediaUrl = '{{mediaUrl}}';
</script>
<% endblock %>