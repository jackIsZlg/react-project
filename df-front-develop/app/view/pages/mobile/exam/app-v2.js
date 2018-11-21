/**
 * Created by gewangjie on 2017/12/27
 */
import base from '../../../common/baseModule'

// 常量
const version = '1.0.0';
const examTotal = 60;

function clearExam() {
    localStorage.clear();
}

function saveExam() {
    localStorage.setItem('examNum', examNum);
    localStorage.setItem('examData', JSON.stringify(Exam.data));
    localStorage.setItem('likeNum', Exam.likeNum);
    localStorage.setItem('dislikeNum', Exam.disLikeNum);
    localStorage.setItem('index', index);
    localStorage.setItem('version', version);
}

// 重置参数
function reset() {
    index = 0;
    isAward = 0;
    Exam.data = [];
    Exam.disLikeNum = 0;
    Exam.likeNum = 0;
    clearExam();
}

// 基础数据
let channel = 1,
    isAward = 0,
    examNum = 0,
    index = 0,
    screenWidth = document.documentElement.offsetWidth,
    screenHeight = document.documentElement.offsetHeight,
    imgWidth = ~~(screenWidth * 0.94 * 0.9),
    initPos = screenWidth * 0.03,
    moveStep = screenWidth * 0.94,
    ani = {
        prev: {
            z: -40,
            operate: 0.54
        },
        active: {
            z: -13,
            operate: 0.96
        },
        next: {
            z: -40,
            operate: 0.45
        },
        standard: {
            z: 0,
            operate: 0
        }
    };


// jq容器
let $imageWrapper = $('.image-wrapper'),
    $phone = $('[name="phone"]'),
    $btnStart = $('.btn-start'),
    $phoneAlert = $('.alert-wrapper.phone'),
    $phoneClose = $('.phone .close'),
    $examAlert = $('.alert-wrapper.exam'),
    $btnNext = $('.btn-next'),// 再来一套
    $likeNum = $('.operate .like span'), // 喜欢数
    $waitNum = $('.operate .wait span'), // 待选择数
    $disLikeNum = $('.operate .dislike span'), // 不喜欢数
    $selectLike = $('.btn-group .like'), // 喜欢按钮
    $selectDisLike = $('.btn-group .dislike'), // 不喜欢按钮
    $prev = $('.step-2-footer .prev'), // 上一题
    $next = $('.step-2-footer .next'), // 下一题
    $btnCancel = $('.btn-cancel'), // 继续答题
    $btnPost = $('.step-2-footer .post'); // 提交数据

// changeStep(2);
// 查询套数
$.ajax({
    "type": "GET",
    // 'async': false,
    "url": `${base.baseUrl}/mobile/exam/v2/nums`,
    'success': (d) => {
        if (!d.success) {
            alert(e.errorDesc);
            return;
        }
        examNum = d.result.currExamNum;

        // 本地有数据、并且题号相同优先显示本地数据
        if (localStorage.getItem('version') === version &&
            examNum === localStorage.getItem('examNum') * 1) {
            Exam.data = JSON.parse(localStorage.getItem('examData'));
            index = localStorage.getItem('index') * 1 || 0;
            Exam.likeNum = localStorage.getItem('likeNum') * 1 || 0;
            Exam.disLikeNum = localStorage.getItem('dislikeNum') * 1 || 0;
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

// 考题
let Exam = {
    data: [],
    index: 0,
    likeNum: 0,
    disLikeNum: 0,
    moveing: false,
    getDOM: () => {
        return {
            prev: $('.image-item.prev'),
            active: $('.image-item.active'),
            next: $('.image-item.next'),
        }
    },
    prev: () => {
        if (index <= 0) {
            return;
        }

        let $dom = Exam.getDOM();

        console.log('上一个');
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

        index--;
        loadImage();

        mustMoveWrapper();

        Exam.testIndex();
    },
    next: () => {
        if (index >= examTotal - 1) {
            return;
        }
        let $dom = Exam.getDOM();

        console.log('下一个');
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

        index++;
        loadImage();

        mustMoveWrapper();

        Exam.testIndex();
    },
    like: () => {
        if (Exam.moveing) {
            return;
        }
        Exam.moveing = true;
        let item = Exam.data[index];

        let isLast = Exam.isLast();

        if (item.like !== 1) {
            Exam.likeNum++;
        }
        if (item.like === 0) {
            Exam.disLikeNum--;
        }

        item.like = 1;
        Exam.getDOM().active.removeClass('dislike').addClass('like');
        Exam.autoNext();

        if (!isLast && Exam.isLast() && !Exam.isFinish()) {
            $examAlert.show();
        }

        saveExam();

        Exam.testPost();
    },
    dislike: () => {
        if (Exam.moveing) {
            return;
        }
        Exam.moveing = true;

        let item = Exam.data[index];

        let isLast = Exam.isLast();

        if (item.like !== 0) {
            Exam.disLikeNum++;
        }
        if (item.like === 1) {
            Exam.likeNum--;
        }

        item.like = 0;
        Exam.getDOM().active.removeClass('like').addClass('dislike');
        Exam.autoNext();

        if (!isLast && Exam.isLast() && !Exam.isFinish()) {
            $examAlert.show();
        }

        saveExam();

        Exam.testPost();
    },
    isLast: () => {
        return Exam.likeNum + Exam.disLikeNum === examTotal
    },
    isFinish: () => {
        return Exam.likeNum === 20 && Exam.disLikeNum === 40;
    },
    autoNext: () => {
        if (!Exam.isLast()) {
            setTimeout(() => {
                Exam.next();
                Exam.moveing = false;
            }, 500);
        } else {
            Exam.moveing = false;
        }
    },
    testPost: () => {
        // 提交按钮状态
        if (Exam.disLikeNum === 40 && Exam.likeNum === 20) {
            $btnPost.removeClass("gray")
        } else {
            $btnPost.addClass("gray")
        }

        // 更新进度
        renderProgress();
    },
    testIndex: () => {
        // 上一题下一题状态
        if (index === 0) {
            $prev.addClass("gray")
        } else {
            $prev.removeClass("gray")
        }

        if (index === examTotal - 1) {
            $next.addClass("gray")
        } else {
            $next.removeClass("gray")
        }
    }
};

// 切换步骤
function changeStep(step) {
    $('.page-wrapper').addClass('hide').eq(step).removeClass('hide');

    if (step === 1) {
        // 初始化图片容器
        initImage();
        return;
    }

    if (step === 2) {
        $('.result').removeClass('show');
        // 全部答题结束
        if (examNum === 10) {
            $btnNext.hide();
            $('#step-3-wrapper .logo').css({
                'margin-bottom': '8%'
            });
            $('.exam-num').html(`您已经完成全部题目`);

            // 特殊处理
            isAward === 4 && $('.result-2 span').remove();
        } else {
            // 修改题号
            $('.exam-num').html(`您已经完成${examNum}套题,还剩${10 - examNum}套题`);
        }


        switch (`${channel}-${isAward}`) {
            // 未中奖
            case '1-4':
                $('.result-2').addClass('show');

                break;

            // 中奖
            case '1-8':
                $('.result-1').addClass('show');
                break;
        }

        // 重置
        reset();
    }
}

/*
 ******************************
 * 录入手机号
 */
if (navigator.userAgent.indexOf('Android') > -1) {
    window.onresize = function () {
        let curH = document.documentElement.offsetHeight;
        let $logo = $('#step-1-wrapper .logo');
        if (curH !== screenHeight) {
            $logo.css({
                'transform': `translateY(${curH - screenHeight}px)`
            })
        } else {
            $logo.css({
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

// 创建图片
function createImage(item, index) {
    let statusClass = '';
    if (item.like === 0) {
        statusClass = "dislike";
    }
    if (item.like === 1) {
        statusClass = "like";
    }
    return `<div class='image-item ${statusClass}' data-index="${index}">
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

    let $imageItem = $('.image-item');

    if (index > 0) {
        let $prev = $imageItem.eq(index - 1);
        $prev.addClass('prev');
        mustMoveImage($prev, 0, ani.prev.z, ani.prev.operate);
    }

    let $active = $imageItem.eq(index);
    $active.addClass('active');
    mustMoveImage($active, 0, ani.active.z, ani.active.operate);

    // 最后一项特殊处理
    if (index < (examTotal - 1)) {
        let $next = $imageItem.eq(index + 1);
        $next.addClass('next');
        mustMoveImage($next, 0, ani.next.z, ani.next.operate);
    }

    loadImage();

    Exam.testPost();
    Exam.testIndex();
}

// 加载图片,当前项前后2项预加载图片(过滤已删除项)
function loadImage() {
    for (let i = -2; i < 3; i++) {
        let _index = index + i;

        if (_index < 0 || _index > (examTotal - 1)) continue;

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
        "url": `${base.baseUrl}/mobile/exam/v2/exams`,
        "data": {
            'phone': phone
        },
        'success': (d) => {
            if (!d.success) {
                d.errorCode === 'E03' ? changeStep(2) :
                    alert(d.errorDesc);
                return;
            }
            Exam.data = d.result.postList.map((item) => {
                item.like = -1;
                return item
            });
            examNum = d.result.examNum;
            changeStep(1);
        },
        'fail': (err) => {
            alert(err)
        }
    });
}

// 提交答题结果
$btnPost.on('click', function () {
    let isDisabled = $btnPost[0].disabled;

    if (isDisabled) {
        return;
    }

    if (!Exam.isFinish()) {
        return;
    }
    $btnPost[0].disabled = true;
    //ajax
    let disLikeList = [],
        likeList = [];

    Exam.data.forEach((item) => {
        item.like ? likeList.push(item.postId) : disLikeList.push(item.postId);
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

$selectLike.on("click", Exam.like);
$selectDisLike.on("click", Exam.dislike);

$prev.on("click", Exam.prev);
$next.on("click", Exam.next);

$btnCancel.on('click', function () {
    $examAlert.hide();
});

// 移动容器
function mustMoveWrapper(d = 0) {
    $imageWrapper.css({
        'transform': `translate3d(${initPos - index * moveStep + d}px, 0px, 0px)`
    })
}

// 移动图片本体
function mustMoveImage($el, y = 0, z = 0, opacity) {
    $el.css({
        'transform': `translate3d(0px, ${y}px, ${z}px)`,
        opacity
    })
}

// 修改答题进度
function renderProgress() {
    $likeNum.html(Exam.likeNum);
    $waitNum.html(examTotal - Exam.likeNum - Exam.disLikeNum);
    $disLikeNum.html(Exam.disLikeNum);
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
        desc: '本组共有60张魏彦妮春季开款意向图,请选出你最喜欢的20张图片吧', // 分享描述
        link: location.href, // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
        imgUrl: base.ossImg('https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/exam/bg-v1.jpg', 100), // 分享图标
        success: function () {
            // 用户确认分享后执行的回调函数
        },
        cancel: function () {
            // 用户取消分享后执行的回调函数
        }
    });
});