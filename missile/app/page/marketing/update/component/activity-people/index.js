/*
 * Author: linglan
 * Date: 2017-11-16 19:27:43
 * Email: linglan@wacai.com
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Tabs, Button, Popover, Popconfirm, Icon, message } from 'antd'
import Profile from './profile'
import Tag from './tag'

import { connect } from 'react-redux'
import * as action from '../../../action'

const TabPane = Tabs.TabPane

@connect(
  state => ({
    people: state.getIn(['activity', 'people'])
  }),
  action
)
export default class ActivityPeople extends Component {
  static propTypes = {
    router: PropTypes.object.isRequired,
    people: PropTypes.object.isRequired,
    optAddTab: PropTypes.func.isRequired,
    optDelTab: PropTypes.func.isRequired,
    optDestroyProfile: PropTypes.func.isRequired,
    optDestroyTag: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    isEdit: PropTypes.bool.isRequired,
    getPeople: PropTypes.func.isRequired
  }
  componentWillMount () {
    this.props.isEdit && this.props.getPeople({
      id: this.props.location.query.id
    })
    this.onSaves = {}
  }
  jumpToNext = () => {
    const { router, location } = this.props
    router.push({
      pathname: location.pathname.replace('/missile', ''),
      query: {
        step: 3,
        id: location.query.id
      }
    })
  }
  handleExit = e => {
    const { router } = this.props
    router.push({
      pathname: '/marketing/list'
    })
  }
  handleChangeTab = (key, action) => {
    if (action === 'remove') this.props.optDelTab(key)
  }
  handleDetroyTab = (type, order, index, reducer) => {
    const { optDestroyProfile, optDestroyTag, location } = this.props
    const id = location.query.id

    if (type === 'profile') {
      const profileId = reducer.getIn(['fields', 'profile', 'value', 'profileId'])
      const posts = {
        activityId: id,
        profileId
      }
      optDestroyProfile(order, index, posts)
      .then(() => {
        message.success('删除筛选画像成功！')
      })
    }
    if (type === 'tag') {
      const ruleId = reducer.getIn(['fields', 'rule', 'value', 'ruleId'])
      const posts = {
        activityId: id,
        ruleId
      }
      optDestroyTag(order, index, posts)
      .then(() => {
        message.success('删除跟踪规则成功！')
      })
    }
  }
  checkSaved = () => {
    const { people } = this.props
    const profile = people.get('profile')
    const tag = people.get('tag')

    const profileUnsaved = profile.filter(item => !item.get('saved'))
    const tagUnsaved = tag.filter(item => !item.get('saved'))
    return profileUnsaved.size === 0 && tagUnsaved.size === 0
  }
  saveAllTab = () => {
    const { people } = this.props
    people.get('profile').forEach((item, index) => {
      if (!item.get('saved')) {
        const onSave = this.onSaves[`profile${index}`]
        onSave && onSave()
      }
    })
    people.get('tag').forEach((item, index) => {
      if (!item.get('saved')) {
        const onSave = this.onSaves[`tag${index}`]
        onSave && onSave()
      }
    })
  }
  renderBtns = () => {
    const { optAddTab } = this.props
    return (
      <div>
        <Button
          ghost
          size='small'
          type='primary'
          className='l-mr-10'
          onClick={() => optAddTab('profile', '筛选画像')}>筛选画像</Button>
        <Button
          ghost
          size='small'
          type='primary'
          onClick={() => optAddTab('tag', '跟踪规则')}>跟踪规则</Button>
      </div>
    )
  }
  render () {
    const { people, location, router, isEdit } = this.props
    const panels = people.getIn(['tab', 'panels'])
    const id = location.query.id
    if (!id) {
      message.error('链接错误，缺少活动 ID，请重新创建活动', 1, () => {
        router.push('/marketing/add')
      })
      return null
    }
    return (
      <div>
        <Popover placement='right' content={this.renderBtns()}>
          <Button size='large' type='primary'>新建</Button>
        </Popover>
        {
          panels.size > 0
          ? <Tabs
            hideAdd
            type='editable-card'
            className='l-mt-10'
            onEdit={this.handleChangeTab}>
            {
              panels.map((item, index) => {
                const type = item.get('type')
                const order = item.get('order').toString()
                let reducer
                if (type === 'profile') reducer = people.getIn(['profile', order])
                if (type === 'tag') reducer = people.getIn(['tag', order])
                const added = reducer.get('added')
                const title = item.get('title') + order
                const sign = reducer.get('saved') ? '' : '*'

                return (
                  <TabPane
                    tab={
                      <span>
                        {`${title}${sign}`}
                        {
                          added &&
                          <Popconfirm
                            title={`是否删除${title}？`}
                            onConfirm={() => this.handleDetroyTab(type, order, index, reducer)}>
                            <Icon type='delete' onClick={e => e.stopPropagation()} />
                          </Popconfirm>
                        }
                      </span>
                    }
                    key={index}
                    closable={!added}>
                    {
                      (() => {
                        if (type === 'profile') {
                          return <Profile
                            router={this.props.router}
                            reducer={reducer}
                            order={order}
                            id={location.query.id}
                            isEdit={isEdit}
                            onSave={onsave => { this.onSaves[`profile${order}`] = onsave }} />
                        }
                        if (type === 'tag') {
                          return <Tag
                            router={this.props.router}
                            reducer={reducer}
                            order={order}
                            id={location.query.id}
                            isEdit={isEdit}
                            onSave={onsave => { this.onSaves[`tag${order}`] = onsave }} />
                        }
                      })()
                    }
                  </TabPane>
                )
              })
            }
          </Tabs>
          : <p className='u-empty-tip'>请根据筛选画像或跟踪规则新建</p>
        }
        <div className='f-clearfix'>
          <span className='f-fl'>
            <Popconfirm
              title={'是否退出，退出将丢失当前内容！'}
              onConfirm={this.handleExit}>
              <Button size='large' type='danger'>退出{isEdit ? '编辑' : '新建'}</Button>
            </Popconfirm>
          </span>
          <span className='f-fr'>
            {
              isEdit
              ? <Button
                size='large'
                disabled={this.checkSaved()}
                onClick={this.saveAllTab}>全部保存</Button>
              : <Button
                size='large'
                disabled={!this.checkSaved() || panels.size === 0}
                onClick={this.jumpToNext}>下一步</Button>
            }
          </span>
        </div>
      </div>
    )
  }
}
