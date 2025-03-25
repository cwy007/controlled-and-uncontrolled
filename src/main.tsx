import './reset.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import App from './App.tsx';
import Layout from './components/Layout/index.tsx';
import CalendarEnterprise from './pages/CalendarEnterprise/index.tsx';
import CalendarTest from './pages/CalendarTest/index.tsx';
import SuspenseDemo from './pages/SuspenseDemo/index.tsx';
import ErrorBoundary from './components/ErrorBoundary/index.tsx';
import Login from './pages/Login/index.tsx';
import Signup from './pages/Signup/index.tsx';

createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route index element={<Signup />} />
        <Route element={<Layout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/app" element={<App />} />
          <Route path="/calendar-test" element={<CalendarTest />} />
          <Route path="/calendar-enterprise" element={<CalendarEnterprise />} />
          <Route path="/suspense-demo" element={<SuspenseDemo />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>
);
