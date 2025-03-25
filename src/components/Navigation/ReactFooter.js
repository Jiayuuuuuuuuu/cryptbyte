import React from 'react'
import { Layout } from 'antd'
import { footerStyle } from '../../styles'

const { Footer } = Layout

export default function ReactFooter () {
  return (
    <Footer style={footerStyle} className="text-white py-4 px-6">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-sm mb-2 md:mb-0">
          <div className="font-semibold mb-1">Team Members:</div>
          <div className="opacity-75">
            Ong Jia Yu • Chan Qing Yee • Tham Ren Sheng • Chong Kai Zhi
          </div>
        </div>

        <div className="text-sm text-center md:text-right">
          <div className="italic opacity-75 mb-1">
            Learn, Adapt, Succeed: The Power of Self-Learning in Trading
          </div>
          <div className="flex justify-center md:justify-end space-x-4">
            <a href="https://github.com/Jiayuuuuuuuuu/cryptbyte" className="opacity-75 hover:opacity-100 transition-opacity">GitHub</a>
          </div>
        </div>
      </div>

      <div className="text-xs text-center mt-2 pt-2 border-t border-opacity-20 border-white">
        © {new Date().getFullYear()} Oversized Minions. All Rights Reserved.
      </div>
    </Footer>
  )
}
