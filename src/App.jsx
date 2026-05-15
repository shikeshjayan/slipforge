import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom"
import Navbar from "./components/Navbar"
import Home from "./pages/Home"
import DataEntry from "./pages/DataEntry"
import Preview from "./pages/Preview"
import Settings from "./pages/Settings"

const PageLayout = () => (
  <>
    <Navbar />
    <Outlet />
  </>
)

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/data-entry" element={<DataEntry />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
