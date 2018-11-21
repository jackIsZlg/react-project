/**
 * Created by gewangjie on 2017/3/9.
 */
import base from '../../common/baseModule'
import {CenterHeader, CenterNav, Blogers} from '../../components/UserCenter/UserCenter'


base.channel('3');
base.headerChange('white');

let userInfo = base.LS();

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            waterFallNull: true
        }
    }

    getWFDataSuccess(state) {
        if (state.waterFallTotal > 0 && this.state.waterFallNull) {
            this.setState({
                waterFallNull: false
            })
        }
    }

    render() {
        const {avatar, name, followCount, folderCount, city, profession, intro} = userInfo;
        let {waterFallNull} = this.state;
        return (
            <div>
                <CenterHeader avatar={avatar} name={name} intro={intro} city={city} profession={profession}
                              openType={true}/>
                <CenterNav followCount={followCount} folderCount={folderCount} channel={2}/>
                <Blogers waterFallNull={waterFallNull} callDataSuccess={this.getWFDataSuccess.bind(this)}
                         openType={true}/>
            </div>
        )
    }
}

ReactDOM.render(<App/>, document.getElementById('follow-content'));



