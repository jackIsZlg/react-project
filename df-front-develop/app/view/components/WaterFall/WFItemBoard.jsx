/**
 * Created by gewangjie on 2017/6/15.
 */

import base from '../../common/baseModule'

// 秀场集合-订阅
class WFItemRunwayBoard extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        const {designerId, id} = this.props.data;
        window.open(`${base.baseUrl}/show/designer/${designerId}?showId=${id}`);
    }

    _renderImgList() {
        let _array = this.props.data.showImgList, i = 0;
        // 补充数据
        while (i < 4) {
            if (_array[i] === 'undefined') {
                _array[i] = ''
            }
            i++;
        }
        return _array.map((item, i) => {
            let _style = {
                    'backgroundImage': `url(${base.ossImg(item, 142)})`
                },
                _className = `cover-${i}`;
            return <div className={_className} style={_style}/>

        });
    }

    render() {
        let data = this.props.data,
            _wfItemStyle = base.setDivStyle(data);
        return <div className="water-fall-item shadow runway board"
                    onClick={this.handleClick.bind(this)}
                    style={_wfItemStyle}>
            <div className="file-cover">
                {this._renderImgList()}
            </div>
            <div className="runway-info">
                <div className="designer">{data.designerName}</div>
                <div className="city-season">{data.city}, {data.season}</div>
            </div>
        </div>
    }
}

export {WFItemRunwayBoard}