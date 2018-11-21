/**
 * Created by gewangjie on 2017/10/11
 */
import classNames from 'classnames'

class PageIntro extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            status: localStorage.getItem(this.props.page) || false
        }
    }


    close() {
        this.setState({
            status: true
        }, () => {
            localStorage.setItem(this.props.page, true)
        });
    }

    del() {
        let el = ReactDOM.findDOMNode(this);
        el.parentNode.removeChild(el);
        delete this;
    }

    render() {
        return (
            <div className={classNames("page-intro", {'hide': true})}>
                <div className="container">
                    {this.props.intro}
                    <i className="iconfont cancel-pop"
                       onClick={this.close.bind(this)}/>
                </div>
            </div>
        )
    }
}

export {PageIntro}