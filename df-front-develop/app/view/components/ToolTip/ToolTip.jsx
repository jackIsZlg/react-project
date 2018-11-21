/**
 * Created by gewangjie on 2017/11/7
 */
import classNames from 'classnames'

const placement = ['top', 'left', 'right', 'bottom'];

class ToolTipWrapper extends React.Component {
    constructor(props) {
        super(props);
        this.hasDiv = false;
    }

    handleMouse(hidden = true) {
        const {props} = this;
        const {overlay, pos} = props;

        if (!this.hasDiv) {
            this.hasDiv = true;
            this.toolTipDiv = document.createElement('div');
            document.body.appendChild(this.toolTipDiv);
        }

        ReactDOM.render((
            <ToolTip pos={pos}
                     hidden={hidden}
                     el={this.tooltipWrapper}>
                {overlay}
            </ToolTip>
        ), this.toolTipDiv)
    }

    render() {
        const {props} = this;
        return (
            <div className='tooltip-wrapper'
                 ref={(el) => this.tooltipWrapper = el}
                 onMouseLeave={this.handleMouse.bind(this, true)}
                 onMouseEnter={this.handleMouse.bind(this, false)}>
                {
                    React.Children.map(props.children, function (child) {
                        return child;
                    })
                }
            </div>
        )
    }
}

ToolTipWrapper.defaultProps = {
    'pos': placement[0]
};


const toolTipAni = {'transition': 'opacity .3s,transform .3s'};

class ToolTip extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            x: 0,
            y: 0,
            opacity: 0,
            animationFlag: false
        }
    }

    componentDidMount() {
        this.setPos(this.props);
    }

    componentWillReceiveProps(nextProps) {
        let {animationFlag} = this.state;
        if (!animationFlag) {
            animationFlag = true;
        }
        this.setState({animationFlag});
        this.setPos(nextProps);
    }

    setPos(props) {

        let pos = props.pos,
            translate = {},
            targetPos = props.el.getBoundingClientRect(),
            contentPos = this.tooltip.getBoundingClientRect();


        if (pos === 'top') {
            translate = {
                'x': ~~(targetPos.left + targetPos.width / 2 - contentPos.width / 2),
                'y': ~~(targetPos.top + targetPos.height)
            }
        }

        if (pos === 'top left') {
            translate = {
                'x': ~~(targetPos.left + targetPos.width / 2 - 15),
                'y': ~~(targetPos.top + targetPos.height)

            }
        }

        if (pos === 'top right') {
            translate = {
                'x': ~~(targetPos.left +targetPos.width/2 - contentPos.width + 15),
                'y': ~~(targetPos.top + targetPos.height)
            }
        }

        if (pos === 'bottom') {
            translate = {
                'x': ~~(targetPos.left + targetPos.width / 2 - contentPos.width / 2),
                'y': ~~(targetPos.top - contentPos.height)
            }
        }

        if (pos === 'bottom left') {
            translate = {
                'x': ~~(targetPos.left + targetPos.width / 2 - 15),
                'y': ~~(targetPos.top - contentPos.height)
            }
        }

        if (pos === 'bottom right') {
            translate = {
                'x': ~~(targetPos.left +targetPos.width/2 - contentPos.width + 15),
                'y': ~~(targetPos.top - contentPos.height)
            }
        }

        if (pos === 'left') {
            translate = {
                'x': targetPos.left + targetPos.width,
                'y': targetPos.top + targetPos.height / 2 - contentPos.height / 2
            }
        }

        if (pos === 'left top') {
            translate = {
                'x': targetPos.left + targetPos.width,
                'y': targetPos.top + targetPos.height - contentPos.height / 2 + 15
            }
        }

        if (pos === 'left bottom') {
            translate = {
                'x': targetPos.left + targetPos.width,
                'y': targetPos.top - contentPos.height / 2 - 15
            }
        }

        if (pos === 'right') {
            translate = {
                'x': targetPos.left - contentPos.width,
                'y': targetPos.top + targetPos.height / 2 - contentPos.height / 2
            }
        }

        if (pos === 'right top') {
            translate = {
                'x': targetPos.left - contentPos.width,
                'y': targetPos.top + targetPos.height - contentPos.height / 2 + 15
            }
        }

        if (pos === 'right bottom') {
            translate = {
                'x': targetPos.left - contentPos.width,
                'y': targetPos.top - contentPos.height / 2 - 15
            }
        }

        this.setState({
            ...translate,
            opacity: 1
        })
    }

    render() {
        const {props, state} = this;
        const {pos, className, hidden, background} = props;
        const {x, y, opacity, animationFlag} = state;
        const transform = {
            transform: `translate(${x}px,${y}px)`,
            opacity,
            transition: animationFlag && toolTipAni.transition
        };

        return (
            <div className={classNames(`tooltip ${pos.replace(' ', '-')} ${className || ''} ${background}`, {
                'hidden': hidden
            })}
                 ref={(el) => this.tooltip = el}
                 style={transform}>
                <div className="tooltip-inner">
                    {
                        React.Children.map(props.children, function (child) {
                            return child;
                        })
                    }
                </div>
            </div>
        )
    }
}

ToolTip.defaultProps = {
    pos: placement[0],
    background: 'black',
    hidden: false
};

export {ToolTipWrapper, ToolTip};