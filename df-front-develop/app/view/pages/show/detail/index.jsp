<% extends "../../base/layout.jsp" %>
<% block title %>时尚博主-INS-DeepFashion<% endblock %>
<% block style %>
<style>
        #header {
            z-index: 101!important;
        }

        .close-btn {
            display: none;
        }

        .blog-wrapper {
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
        <% extends "../../base/footer.jsp" %>
    </div>
</div>
<% endblock %>
