import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import ItemsList from './pages/ItemsList'
import ItemDetail from './pages/ItemDetail'
import AddItem from './pages/AddItem'
import EditItem from './pages/EditItem'

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/items" element={<ItemsList />} />
          <Route path="/items/:id" element={<ItemDetail />} />
          <Route path="/items/:id/edit" element={<EditItem />} />
          <Route path="/add" element={<AddItem />} />
        </Routes>
      </Layout>
    </Router>
  )
}

export default App

