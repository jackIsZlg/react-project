        <% extends "../base/layout.jsp" %>
                <% block title %>邀请加入精选集-DeepFashion<% endblock %>
                <% block content %>
            <div id="app">
            <div id="content">
            <div class="container invite-confirm-pane">

            </div>
            </div>
            </div>
            <script>
            var FolderId = '{{folderId}}',
            InviteId = '{{inviteId}}',
            Status = '{{status}}'
            </script>
                <% endblock %>