<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf-8"
pageEncoding="utf-8"%>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${owner.nickname}博主-DeepFashion</title>
    <% extends "../base/head.jsp" %>
</head>
<body>
<div id="app">
    <div id="content">
        <% extends "../base/header.jsp" %>
        <div id="app-wrapper">

        </div>
        <% extends "../base/footer.jsp" %>
    </div>
</div>
<% extends "../base/commonJS.jsp" %>
<script>
    var bloggerId =${bloggerId};
</script>
<script src="../../src/view/owner/ownerHome.js"></script>
</body>
</html>