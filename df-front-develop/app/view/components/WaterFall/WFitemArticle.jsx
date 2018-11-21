import base from '../../common/baseModule'

class Article extends React.Component {

    handleClick() {
        const {id} = this.props.data;
        window.open(`${base.baseUrl}/article/detail/${id}`);
    }

    render() {
        const {data} = this.props,
            {author, picture, publishTime, title} = data;
        const _wfItemStyle = base.setDivStyle(data);

        let time = publishTime.replace(/(\d{4})-0*(\d+)-0*(\d+)(\s{1}\S*)/, '$2月$3日');

        return (
            <figure className='water-fall-item article' style={_wfItemStyle}>
                <div className='a-img' onClick={this.handleClick.bind(this)}>
                    <img src={base.ossImg(picture, 288)} alt=""/>
                </div>
                <figcaption>
                    <div className='a-title' onClick={this.handleClick.bind(this)}>{title}</div>
                    <div className='article-info'>
                        作者 {author}
                        <span>{time}</span>
                    </div>
                </figcaption>
            </figure>
        )
    }
}

export {Article};