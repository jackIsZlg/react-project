<% extends "../../base/layout.jsp" %>
<% block title %>DeepFashion-每天都想刷的时尚<% endblock %>
<% block style %>
<style>
        #app #content {
            padding-bottom: 0;
        }

        iframe {
            display: block;
            width: 100%;
            min-height: calc(100vh);
            padding-top: 6px;
            margin: 0 auto;
            border: 0;
        }
    </style><% endblock %>
<% block content %>
<div id="app">
    <div id="content">
        <iframe src="{{content}}?platform=PC"></iframe>
    </div>
</div>
<% extends "../../base/footer.jsp" %>
            </div>
        </div>
<% endblock %>