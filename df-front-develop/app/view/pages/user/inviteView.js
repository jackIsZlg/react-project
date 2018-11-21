/**
 * Created by gewangjie on 2017/5/4.
 */
import base from '../../common/baseModule'

let $code = $('#invitation-code'),
    $btn = $('#btn-invitation-code');

$btn.click(() => {
    "use strict";
    let code = $code.val();
    if (!code) {
        new base.warningTip($code[0], '请输入邀请码');
        return;
    }
    base.ajaxList.basic({
        type: 'GET',
        url: base.baseUrl + '/users/invite/verify-code',
        data: {
            "code": code
        }
    }, (d) => {
        location.href = '/';
    }, (d) => {
        new base.warningTip($code[0], d.errorDesc || '异常，联系给你邀请码的人');

    });
});