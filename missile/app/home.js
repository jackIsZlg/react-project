// 主页
import React from 'react'
import PropTypes from 'prop-types'
import { Layout } from 'component'

import { userInfo, navItems, baseURI } from 'common/config'

const { nickname } = userInfo

Home.propTypes = {
  children: PropTypes.object,
  location: PropTypes.object.isRequired
}

export default function Home ({ location, children }) {
  return (
    <Layout
      navItems={navItems}
      location={location}
      baseURI={baseURI}
      nickname={nickname}
      title={'MISSILE'}
      logo={require('./common/styles/images/logo.svg')}
    >
      {children}
    </Layout>
  )
}
