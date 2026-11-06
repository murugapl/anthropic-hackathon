import { Route, Routes } from 'react-router-dom'
import { BudgetProvider } from './state/BudgetProvider'
import Layout from './routes/Layout'
import Landing from './routes/Landing'
import PatientHome from './routes/patient/PatientHome'
import AskPeri from './routes/patient/AskPeri'
import TherapyScheduler from './routes/patient/TherapyScheduler'
import DoctorDashboard from './routes/doctor/DoctorDashboard'
import PatientDetail from './routes/doctor/PatientDetail'

function App() {
  return (
    <BudgetProvider>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Landing />} />
          <Route path="patient" element={<PatientHome />} />
          <Route path="patient/chat" element={<AskPeri />} />
          <Route path="patient/therapy" element={<TherapyScheduler />} />
          <Route path="doctor" element={<DoctorDashboard />} />
          <Route path="doctor/:patientId" element={<PatientDetail />} />
        </Route>
      </Routes>
    </BudgetProvider>
  )
}

export default App
