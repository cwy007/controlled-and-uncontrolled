import './reset.css';

import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

import App from './App.tsx';
import Layout from './components/Layout/index.tsx';
import CalendarEnterprise from './pages/CalendarEnterprise/index.tsx';
import CalendarTest from './pages/CalendarTest/index.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<App />} />
        <Route path="/calendar-test" element={<CalendarTest />} />
        <Route path="/calendar-enterprise" element={<CalendarEnterprise />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
