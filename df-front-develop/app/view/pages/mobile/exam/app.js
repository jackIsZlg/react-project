/**
 * Created by gewangjie on 2017/11/29
 */
import base from '../../../common/baseModule'

// rAF兼容
window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame;

// 答题记录获取，localStorage

function clearExam() {
    localStorage.clear();
}

function saveExam() {
    localStorage.setItem('examNum', examNum);
    localStorage.setItem('examData', JSON.stringify(Exam.data));
    localStorage.setItem('index', index);
    localStorage.setItem('disLikeNum', disLikeNum);
    localStorage.setItem('version', '1.0.0');
}

// 基础数据
let channel = queryString('channel') * 1 || 1,
    isAward = 0,
    examNum = 0,
    index = 0,
    disLikeNum = 0,
    screenWidth = document.documentElement.offsetWidth,
    screenHeight = document.documentElement.offsetHeight,
    imgWidth = ~~(screenWidth * 0.94 * 0.9),
    initPos = screenWidth * 0.03,
    moveStep = screenWidth * 0.94,
    operate = {
        drag: false,
        direction: '',
        moveStart: {
            x: 0,
            y: 0
        },
        moveCur: {
            x: 0,
            y: 0
        },
        startTime: 0,
        endTime: 0
    },
    ani = {
        prev: {
            z: -137,
            operate: 0.54
        },
        active: {
            z: -13,
            operate: 0.96
        },
        next: {
            z: -164,
            operate: 0.45
        },
        standard: {
            z: 0,
            operate: 0
        },
        // 差值
        diffSP: {
            z: -137,
            operate: 0.54
        },
        diffPA: {
            z: -13 + 137,
            operate: 0.96 - 0.54
        },
        diffAN: {
            z: -164 + 13,
            operate: 0.45 - 0.96
        },
        diffNS: {
            z: 137,
            operate: -0.45
        }
    },
    gestureImg = 'http://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/exam/gesture.png';

console.log(imgWidth);

// jq容器
let $imageWrapper = $('.image-wrapper'),
    $phone = $('[name="phone"]'),
    $btnStart = $('.btn-start'),
    $phoneAlert = $('.alert-wrapper.phone'),
    $phoneClose = $('.phone .close'),
    $examAlert = $('.alert-wrapper.exam'),
    $btnPost = $('.btn-post'),
    $btnNext = $('.btn-next'),
    $gestureAlert = $('.alert-wrapper.gesture'),
    // 进度条控制
    $progressNum = $('.step-2-footer .num'),
    $progressInner = $('.progress-inner');

// 考题
let Exam = {
    data: [],
    index: 0,
    likeList: [],
    disLikeList: [],
    getDOM: () => {
        return {
            prev: $('.prev'),
            active: $('.active'),
            next: $('.next'),
        }
    },
    prev: () => {
        index--;
        loadImage();
    },
    next: () => {
        index++;
        loadImage();
    },
    remove: () => {
        let $dom = Exam.getDOM(),
            _index = $dom.active.data('index'),
            item = Exam.data[_index];

        // 数据修改
        disLikeNum++;
        item.del = true;
        loadImage();

        // 修改进度进度条
        renderProgress();
    }
};

// search 匹配 channel
function queryString(key) {
    let result = location.search.match(new RegExp("[\?\&]" + key + "=([^\&]+)", "i"));
    if (result == null || result.length < 1) {
        return "";
    }
    return result[1];
}

// 重置参数
function reset() {
    index = 0;
    disLikeNum = 0;
    isAward = 0;
    Exam.data = [];
    clearExam();
}

// changeStep(0);

// 查询套数
$.ajax({
    "type": "GET",
    // 'async': false,
    "url": `${base.baseUrl}/mobile/exam/nums`,
    'success': (d) => {
        if (!d.success) {
            alert(e.errorDesc);
            return;
        }
        examNum = d.result.currExamNum;

        // 本地有数据、并且题号相同优先显示本地数据
        if (localStorage.getItem('version') === '1.0.0' &&
            examNum === localStorage.getItem('examNum') * 1) {
            Exam.data = JSON.parse(localStorage.getItem('examData'));
            index = localStorage.getItem('index') * 1 || 0;
            disLikeNum = localStorage.getItem('disLikeNum') * 1 || 0;
            changeStep(1);
            return;
        }

        if (examNum === 0) {
            changeStep(0);
        } else {
            getImage();
            // changeStep(1);
        }
    },
    'fail': (err) => {
        alert(err)
    }
});

// 切换步骤
function changeStep(step) {
    $('.page-wrapper').addClass('hide').eq(step).removeClass('hide');

    if (step === 1) {
        examNum === 1 && $gestureAlert.html(`<img width="100%" src='${gestureImg}'>`).show();
        // 初始化图片容器
        initImage();
    } else if (step === 2) {

        $('.result').removeClass('show');
        // 全部答题结束
        if (examNum === 20) {
            $btnNext.hide();
            $('#step-3-wrapper .logo').css({
                'margin-bottom': '8%'
            });
            $('.result-6').addClass('show');
            // 重置
            reset();
            return;
        }

        switch (`${channel}-${isAward}`) {

            // 粉丝下一套
            case '1-0':
                $('.result-4').addClass('show');
                break;

            // 设计师下一套
            case '2-0':
                $('.result-5').addClass('show');
                break;

            // 粉丝未中奖
            case '1-4':
                $('.result-2').addClass('show');
                break;

            // 设计师未中奖
            case '2-4':
                $('.result-3').addClass('show');
                break;

            // 中奖
            case '1-8':
            case '2-8':
                $('.result-1').addClass('show');
                break;
        }
        // 重置
        reset();
    } else {
        $(`.tip.channel-${channel}`).removeClass('hidden');
    }
}

/*
 ******************************
 * 录入手机号
 */
if (navigator.userAgent.indexOf('Android') > -1) {
    window.onresize = function () {
        let curH = document.documentElement.offsetHeight;
        if (curH !== screenHeight) {
            $('#step-1-wrapper .logo').css({
                'transform': `translateY(${curH - screenHeight}px)`
            })
        } else {
            $('#step-1-wrapper .logo').css({
                'transform': `translateY(0)`
            })
        }
    };
}

$phone.on('input', function () {
    let phone = $phone.val();
    phone.length === 11 ? $btnStart.addClass('yellow').removeClass('gray')
        : $btnStart.removeClass('yellow').addClass('gray');
});

$btnStart.on('click', function () {
    if (!$btnStart.hasClass('yellow')) {
        return;
    }
    let phone = $phone.val();
    if (phone.length < 11) {
        return;
    }
    if (!(/^1[34578]\d{9}$/.test(phone))) {
        $phoneAlert.show();
        return;
    }
    $('.result .phone').html(phone);
    // ajax
    getImage(phone);
});
$phoneClose.on('click', () => {
    $phoneAlert.hide();
});

/*
 *********************************
 * 做题
 */

// 取消手势提示
$gestureAlert.on('click', () => {
    $gestureAlert.hide();
});

// 创建图片
function createImage(item, index) {
    if (item.del) {
        return '';
    }
    return `<div class='image-item' data-index="${index}">
                <div class="image-area">
                    <img data-src='${base.ossImg(item.mediaUrl, imgWidth)}'/>
                </div>
            </div>`
}

// 初始化图片窗
function initImage() {
    let html = Exam.data.map((item, index) => {
        return createImage(item, index);
    });

    mustMoveWrapper();
    $imageWrapper.html(html.join(''));

    // 获取图片容器宽度
    // imgWidth = $('.image-area img').width();

    let $imageItem = $('.image-item');

    if (index > 0) {
        let $prev = $imageItem.eq(index - 1);
        $prev.addClass('prev');
        mustMoveImage($prev, 0, ani.prev.z, ani.prev.operate);
    }

    let $active = $imageItem.eq(index);
    $active.addClass('active');
    mustMoveImage($active, 0, ani.active.z, ani.active.operate);

    if (index < (49 - disLikeNum)) {
        let $next = $imageItem.eq(index + 1);
        $next.addClass('next');
        mustMoveImage($next, 0, ani.next.z, ani.next.operate);
    }

    loadImage();

    renderProgress();
}

// 加载图片,当前项前后2项预加载图片(过滤已删除项)
function loadImage() {
    for (let i = -2; i < 3; i++) {
        let _index = index + i;

        if (_index < 0 || _index > (49 - disLikeNum)) continue;

        let $image = $('.image-item').eq(_index).find('img').eq(0),
            src = $image.attr('data-src');

        // 加载图片，删除属性值，避免多次赋值
        if (src) {
            $image.attr('src', src).attr('data-src', '');
        }
    }
}

// 获取题目
function getImage(phone = '') {
    $.ajax({
        "type": "GET",
        // 'async': false,
        "url": `${base.baseUrl}/mobile/exam/exams`,
        "data": {
            'phone': phone
        },
        'success': (d) => {
            if (!d.success) {
                d.errorCode === 'E03' ? changeStep(2) :
                    alert(d.errorDesc);
                return;
            }
            Exam.data = d.result.postList;
            examNum = d.result.examNum;
            changeStep(1);
        },
        'fail': (err) => {
            alert(err)
        }
    });
}

function renderProgress() {
    $progressNum.html(`${disLikeNum}/30`);
    $progressInner.css({
        'width': `${disLikeNum / 30 * 100}%`
    });
    checkProgress();
}

function checkProgress() {
    if (disLikeNum !== 30) {
        return;
    }
    console.log(disLikeNum);
    examNum > 1 && $btnPost.html('提交答案');
    $examAlert.show();
}

// 提交答题结果
$btnPost.on('click', function () {
    let isDisabled = $btnPost[0].disabled;
    if (isDisabled) {
        return;
    }
    $btnPost[0].disabled = true;
    //ajax
    let disLikeList = [],
        likeList = [];

    Exam.data.forEach((item) => {
        item.del ? disLikeList.push(item.postId) : likeList.push(item.postId);
    });
    postData(likeList, disLikeList);
});

function postData(likeList, disLikeList) {
    $.ajax({
        "type": "POST",
        "url": `${base.baseUrl}/mobile/exam/examsAnswers`,
        "data": {
            likeList: likeList.toString(),
            disLikeList: disLikeList.toString()
        },
        'success': (d) => {
            if (!d.success) {
                $btnPost[0].disabled = false;
                alert(d.errorDesc);
                return;
            }
            // 修改题号
            $('.exam-num').html(examNum);
            // 记录中奖情况
            isAward = d.result.isAward || 0;

            // ......
            (examNum === 1 && isAward === 0) && (isAward = 4);

            $examAlert.hide();
            // 跳转下一步
            changeStep(2);
            $btnPost[0].disabled = false;
        },
        'fail': (err) => {
            alert(err)
        }
    });
}

// 手势操作
let hammerEl = document.getElementsByClassName("image-container")[0],
    myHammer = new Hammer(hammerEl);

// 配置全方向pan事件
myHammer.get('pan').set({
    direction: Hammer.DIRECTION_ALL
});

//为该dom元素指定触屏移动事件
myHammer.on("panstart", function (ev) {
    // 重置数据并开启滑动
    operate.drag = true;
    operate.direction = '';
    operate.moveStart = ev.center;
    operate.moveCur = ev.center;
    operate.startTime = ev.timeStamp;
    operate.endTime = 0;
    animate();
}).on("panleft", function (ev) {
    operate.direction || (operate.direction = 'x');
    operate.moveCur = ev.center;
}).on("panright", function (ev) {
    operate.direction || (operate.direction = 'x');
    operate.moveCur = ev.center;
}).on("panup", function (ev) {
    operate.direction || (operate.direction = 'y');
    operate.moveCur = ev.center;
}).on("pandown", function (ev) {
    operate.direction || (operate.direction = 'y');
    operate.moveCur = ev.center;
}).on("panend", function () {
    operate.drag = false;
    operate.endTime = new Date().getTime();
    moveEnd();
});

// 移动结果判定
function moveEnd() {
    const {direction, moveStart, moveCur, startTime, endTime} = operate;
    const diffTime = endTime - startTime;
    const diffMove = {
        x: moveCur.x - moveStart.x,
        y: moveCur.y - moveStart.y
    };
    let result = 0;//0:复原，1：next，-1：prev,，2：del，3：last-del(最后一项删除特殊处理)

    console.log(endTime, startTime);
    console.log(diffMove, direction);
    // 操作时间小于150ms，操作距离大于20px，直接执行
    if (diffTime < 150) {
        result = moveResult(diffMove, 20, direction)
    } else {
        result = moveResult(diffMove, moveStep / 2, direction)
    }

    // 滑动边界值判定
    if (index === 0 && result === -1) {
        result = 0;
    }

    if (index === (49 - disLikeNum) && result === 1) {
        result = 0;
    }

    // 删除边界值判定
    if (index === (49 - disLikeNum) && result === 2) {
        result = 3;
    }

    let $dom = Exam.getDOM();

    // 增加动画
    $imageWrapper.addClass('ani');

    // 图片调整位置
    switch (result) {
        case 0:
            console.log('复原');
            // 复原三个图片
            mustMoveImage($dom.prev, 0, ani.prev.z, ani.prev.operate);
            mustMoveImage($dom.active, 0, ani.active.z, ani.active.operate);
            mustMoveImage($dom.next, 0, ani.next.z, ani.next.operate);
            break;
        case -1:
            console.log('上一个');
            Exam.prev();
            // 调整class
            $dom.prev.prev().addClass('prev');
            $dom.prev.removeClass('prev').addClass('active');
            $dom.active.removeClass('active').addClass('next');
            $dom.next.removeClass('next');

            // 移动位置
            mustMoveImage($dom.prev.prev(), 0, ani.prev.z, ani.prev.operate);
            mustMoveImage($dom.prev, 0, ani.active.z, ani.active.operate);
            mustMoveImage($dom.active, 0, ani.next.z, ani.next.operate);
            mustMoveImage($dom.next, 0, ani.standard.z, ani.standard.operate);

            break;
        case 1:
            console.log('下一个');
            Exam.next();
            // 调整class
            $dom.prev.removeClass('prev');
            $dom.active.removeClass('active').addClass('prev');
            $dom.next.removeClass('next').addClass('active');
            $dom.next.next().addClass('next');

            // 移动位置
            mustMoveImage($dom.active, 0, ani.prev.z, ani.prev.operate);
            mustMoveImage($dom.next, 0, ani.active.z, ani.active.operate);
            mustMoveImage($dom.next.next(), 0, ani.next.z, ani.next.operate);
            mustMoveImage($dom.prev, 0, ani.standard.z, ani.standard.operate);

            break;
        case 2:
            console.log('删除');
            Exam.remove();
            // 调整class
            $dom.active.addClass('remove').removeClass('active');
            $dom.next.removeClass('next').addClass('active');
            $dom.next.next().addClass('next');

            // 删除项飞出屏幕,并将宽度设置为0，
            mustMoveImage($dom.active, -1000, ani.active.z, ani.active.operate);

            // 移动位置
            mustMoveImage($dom.next, 0, ani.active.z, ani.active.operate);
            mustMoveImage($dom.next.next(), 0, ani.next.z, ani.next.operate);
            break;
        case 3:
            console.log('删除-最后一个');
            // 前移一位，并删除
            Exam.prev();
            Exam.remove();
            // 调整class
            $dom.active.addClass('remove').removeClass('active');
            $dom.prev.removeClass('prev').addClass('active');
            $dom.prev.prev().addClass('prev');

            // 删除项飞出屏幕,并将宽度设置为0，
            mustMoveImage($dom.active, -1000, ani.active.z, ani.active.operate);

            // 移动位置
            mustMoveImage($dom.prev, 0, ani.active.z, ani.active.operate);
            mustMoveImage($dom.prev.prev(), 0, ani.prev.z, ani.prev.operate);

            break;

    }
    // 容器调整位置
    mustMoveWrapper();

    // 保存操作记录
    result !== 0 && saveExam();

    // 300ms 后移除动画
    setTimeout(() => {
        if (result === 2 || result === 3) {
            $('.remove').remove();
        }
        $imageWrapper.removeClass('ani');
    }, 300);

}

function moveResult(move, threshold, direction) {
    let result = 0;
    if (direction === 'x') {
        move.x > threshold && (result = -1);
        move.x < -1 * threshold && (result = 1);
    } else {
        move.y < -1 * threshold * 0.8 && (result = 2)
    }

    return result;
}

// 高性能渲染
function animate() {
    operate.drag && window.requestAnimationFrame(animate);
    render();
}

function render() {
    const {direction, moveStart, moveCur} = operate;
    // console.log(direction, moveCur.x - moveStart.x, moveCur.y - moveStart.y);
    direction === 'x' ? moveX(moveCur.x - moveStart.x)
        : moveY(moveCur.y - moveStart.y);
}

function moveX(d) {
    // d为正，向右
    // 容器移动
    moveWrapper(d, false);

    // 图片本体微调，通过滑动距离计算中间态
    let $dom = Exam.getDOM(),
        scale = d / moveStep;

    if (d > 0) {
        moveImage($dom.prev, 0,
            ani.prev.z + scale * ani.diffPA.z,
            ani.prev.operate + scale * ani.diffPA.operate);
        moveImage($dom.active, 0,
            ani.active.z + scale * ani.diffAN.z,
            ani.active.operate + scale * ani.diffAN.operate);
        moveImage($dom.next, 0,
            ani.next.z + scale * ani.diffNS.z,
            ani.next.operate + scale * ani.diffNS.operate);
    } else {
        moveImage($dom.prev, 0,
            ani.prev.z + scale * ani.diffSP.z,
            ani.prev.operate + scale * ani.diffSP.operate);
        moveImage($dom.active, 0,
            ani.active.z + scale * ani.diffPA.z,
            ani.active.operate + scale * ani.diffPA.operate);
        moveImage($dom.next, 0,
            ani.next.z + scale * ani.diffAN.z,
            ani.next.operate + scale * ani.diffAN.operate);
    }
}

function moveY(d) {
    if (d > 0) {
        return;
    }
    moveImage(Exam.getDOM().active, d, ani.active.z, ani.active.operate)
}

// 最后一帧渲染干扰，拆分动画渲染和强制渲染

// 移动容器
function mustMoveWrapper(d = 0) {
    $imageWrapper.css({
        'transform': `translate3d(${initPos - index * moveStep + d}px, 0px, 0px)`
    })
}

function moveWrapper(d = 0) {
    if (!operate.drag) {
        return
    }
    mustMoveWrapper(d);
}

// 移动图片本体
function mustMoveImage($el, y = 0, z = 0, opacity) {
    $el.css({
        'transform': `translate3d(0px, ${y}px, ${z}px)`,
        opacity
    })
}

function moveImage($el, y = 0, z = 0, opacity) {
    // 最后一帧渲染移除
    if (!operate.drag) {
        return
    }
    mustMoveImage($el, y, z, opacity);
}

/*
 ********************************
 * 结果页
 */
$btnNext.on('click', () => {
    getImage();
});

/*
 *============================
 * 配置微信分享
 */

base.wechatConfig([], () => {
    base.shareConfig({
        title: '识图|挑选你最喜欢的20张图', // 分享标题
        desc: channel === 1 ? '本组共有50张思佳春季开款意向图，请删除你不喜欢的图片吧!' :
            '本组有50张主打日韩轻熟风格的春季款式图，请删掉你不喜欢的图片吧', // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: base.ossImg('https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/exam/bg.png', 100), // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});




