import React, {useState, useEffect} from 'react'
import Logo from './Logo'
import './App.css'
import ANTD from './ANTD'
console.log('import.meta.env', import.meta.env)
function App(): any {
  // Create the count state.
  const [count, setCount] = useState(0)
  // Create the counter (+1 every second).
  useEffect(() => {
    const timer = setTimeout(() => setCount(count + 1), 1000)
    return () => clearTimeout(timer)
  }, [count, setCount])
  // Return the App component.
  return (
    <div className="App">
      <header className="App-header">
        <Logo />
        <p>
          Page has been open for <code>{count}</code> seconds.
        </p>
      </header>
      <ANTD />
    </div>
  )
}

export default App
