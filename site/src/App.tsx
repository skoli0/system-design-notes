import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import TopicsPage from './pages/TopicsPage'
import TopicPage from './pages/TopicPage'
import KnowledgeGraphPage from './pages/KnowledgeGraphPage'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/topics" element={<TopicsPage />} />
        <Route path="/topics/:id" element={<TopicPage />} />
        <Route path="/graph" element={<KnowledgeGraphPage />} />
      </Route>
    </Routes>
  )
}
