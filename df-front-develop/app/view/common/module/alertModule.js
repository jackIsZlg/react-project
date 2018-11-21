/**
 * Created by gewangjie on 2017/7/13.
 */

// 全局alert
let toasts = document.createElement('div');
toasts.id = "df-toasts";
document.body.appendChild(toasts);

class DFAlert {
    constructor(options) {
        this.parent = toasts;
        this.options = {
            type: 'success',
            tipImg: '',
            mainText: '',
            subText: '',
            cb: () => {

            }
        };
        for (let i in options) {
            this.options[i] = options[i];
        }
        this.init();
    }

    init() {
        let _icon = '', _tipImg = '';
        // 处理提示图像
        if (!this.options.tipImg) {
            _tipImg = '';
        } else if (typeof this.options.tipImg === 'object') {
            if (this.options.tipImg instanceof jQuery && this.options.tipImg[0].nodeType === 1) {
                _tipImg = this.options.tipImg[0].outerHTML;
            }
            if (this.options.tipImg.nodeType === 1) {
                _tipImg = this.options.tipImg.outerHTML;
            }
        } else if (typeof this.options.tipImg === 'string') {
            _tipImg = `<div class="single-bg" style="background-image: url(${this.options.tipImg})"></div>`;
        }

        // 处理icon
        switch (this.options.type) {
            case 'success':
                _icon = '<i class="iconfont success">&#xe632;</i>';
                break;
            case 'warning':
                _icon = '<i class="iconfont warning">&#xe633;</i>';
                break;
            default:
                _icon = '<i class="iconfont success">&#xe632;</i>';
        }

        this.el = document.createElement('div');
        this.el.className = 'df-alert';
        this.el.innerHTML = `<div class="tip-img">${_tipImg}${_icon}</div>
                <div class="tip-text">
                <div class="tip-text-wrapper">
                    <span>${this.options.mainText}</span>
                    <span>${this.options.subText}</span></div>    
                </div>`;

        // 插入节点
        this.parent.appendChild(this.el);

        // 执行动画
        this.animation();
    }

    animation() {
        let self = this;
        setTimeout(function () {
            self.el.classList.add('show');
        }, 100);

        setTimeout(function () {
            self.el.classList.add('close');
            setTimeout(function () {
                self.parent.removeChild(self.el);
                self.options.cb();
            }, 400);
        }, 2000);
    }
}

export default DFAlert;