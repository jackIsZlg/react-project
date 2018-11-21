<!DOCTYPE html>
<%@ page language="java" contentType="text/html; charset=utf-8"
pageEncoding="utf-8"%>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>${content}-DEEPFASHION</title>
    <% extends "../base/head.jsp" %>
</head>
<body>
<div id="app">
    <div id="content">
        <% extends "../base/header.jsp" %>
        <div class="container">
            <div class="classify-header">
                <div class="classify-name">${content}</div>
                <ul class="select-style">
                    <li class="style-image style-JK btn-effect" data-style="414"><span>日韩</span></li>
                    <li class="style-image style-EA btn-effect" data-style="415"><span>欧美</span></li>
                    <li class="style-image style-all btn-effect current" data-style="0"><span>ALL</span></li>
                </ul>
            </div>
        </div>

        <div class="container">
            <div id="water-fall-panel">

            </div>
        </div>
        <% extends "../base/footer.jsp" %>
    </div>
</div>
<% extends "../base/commonJS.jsp" %>
<script>
    var tagId = '${tagId}';
</script>
<script src="../../src/view/blog/classifyList.js"></script>
</body>
</html>