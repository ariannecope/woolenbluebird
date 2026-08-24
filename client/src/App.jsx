import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import Home from './pages/Home.jsx'
import MadeWhole from './pages/MadeWhole.jsx'
import StoryDetail from './pages/StoryDetail.jsx'
import MakerDirectory from './pages/MakerDirectory.jsx'
import MakerProfile from './pages/MakerProfile.jsx'
import Journal from './pages/Journal.jsx'
import Gather from './pages/Gather.jsx'
import About from './pages/About.jsx'
import SubmitStory from './pages/SubmitStory.jsx'
import SubmitMaker from './pages/SubmitMaker.jsx'
import NotFound from './pages/NotFound.jsx'

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="made-whole" element={<MadeWhole />} />
        <Route path="made-whole/:slug" element={<StoryDetail />} />
        <Route path="makers" element={<MakerDirectory />} />
        <Route path="makers/:slug" element={<MakerProfile />} />
        <Route path="journal" element={<Journal />} />
        <Route path="gather" element={<Gather />} />
        <Route path="about" element={<About />} />
        <Route path="submit-story" element={<SubmitStory />} />
        <Route path="submit-maker" element={<SubmitMaker />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}

export default App
