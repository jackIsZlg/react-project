<% extends "../base/layout.jsp" %>
<% block title %>DEEP FASHION<% endblock %>
<% block content %>
<div class="tc title">恭喜!</div>
<div class="authority tc">你已经成功授权绑定微信服务号,现已可以正常使用。</div>
<div class="btmText tc">感谢你对 Deepfashion 的支持</div>
<div class="returnBtn tc">
    <button onclick="wx.miniProgram.reLaunch({url: '/pages/index/index'})">返回小程序</button>
</div>
<% endblock %>
<% block js %>
<script type="text/javascript">
    //  successFlag 如果为true，则授权成功，如果为false，则授权失败
    //  channelFlag 如果为pc,则标识为pc端授权，如果为WeChat，则为小程序端，此时显示返回小程序按钮。

    let successFlag = '{{success}}',
        channelFlag = '{{channel}}',
        $title = $('.title'),
        $authority = $('.authority'),
        $returnBtn = $('.returnBtn');

    switch (channelFlag) {
        case 'pc':
            if (successFlag === 'false' || successFlag === false) {
                $title.text('授权失败');
                $authority.text('请重新授权');
            }
            $returnBtn.addClass('hide');
            break;
        case 'wechat':
            if (successFlag === 'false' || successFlag === false) {
                $title.text('授权失败');
                $authority.text('点击下方按钮，重新授权');
            }
            break;
        default:
            if (successFlag === 'false' || successFlag === false) {
                $title.text('授权失败');
                $authority.text('点击下方按钮，重新授权');
            }
            break;
    }
</script>
<% endblock %>
        