import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'

import { Provider as AuthProvider } from './context/authContext'

import Nav from './components/Nav'

import Login from './views/auth//Login'

import DashboardIndex from './views/dashboard/Index'

import IncidentsIndex from './views/incidents/Index'

import PersonsIndex from './views/persons/Index'

import ResourcesIndex from './views/resources/Index'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/login' element={<Login />} />
      <Route path="/" element={<Nav />}>
        <Route path="/" element={<DashboardIndex />} />
        <Route path="/incidenten" element={<IncidentsIndex />} />
        <Route path="/personen" element={<PersonsIndex />} />
        <Route path="/resources" element={<ResourcesIndex />} />
      </Route>
    </>
  )
)

function App() {
  return (
    <>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </>
  )
}

export default App
