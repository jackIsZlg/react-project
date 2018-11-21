/**
 * Created by gewangjie on 2017/4/11.
 */
import base from '../../common/baseModule'
import WaterFall from '../../components/WaterFall/WaterFall'

base.channel('3');
// 我的频道显示
$('[data-channel="3"]').addClass('current');

// 暂时解决标签问题
let labelList = {
        '上装': 2,
        '上衣': 3,
        '裤子': 4,
        '裙子': 5,
        '鞋子': 6,
        // '帽子': 7,
        '配饰': 8,
    },
    todayTime = new Date((new Date()).toDateString()).getTime();
function renderLabel(d) {
    d.forEach((item) => {
        getLabelExist(item.id, labelList[item.content]);
    });
}
function getLabelExist(labelId, index) {
    base.request({
        type: 'GET',
        url: base.baseUrl + `/users/footprint/${labelId}`
    }).done((d) => {
        if (!d.success) {
            return;
        }
        if (d.result.resultList.length === 0) {
            return;
        }

        // 足迹数据超过一个月，按钮置灰
        let firstTime = d.result.resultList[0].footprintTime;
        if (base.isMonth(todayTime, firstTime)) {
            console.log(labelId, '一月内无数据');
            return;
        }
        labelLight(index, labelId);
    }).fail();
}
function labelLight(i, id) {
    console.log(i, id);
    let el = document.getElementsByClassName(`style-item-${i}`)[0];
    el.setAttribute('data-id', id);
    el.classList.remove('disabled');
    el.classList.add('btn-effect');
}

//获取标签信息
// base.request({
//     type: 'GET',
//     url: base.baseUrl + '/users/footprint/label'
// }).done((d) => {
//     d.success && renderLabel(d.result);
// }).fail();


let timeTagList = ['today', 'yesterday', 'week', 'week-ago'],// 时间标签
    timeTagHeight = [-1, -1, -1, -1],
    timeLineList = {}, // 时间轴
    parentTop = document.getElementById('history-wrapper').offsetTop,//父节点距浏览器窗口高度
    tagNum = 0, // 需要显示的tag数量
    tagTemp = 0,
    scrollTimeFlag = true,//限制scroll执行次数
    scrollTime = function () {
        scrollTimeFlag = false;
        setTimeout(function () {
            parentTop = document.getElementById('history-wrapper').offsetTop;
            let scrollTop = document.documentElement.scrollTop || document.body.scrollTop,
                _height = scrollTop - parentTop + window.innerHeight / 2;

            // header 状态修改
            if (scrollTop > 50) {
                base.headerChange('white');
            } else {
                base.headerChange();
            }
            // 视差,safari scrollTop可为负
            // (scrollTop <= 300 && scrollTop >= 0)
            // && (document.getElementsByClassName('banner')[0].style.backgroundPosition = `center ${scrollTop / 1.5}px`);

            // 时间线黑化距离
            document.getElementsByClassName('p-line-black')[0].style.height = _height + 'px';

            // 时间分割小黑球
            console.log(timeLineList);
            for (let key in timeLineList) {
                let el = document.querySelectorAll(`[data-history-time="${key}"] span`)[0],
                    value = timeLineList[key].y;
                if (el) {
                    value < _height ? el.classList.add('black') : el.classList.remove('black');
                }
            }

            //更新time-line-tag
            timeTagList.forEach((time, i) => {
                let el = document.getElementsByClassName(`time-line-tag-${time}`)[0],
                    top = timeTagHeight[i],
                    _bottom = 30 + 40 * tagTemp;
                if (top !== -1) {
                    // tag固定顶部处理
                    // 64 为header高度54 + tag向上浮动10px
                    if ((top + parentTop) < scrollTop + 64) {
                        el.classList.add('top');
                    } else {
                        el.classList.remove('top');
                    }

                    // 35 为 tag高度35px
                    if ((top + parentTop) < (scrollTop + window.innerHeight - _bottom)) {
                        el.classList.remove('gray', 'bottom');
                        el.style.top = top + 'px';
                        el.style.bottom = '';
                    } else {
                        el.classList.add('gray', 'bottom');
                        el.style.top = '';
                        el.style.bottom = `${_bottom}px`;
                    }
                    tagTemp--;
                }
            });
            tagTemp = tagNum;//还原
            scrollTimeFlag = true;
        }, 10);
    };

window.addEventListener('scroll', function () {
    scrollTimeFlag && scrollTime();
});

// 选择时间标签
$('.time-line-tag').click(function () {
    let top = this.style.top.replace('px', '') * 1,
        parentTop = document.getElementById('history-wrapper').offsetTop;
    $('body,html').animate({scrollTop: `${top + parentTop - 10 - 54}px`}, 500);
});

// 每次布局结束后，计算时间标签位置
function onLayoutOut() {
    //存储每个时间节点的top
    let timeLineHistoryEl = document.getElementsByClassName('time-line-history'),
        len = timeLineHistoryEl.length;
    for (let i = 0; i < len; i++) {
        let {y} = base.getDivTranslate(timeLineHistoryEl[i]),
            key = timeLineHistoryEl[i].getAttribute('data-history-time');
        timeLineList[key] = {
            'y': y + (i === 0 ? 0 : 30)
        };
        // timeLineList.push(y + (i === 0 ? 0 : 30));
    }

    // 无数据处理（时间线引起的左边距）
    let containerhistotyEl = document.getElementsByClassName('container-history')[0],
        timeAxisEl = document.getElementsByClassName('time-axis')[0];
    if (timeLineList.length === 0) {
        containerhistotyEl.classList.add('null');
        timeAxisEl.classList.add('hidden');
    } else {
        containerhistotyEl.classList.remove('null');
        timeAxisEl.classList.remove('hidden');
    }

    // $('.time-line-tag').removeClass('show');

    timeTagList.forEach((time, i) => {
        let el = document.getElementsByClassName(`time-line-${time}`)[0];
        if (el) {
            let y = base.getDivTranslate(el).y,
                dataTop = y + (y === 0 ? 0 : 30) - 10,
                timeLineTagEl = document.getElementsByClassName(`time-line-tag-${time}`)[0];
            timeLineTagEl.classList.add('show');
            timeLineTagEl.style.top = `${dataTop}px`;
            timeTagHeight[i] = dataTop;
        }
    });

    //计算bottom使用
    tagNum = tagTemp = document.querySelectorAll('.time-line-tag.show').length;

    scrollTime();

    console.log('layout done');

}


// 选择品类标签
$('.style-list').on('click', 'li', function () {
    let $el = $(this),
        labelId = $el.data('id');
    if (typeof labelId !== 'undefined') {
        $el.siblings().removeClass('current').end().addClass('current');
        renderWF(labelId);
    }
});
renderWF();
function renderWF(labelId = 0) {
    let dataUrl = `/users/footprint/${labelId}`,
        _w = <WaterFall key="waterWall"
                        pageSize={60}
                        wfType="history"
                        noFilter={true}
                        timeLine='history'
                        noBottom={true}
                        noResultTip="你暂未留下👣"
                        columnWidth={150}
                        onLayoutOut={onLayoutOut}
                        dataUrl={dataUrl}/>;
    ReactDOM.render(_w, document.getElementById('water-fall-panel'));
}
