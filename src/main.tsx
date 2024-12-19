import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter, Route, Routes } from 'react-router';
import CalendarTest from './pages/CalendarTest/index.tsx';
import Layout from './components/Layout/index.tsx';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<App />} />
        <Route path="/calendar-test" element={<CalendarTest />} />
      </Route>
    </Routes>
  </BrowserRouter>
);
