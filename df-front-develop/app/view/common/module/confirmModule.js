/**
 * Created by gewangjie on 2017/7/13.
 */

import base from './baseModule'

// 全局confirm
class DFConfirm {
    constructor(options, success, cancel) {
        this.closeBody = false;
        this.options = {
            header: '',
            content: '',
            btn_1: '取消',
            btn_2: '确定',
            success: () => {
            },
            cancel: () => {
            }
        };
        for (let i in options) {
            this.options[i] = options[i];
        }

        this.renderDiv();
    }

    handleCancal() {
        this.options.cancel();
        this.handleHide();
    }

    handleSuccess() {
        this.options.success();
        this.handleHide();
    }

    handleHide() {
        this.$tip.remove();
        this.closeBody && base.bodyScroll(true);
    }

    renderDiv() {
        let self = this,
            tpl = `<div class="df-confirm-mask">
                <div class="df-confirm">
                <i class="iconfont cancel-pop"></i>
                <div class="df-confirm-header">${self.options.header}</div>
                <div class="df-confirm-content">${self.options.content}</div>
                <div class="df-confirm-footer">
                    <button class="btn-default btn-effect-gray btn-round">${self.options.btn_1}</button>
                    <button class="btn-red btn-effect btn-round">${self.options.btn_2}</button>
                </div>
            </div>
        </div>`;
        self.$tip = $(tpl);
        self.$tip.find('.cancel-pop').eq(0).click(self.handleCancal.bind(self));
        self.$tip.find('.btn-default').eq(0).click(self.handleCancal.bind(self));
        self.$tip.find('.btn-red').eq(0).click(self.handleSuccess.bind(self));
        $('body').append(self.$tip);

        // 锁定浮层下层
        this.closeBody = window.isBodyScroll;
        window.isBodyScroll && base.bodyScroll(false);
    }
}

export default DFConfirm;