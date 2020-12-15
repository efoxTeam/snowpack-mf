import React from 'react'
import {Button, DatePicker} from 'antd'
import Logo from 'host/logo'
import 'antd/dist/antd.css'
function App(): any {
  return (
    <div className="App">
      <h1>App Without NPM</h1>
      <Logo />
      <Button type="primary">PRESS ME</Button>
      <DatePicker placeholder="select date" />
    </div>
  )
}

export default App
