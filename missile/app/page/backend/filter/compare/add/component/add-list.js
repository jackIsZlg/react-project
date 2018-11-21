import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import _ from 'lodash'
import { Table, Input, Icon, Button, Popconfirm, Form, message } from 'antd'
import { save, remove } from '../add'

class EditableCell extends React.Component {
  static propTypes = {
    value: PropTypes.string,
    onChange: PropTypes.func,
    editable: PropTypes.bool,
    type: PropTypes.string
  }
  state = {
    value: this.props.value,
    editable: this.props.editable
  }
  handleChange = (e) => {
    const value = e.target.value
    this.setState({ value })
  }
  check = (e) => {
    // input输入为空，不允许关闭
    if (e.target.value === '' || e.target.value === undefined) {
      return
    }
    if (this.props.type === 'compareFormulaType') {
      if (/[\u4e00-\u9fa5]+/.test(e.target.value)) {
        message.error('请输入英文表达式')
        return
      }
    }
    this.setState({ editable: false })
    if (this.props.onChange) {
      this.props.onChange(this.state.value)
    }
  }
  edit = () => {
    this.setState({ editable: true })
  }
  render () {
    const { value, editable } = this.state
    return (
      <div className='editable-cell'>
        {
          editable
            ? <div className='editable-cell-input-wrapper'>
              <Input
                value={value}
                onChange={this.handleChange}
                onPressEnter={this.check}
                onBlur={this.check}
              />
              <Icon
                type='check'
                className='editable-cell-icon-check'
                onClick={this.check}
                style={{ fontSize: 18 }}
              />
            </div>
            : <div className='editable-cell-text-wrapper'>
              {value || ' '}
              <Icon
                type='edit'
                className='editable-cell-icon'
                onClick={this.edit}
                style={{ fontSize: 18 }}
              />
            </div>
        }
      </div>
    )
  }
}

@connect(
    state => ({ list: state.getIn(['add', 'list']) }),
    dispatch => ({
      save: bindActionCreators(save, dispatch),
      remove: bindActionCreators(remove, dispatch)
    })
  )
export default class EditableTable extends React.Component {
  static propTypes = {
    dataSource: PropTypes.array,
    save: PropTypes.func,
    remove: PropTypes.func,
    menu: PropTypes.string.isRequired,
    replaceStrArry: PropTypes.string
  }
  constructor (props) {
    super(props)
    this.state = {
      editable: false
    }
  }
  onCellChange = (key, dataIndex) => {
    return (value) => {
      const dataSource = [...this.state.dataSource]
      const target = dataSource.find(item => item.key === key)
      if (target) {
        target[dataIndex] = value
        this.setState({ dataSource })
      }
    }
  }
  onDelete = (key) => {
    const { remove } = this.props
    const dataSource = [...this.state.dataSource]
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) })
    // table中的key值为后端传过来的id（nubmer），新增的key格式为string,若是新增，则不执行remove()
    if (typeof (key) === 'number') {
      remove(key)
    }
  }
  handleAdd = () => {
    const { count, dataSource } = this.state
    const newData = {
      // 新增key格式为string
      key: `count-${count}`,
      compareName: '',
      compareFormula: ''
    }
    this.setState({
      dataSource: [...dataSource, newData],
      count: count + 1,
      editable: true
    })
  }

  // 取消返回动态比较值管理页面
  cancel = () => {
    window.location = '/missile/backend/filter/compare'
  }
  componentWillReceiveProps (nextProps) {
    let dataSourceNew = []
    nextProps.dataSource.forEach(item => {
      function Foo () {
        this.key = item.id
      }
      const arr = _.assign(item, new Foo())
      dataSourceNew = _.concat(dataSourceNew, arr)
    })
    this.setState({
      dataSource: dataSourceNew,
      count: 0
    })
  }
  render () {
    const { dataSource } = this.state
    return (
      <Form>
        <div>
          <Button className='editable-add-btn' onClick={this.handleAdd}>新增</Button>
          <Table
            bordered
            dataSource={dataSource}
            columns={this.columns}
            pagination={false}
            />
          <div className='editable-btn'>
            <Button onClick={this.cancel} size='large'>取消</Button>
            <Button className='editable-save-btn' onClick={this.onSubmit} type='primary' size='large'>保存</Button>
          </div>
        </div>
      </Form>
    )
  }
  get columns () {
    const editable = this.state.editable
    const columns = [
      {
        title: '比较值名称',
        dataIndex: 'compareName',
        width: '30%',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'compareName')}
            editable={editable}
            type='compareNameType'
        />
        )
      }, {
        title: '表达式',
        dataIndex: 'compareFormula',
        render: (text, record) => (
          <EditableCell
            value={text}
            onChange={this.onCellChange(record.key, 'compareFormula')}
            editable={editable}
            type='compareFormulaType'
        />
        )
      }, {
        title: '操作',
        width: '150px',
        dataIndex: 'operation',
        render: (text, record) => {
          return (
            <Popconfirm title='确认删除?' onConfirm={() => this.onDelete(record.key)}>
              <a href='#'>删除</a>
            </Popconfirm>
          )
        }
      }]
    return columns
  }

  onSubmit = e => {
    const { save } = this.props
    const dataSource = this.state.dataSource
    let compareElementColumnList = []
    dataSource.forEach(item => {
      const compareElementColumn = _.pick(item, ['compareName', 'compareFormula'])
      compareElementColumnList = _(compareElementColumnList).push(compareElementColumn)
      .value()
    })
    const data = {
      'menu': this.props.menu,
      'replaceStr': this.props.replaceStrArry,
      'compareElementColumnList': compareElementColumnList
    }
    const compareNameError = _.findIndex(compareElementColumnList, ['compareName', ''])
    const compareFormulaError = _.findIndex(compareElementColumnList, ['compareFormula', ''])
    if (compareElementColumnList.length === 0) {
      message.error('请添加筛选指标')
    } else {
      if (compareNameError === -1 && compareFormulaError === -1) {
        save(data).then(() => {
          message.success('提交成功！')
          setTimeout(() => {
            window.location = '/missile/backend/filter/compare'
          }, 500)
        })
      } else {
        message.error('请输入比较值名称或表达式名称')
      }
    }
  }
}
