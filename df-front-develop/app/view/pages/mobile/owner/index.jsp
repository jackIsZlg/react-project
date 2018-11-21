<% extends "../base/layout.jsp" %>
<% block title %>DEEPFASHION<% endblock %>
<% block content %>
<div id="owner-share">
        <div class="owner-info">
            <div class="bg-filter"></div>
            <div class="avatar">

            </div>
            <div class="nickname one-line">

            </div>
        </div>
        <div class="blog-image">
            <div class="left-pane"></div>
            <div class="right-pane"></div>
        </div>
    </div>
<% endblock %>
<% block js %>
<script>
    var blogId = '{{blogId}}' || ''
    var bloggerId ='{{bloggerId}}'
</script>
<% endblock %>