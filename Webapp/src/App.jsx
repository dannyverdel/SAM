import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from 'react-router-dom'

import { Provider as AuthProvider } from './context/authContext'
import { Provider as PersonsProvider } from './context/personsContext'
import { Provider as ResourcesProvider } from './context/resourcesContext'

import MFA from './views/auth/MFA'

import Nav from './components/Nav'

import Login from './views/auth//Login'

import DashboardIndex from './views/dashboard/Index'
import IncidentsIndex from './views/incidents/Index'

import PersonsIndex from './views/persons/Index'
import PersonsDetail from './views/persons/Detail'
import ResourcesIndex from './views/resources/Index'
import ResourcesDetail from './views/resources/Detail'

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path='/mfa' element={<MFA />} />
      <Route path='/login' element={<Login />} />
      <Route path="/" element={<Nav />}>
        <Route path="/" element={<DashboardIndex />} />
        <Route path="/incidenten" element={<IncidentsIndex />} />
        <Route path="/personen" element={<PersonsIndex />} />
        <Route path="/personen/:id" element={<PersonsDetail />} />
        <Route path="/middelen" element={<ResourcesIndex />} />
        <Route path="/middelen/:id" element={<ResourcesDetail />} />
      </Route>
    </>
  )
)

function App() {
  return (
    <>
      <AuthProvider>
        <PersonsProvider>
          <ResourcesProvider>
            <RouterProvider router={router} />
          </ResourcesProvider>
        </PersonsProvider>
      </AuthProvider>
    </>
  )
}

export default App
