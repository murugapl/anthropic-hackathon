import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { BudgetProvider } from './state/BudgetProvider'
import { ReferralProvider } from './state/ReferralProvider'
import Layout from './routes/Layout'
import Landing from './routes/Landing'
import PatientShell from './routes/patient/PatientShell'
import PatientHome from './routes/patient/PatientHome'
import Trends from './routes/patient/Trends'
import Shop from './routes/patient/Shop'
import AskPeri from './routes/patient/AskPeri'
import Care from './routes/patient/Care'
import MentalHealth from './routes/patient/MentalHealth'
import Prepare from './routes/patient/Prepare'
import PrepareTopic from './routes/patient/PrepareTopic'
import TherapyScheduler from './routes/patient/TherapyScheduler'
import DoctorDashboard from './routes/doctor/DoctorDashboard'
import PatientDetail from './routes/doctor/PatientDetail'

// Scripted demo video stage (see src/film/Film.tsx). Lazy so it never weighs on the app.
const Film = lazy(() => import('./film/Film'))

function App() {
  return (
    <BudgetProvider>
      <ReferralProvider>
        <Routes>
          <Route
            path="film"
            element={
              <Suspense fallback={null}>
                <Film />
              </Suspense>
            }
          />
          <Route element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="doctor" element={<DoctorDashboard />} />
            <Route path="doctor/:patientId" element={<PatientDetail />} />
          </Route>
          <Route path="patient" element={<PatientShell />}>
            <Route index element={<PatientHome />} />
            <Route path="trends" element={<Trends />} />
            <Route path="shop" element={<Shop />} />
            <Route path="mind" element={<MentalHealth />} />
            <Route path="chat" element={<AskPeri />} />
            <Route path="care" element={<Care />} />
            <Route path="prepare" element={<Prepare />} />
            <Route path="prepare/:topicId" element={<PrepareTopic />} />
            <Route path="therapy" element={<TherapyScheduler />} />
          </Route>
        </Routes>
      </ReferralProvider>
    </BudgetProvider>
  )
}

export default App
