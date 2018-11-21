import {Icon} from "../base/baseComponents";
import classNames from "classnames";

const cateList = ['裤子', '鞋子', '连衣裙', '腰带'];


class Quarter extends React.Component {

    handleSelect(item, type) {
        let {chooseQuarter} = this.props;

        chooseQuarter && chooseQuarter(item, type)
    }

    render() {
        let {quarter} = this.props;
        return (
            <div className='filter-category-item'>
                <div className="filter-category-title">
                    季度<Icon type='shouqi1'/>
                </div>
                <ul className='filter-category-pane'>
                    {quarter && quarter.map(item => <li
                        className='filter-category-pane-selection'
                        onClick={this.handleSelect.bind(this, item, 'seasons')}>{item}</li>)}
                </ul>
            </div>
        )
    }
}


class Brand extends React.Component {

    handleSelect(item, type) {
        let {chooseQuarter} = this.props;

        chooseQuarter && chooseQuarter(item, type)
    }

    chooseIdentical(item) {
        let {chooseIdentical} = this.props;

        chooseIdentical && chooseIdentical(item)
    }

    render() {
        let {brandsPane, selectedBrands, Letter} = this.props;
        return (
            <div className='filter-category-item'>
                <div className="filter-category-title">
                    品牌<Icon type='shouqi1'/>
                </div>
                <ul className='filter-category-pane brands'>
                    <div className='filter-letter'>
                        {Letter.map(item => {
                            return <span
                                className={classNames({'active': selectedBrands === item})}
                                onMouseEnter={this.chooseIdentical.bind(this, item)}>{item}</span>
                        })}
                    </div>
                    <div className="filter-tagList">
                        {brandsPane.map(item => <div className='filter-tagList-item'
                                                     onClick={this.handleSelect.bind(this, item, 'brand')}>{item}</div>)}
                    </div>
                </ul>
            </div>
        )
    }
}

class Category extends React.Component {

    handleSelect(item, type) {
        let {chooseQuarter} = this.props;

        chooseQuarter && chooseQuarter(item, type)
    }

    render() {
        let {categoryList} = this.props;
        return (
            <div className='filter-category-item'>
                <div className="filter-category-title">
                    品类<Icon type='shouqi1'/>
                </div>
                <div className='filter-category-pane category'>
                    {categoryList && categoryList.map(item => (
                        <div className="category-item">
                            <div className="categoty-title">
                                {item.categoryParent}
                            </div>
                            <ul className="category-tag-all">
                                {item.category && item.category.split(',').map(tag => <li className="category-tag-item"
                                                                                          onClick={this.handleSelect.bind(this, tag, 'categories')}>
                                    {tag}
                                </li>)}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        )
    }
}

class Category_item extends React.Component {

    handleSelect(item, type) {
        let {chooseTag} = this.props;

        chooseTag && chooseTag(item, type)
    }

    render() {
        let {categoryList} = this.props;
        return (
            <ul className='filter-image-category'>
                {categoryList && categoryList.map(item =>
                    <li className={classNames('filter-image-category-item', {'active': this.props.category === item})}
                        onClick={this.handleSelect.bind(this, item, 'category')}>{item}</li>
                )}
            </ul>
        )
    }
}

export {
    Quarter,
    Brand,
    Category,
    Category_item
}