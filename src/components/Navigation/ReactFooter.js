import React from 'react'
import { Layout } from 'antd'
import { footerStyle } from '../../styles'

const { Footer } = Layout

export default function ReactFooter () {
  return (
    <Footer style={footerStyle}>
            Developed by <strong>oversized minions</strong></Footer>
  )
}
