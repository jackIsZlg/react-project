import base from '../../../common/baseModule'
import {TwoLevelNavigation_folder} from '../../../components/Navigation/SecondNavigation'
import FolderPage from '../../../components/FolderItem/FolderPage'

base.headerChange('white');
base.channel(9);

let requestUrl = '/folder/public/rank/list';

ReactDOM.render(<TwoLevelNavigation_folder channel={8}/>, document.querySelector('#second-level'));

ReactDOM.render(<FolderPage requestUrl={requestUrl}/>, document.querySelector('#folder-content'));