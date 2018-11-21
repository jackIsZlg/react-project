<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf-8"
pageEncoding="utf-8"%>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>DEEPFASHION-每天都想刷的时尚</title>
    <% extends "../base/head.jsp" %>
    <style>
        #header {
            z-index: 101;
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
</head>
<body>
<div id="app">
    <div id="content">
        <% extends "../base/header.jsp" %>
    </div>
</div>
<% extends "../base/commonJS.jsp" %>
<script>
    var id = '${blogId}',
        type = 'ins';
</script>
<script src="../../src/view/blog/blogDetail.js"></script>
</body>
</html>