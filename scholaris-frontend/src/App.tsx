import { Route, Routes } from "react-router-dom"
import { LandingPage, SignInPage, SignUpPage } from "@/pages"

const App = () => {
  return (
    <Routes>
      {/* public routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/sign-in" element={<SignInPage />} />
      <Route path="/sign-in" element={<SignUpPage />} />
    </Routes>
  )
}

export default App
