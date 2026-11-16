import { Route, Routes } from "react-router-dom"
import Layout from "./pages/Layout"
import Dashboard from "./pages/Dashboard"
import Foodloge from "./pages/Foodloge"
import Actevity from "./pages/Actevity"
import Profile from "./pages/Profile"

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/" element={<Layout />} >
        <Route index element ={<Dashboard />} />
        <Route path="/food"  element ={<Foodloge />}/>
        <Route path="/activity"  element ={<Actevity />}/>
        <Route path="/profile"  element ={<Profile />}/>

        </Route>
      </Routes>
    </>
  )
}

export default App
