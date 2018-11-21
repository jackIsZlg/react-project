<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf-8"
pageEncoding="utf-8"%>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DEEPFASHION-404</title>
    <% extends "../base/head.jsp" %>
</head>
<body>
<div id="app">
    <div id="content">
        <% extends "../base/header.jsp" %>
        <div class="error-panel error-500">
            <span>系统出错了，请稍后再试 ⊙０⊙</span>
        </div>
        <div class="to-index">
            <a href="/">回到首页</a>
            <span class="error-time-count">5秒</span>后，自动回到首页
        </div>
    </div>
</div>
<% extends "../base/commonJS.jsp" %>
<script src="../../src/view/error/error_404.js"></script>
</body>
</html>