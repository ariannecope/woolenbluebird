import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout.jsx'
import RequireAdmin from './components/RequireAdmin.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import Home from './pages/Home.jsx'
import MadeWhole from './pages/MadeWhole.jsx'
import StoryDetail from './pages/StoryDetail.jsx'
import MakerDirectory from './pages/MakerDirectory.jsx'
import MakerProfile from './pages/MakerProfile.jsx'
import Journal from './pages/Journal.jsx'
import JournalEntry from './pages/JournalEntry.jsx'
import Gather from './pages/Gather.jsx'
import About from './pages/About.jsx'
import SubmitStory from './pages/SubmitStory.jsx'
import SubmitMaker from './pages/SubmitMaker.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminHome from './pages/AdminHome.jsx'
import AdminStorySubmissionsList from './pages/AdminStorySubmissionsList.jsx'
import AdminStorySubmissionReview from './pages/AdminStorySubmissionReview.jsx'
import AdminMakerSubmissionsList from './pages/AdminMakerSubmissionsList.jsx'
import AdminMakerSubmissionReview from './pages/AdminMakerSubmissionReview.jsx'
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
        <Route path="journal/:slug" element={<JournalEntry />} />
        <Route path="gather" element={<Gather />} />
        <Route path="about" element={<About />} />
        <Route path="submit-story" element={<SubmitStory />} />
        <Route path="submit-maker" element={<SubmitMaker />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route path="admin/login" element={<AdminLogin />} />
      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<AdminHome />} />
          <Route path="admin/story-submissions" element={<AdminStorySubmissionsList />} />
          <Route path="admin/story-submissions/:id" element={<AdminStorySubmissionReview />} />
          <Route path="admin/maker-submissions" element={<AdminMakerSubmissionsList />} />
          <Route path="admin/maker-submissions/:id" element={<AdminMakerSubmissionReview />} />
        </Route>
      </Route>
    </Routes>
  )
}

export default App
