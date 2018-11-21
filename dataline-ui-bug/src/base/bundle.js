/**
 * Created by gewangjie on 2018/3/7
 */
import React, {Component} from 'react';

/**
 * 按需加载的页面使用Bundle组件封装，对应页面的js只在被访问时加载
 *  <Bundle load={() => import([path])}>
 *      {(Component) => <Component {...props}/>}
 *  </Bundle>
 */
export default class Bundle extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mod: null
        };
    }

    async componentWillMount() {
        this.load(this.props)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.load !== this.props.load) {
            this.load(nextProps)
        }
    }

    load(props) {
        this.setState({
            mod: null
        });
        //注意这里，使用Promise对象; mod.default导出默认
        props.load().then((mod) => {
            this.setState({
                mod: mod.default ? mod.default : mod
            });
        });
    }

    render() {
        return this.state.mod ? this.props.children(this.state.mod) : (
            <div className="loading-wrapper">
                <div className="loader">
                    <div className="inner one"/>
                    <div className="inner two"/>
                    <div className="inner three"/>
                </div>
            </div>
        );
    }
}