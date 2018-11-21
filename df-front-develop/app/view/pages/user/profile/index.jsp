<% extends "../../base/layout.jsp" %>
<% block title %>设置-DeepFashion<% endblock %>
<% block content %>
<div id="app">
    <div id="content">
        <div class="user-manage-panel">
            <div class="user-wechatInfo">
                <div id="avatar-edit-wrapper">
                </div>
                <div class="user-wechatName">
                    <div class="input-text-name"></div>
                    <div class="user-edit"></div>
                </div>
                <div class="user-wechatName">
                    <input class="input-text-edit" type="text" maxlength="20" />
                    <div class="btn-save"></div>
                </div>
            </div>
            <div class="user-settingInfo">

            </div>

        </div>
        <% extends "../../base/footer.jsp" %>

    </div>
    <div id="select-tag-wrapper"></div>
    <div id="bind-phone-pop-wrapper"></div>
</div>
<% endblock %>