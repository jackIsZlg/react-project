class QRCodeComponent extends React.Component {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
        this.update();
    }

    componentDidUpdate() {
        this.update();
    }

    update() {
        let el = ReactDOM.findDOMNode(this);
        el.innerHTML = '';
        el.appendChild(new AraleQRCode({
            correctLevel: this.props.correctLevel,
            size: this.props.size,
            text: this.props.text
        }));
        // $(el).html('').qrcode({render: "image", size: this.props.size, text: this.props.text});
    }

    render() {
        return <span/>;
    }
}

QRCodeComponent.propTypes = {
    text: React.PropTypes.string.isRequired,
    width: React.PropTypes.number,
    height: React.PropTypes.number,
    colorLight: React.PropTypes.string,
    colorDark: React.PropTypes.string
};

QRCodeComponent.defaultProps = {
    size: 200,
    correctLevel: 2,
    colorLight: '#FFFFFF',
    colorDark: '#000000'
};

export default QRCodeComponent