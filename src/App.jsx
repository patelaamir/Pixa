import './App.css'
import useScreenSize from "./utils/screenSize"
import DesktopLayout from "./components/DesktopLayout"
import MobileLayout from "./components/MobileLayout"

function App() {
  const screenSize = useScreenSize()
  const layout = screenSize.width < 640 ? <MobileLayout/> : <DesktopLayout/>

  return (
    <div>
      {layout}
    </div>
  )
}

export default App
