<% extends "../../base/layout.jsp" %>
<% block title %>DEEPFASHION<% endblock %>
<% block content %>
<div id="app">
    <div id="content">
        <div class="auth-wrapper"></div>
    <% extends "../../base/footer.jsp" %>
    </div>
</div>
<script>
    var AuthUrl = '${authUrl}',
        RedirectUrl = '${redirectUrl}';
</script>
<% endblock %>
