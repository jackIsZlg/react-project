/**
 * Created by gewangjie on 2017/7/13.
 */
import base from './baseModule'

// 提示窗
class WarningTip {
    constructor(el, text) {
        this.el = el; // 提示节点挂靠点
        this.text = text; // 显示文本
        this.createDiv(); // 创建节点
        this.show(); // 显示节点
    }

    // 删除遗留的div
    deleteDiv() {
        let el = document.getElementsByClassName('tip-warning')[0];
        el && el.parentNode.removeChild(el);
    }

    createDiv() {
        this.deleteDiv();
        this.tip = document.createElement('div');
        this.tip.classList.add('tip-warning', 'danger');
        this.tip.innerHTML = this.text; // 提示节点本体
    }

    show() {
        let self = this,
            parentEl = self.el.parentNode,
            height = parentEl.clientHeight;

        // 容器改为相对定位模式
        parentEl.style.position = 'relative';
        parentEl.appendChild(self.tip);


        // input节点默认获得焦点
        if (self.el.nodeName.toLowerCase() === 'input') {
            self.el.focus();
            self.tip.style.top = `${height + 6}px`;

            // 输入取消
            self.el.onkeydown = self.removeEvent.bind(self);

            // 失去焦点取消
            self.el.onblur = self.removeEvent.bind(self);
        } else {
            self.tip.style.top = `${height + 8}px`;
        }

        // 根据容器高度调整位置
        self.tip.classList.add('show');

        // 点击取消
        self.el.onclick = self.removeEvent.bind(self);
    }

    hide() {
        let self = this;
        self.tip.classList.remove('show');
        setTimeout(function () {
            self.tip.parentNode.removeChild(self.tip);
        }, 400);
    }

    // 移除事件
    removeEvent() {
        this.el.onclick = null;
        this.el.onkeydown = null;
        this.el.onblur = null;
        this.hide();
    }
}

export default WarningTip;