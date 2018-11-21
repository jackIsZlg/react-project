/**
 * Created by gewangjie on 2017/8/8
 */
import LoadImage from '../base/LoadImage'
import base from '../../common/baseModule'

// banner
class WFItemIndexBanner extends React.Component {
    constructor(props) {
        super(props);
    }

    handleClick() {
        base.eventCount.add(1026, {
            'banner链接': this.props.data.content,
            '位置':this.props.data.position
        })
    }

    render() {
        let data = this.props.data,
            _wfItemStyle = base.setDivStyle(data);
        _wfItemStyle['width'] = `${data.width}px`;
        return <div className="water-fall-item shadow index-banner"
                    style={_wfItemStyle}>
            <a href={data.content}
               onClick={this.handleClick.bind(this)}
               target="_blank"
               rel="noopener noreferrer">
                <LoadImage src={data.cover}
                           width={data.width} height={data.height} aliWidth={data.width}/>
            </a>
        </div>
    }
}


export {WFItemIndexBanner}