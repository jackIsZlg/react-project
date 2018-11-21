/**
 * Created by gewangjie on 2017/7/6.
 */
import base from '../../common/baseModule'

base.headerChange('white');

let mockData = {
    '品类': [
        {'name': '西服', 'id': 388},
        {'name': '夹克', 'id': 389},
        {'name': '卫衣', 'id': 390},
        {'name': '大衣', 'id': 391},
        {'name': '棉衣羽绒', 'id': 457},
        {'name': '风衣', 'id': 393},
        {'name': '衬衫', 'id': 394},
        {'name': '针织衫', 'id': 395},
        {'name': 'POLO衫', 'id': 446},
        {'name': '小衫', 'id': 447},
        {'name': 'T恤', 'id': 396},
        {'name': '打底／吊带／背心', 'id': 449},
        {'name': '裤装', 'id': 398},
        {'name': '连体裤', 'id': 454},
        {'name': '连衣裙', 'id': 399},
        {'name': '半身裙', 'id': 400},
        {'name': '礼服', 'id': 448},
        {'name': '皮鞋／靴', 'id': 451},
        {'name': '运动鞋', 'id': 450},
        {'name': '凉拖', 'id': 452},
        {'name': '包', 'id': 403},
        {'name': '帽子', 'id': 402},
        {'name': '无袖外套／马甲', 'id': 453}
    ],
    '纹理': [
        {'name': '波点', 'id': 521},
        {'name': '动物纹', 'id': 522},
        {'name': '格纹', 'id': 523},
        {'name': '宫廷花纹', 'id': 524},
        {'name': '花纹', 'id': 525},
        {'name': '火腿纹', 'id': 526},
        {'name': '几何纹', 'id': 527},
        {'name': '条纹', 'id': 529},
    ],
    '面料': [
        {'name': '蕾丝', 'id': 528},
        {'name': '皮革', 'id': 455},
        {'name': '皮草', 'id': 456},
        {'name': '棉', 'id': 530},
        {'name': '麻', 'id': 534},
        {'name': '雪纺', 'id': 533},
        {'name': '牛仔', 'id': 532},
        {'name': '毛呢', 'id': 531}
    ]
};

// 获取推荐6张图
$.ajax({
    type: 'GET',
    url: `${base.baseUrl}/gallery/recom`
}).done((d) => {
    if (d.success) {
        renderBanner(d.result);
    }
}).fail();


// 生成跳转链接
function generateUrl(type, id, text) {
    let param = '';
    switch (type) {
        case '品类':
        case 1:
            param = `ca=${text}&caid=${id}`;
            break;
        case '纹理':
        case 2:
            param = `li=${text}&liid=${id}`;
            break;
        case '面料':
        case 3:
            param = `ma=${text}&maid=${id}`;
            break;
        case '品牌':
        case 4:
            param = `br=${text}&brid=${id}`;
            break;
        case '颜色':
        case 6:
            param = `co=${text}&coid=${id}`;
            break;
        default:
            param = ''
    }
    return param;
}

function generateUrlParams(galleryAd) {
    let params = [],
        name = new Array(5).fill('');

    if (galleryAd.oneFrontType && galleryAd.oneContent) {
        params.push(generateUrl(galleryAd.oneFrontType * 1, galleryAd.oneTagId, galleryAd.oneContent));
        name[galleryAd.oneFrontType * 1] = galleryAd.oneContent;
    }
    if (galleryAd.twoFrontType && galleryAd.twoContent) {
        params.push(generateUrl(galleryAd.twoFrontType * 1, galleryAd.twoTagId, galleryAd.twoContent));
        name[galleryAd.twoFrontType * 1] = galleryAd.twoContent;
    }

    return {
        'params': params.join('&'),
        'name': `${name[4] + ' '}${name[2] + ' '}${name[3] + ' '}${name[1]}`
    }
}

// 渲染推荐6张图
function renderBanner(d) {
    let html = '';
    d.forEach((item, i) => {
        "use strict";
        let {params, name} = generateUrlParams(item.galleryAd);
        html += ` <li>
                    <a href="/gallery/styles#/${params}"
                       target="_blank"
                       class="banner-img-bg"
                       data-name="${name}"
                       data-index="${i}"
                         style="background-image: url(${base.ossImgJpeg(item.mediaUrl)})"></a>
                         <div class="banner-img-footer">
                            <span class="name">${name}</span>
                        </div>
                </li>`;
    });
    document.getElementsByClassName('banner-classify-img')[0].innerHTML = html;
}

// 事件统计
$('.banner-classify-img').on('click', '.banner-img-bg', function () {
    let index = $(this).data('index'),
        name = $(this).data('name');
    base.eventCount.add(1025, {
        'banner名称': name
    });
});

// 渲染分类数据
function renderClassifyData() {
    let html = '';
    for (let i in mockData) {
        let bodyHtml = '';
        for (let j = 0, len = mockData[i].length; j < len; j++) {
            bodyHtml += renderClassifyItem(i, mockData[i][j]);
        }
        html += renderClassifyWrapper(i, bodyHtml);
    }
    document.getElementsByClassName('classify-content')[0].innerHTML = html;
}

function renderClassifyWrapper(title, body) {
    return ` <div class="classify-list">
                <div class="title">${title}</div>
                <ul>
                    ${body}
                </ul>
            </div>`
}

function renderClassifyItem(type, data) {
    let _style =
        `background-image:url(https://zhiyi-web.oss-cn-hangzhou.aliyuncs.com/static-web/classify-tag-id-3-${data.id}.jpg)`
    return `<li style="${_style}">
                 <a class="gallery-event"
                    data-id="${data.id}"
                    href="/gallery/styles#/${generateUrl(type, data.id, data.name)}"
                                        target="_blank">${data.name}</a>
             </li>`
}

// 事件统计
$('body').on('click', '.gallery-event', function () {
    let id = $(this).data('id');
});
renderClassifyData();