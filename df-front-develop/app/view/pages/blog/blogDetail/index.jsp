<% extends "../../base/layout.jsp" %>
<% block title %>DEEPFASHION-每天都想刷的时尚<% endblock %>
<% block style %>
<style>
        #header {
            z-index: 101;
        }

        .blog-cover-page.close-btn {
            display: none;
        }

        .blog-wrapper-info{
            margin-top: 60px;
        }

        .blog-cover {
            cursor: auto;
        }
    </style>
<% endblock %>
<% block content %>
<div id="app">
    <div id="content">
        
    </div>
</div>
<% endblock %>
<% block js %>
<script>
        var id = '{{blogId}}'
        var type = 'ins';
</script>
<% endblock %>

