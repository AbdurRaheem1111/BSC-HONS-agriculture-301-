import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { Classes } from './components/Classes';
import { Students } from './components/Students';
import { Timetable } from './components/Timetable';
import { Attendance } from './components/Attendance';
import { Reports } from './components/Reports';
import { RegisterView } from './components/RegisterView';
import { Login } from './components/Login';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900">
        <Sidebar />
        <main className="flex-1 p-8 lg:p-12 max-w-7xl mx-auto w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/classes" element={<Classes />} />
            <Route path="/students" element={<Students />} />
            <Route path="/timetable" element={<Timetable />} />
            <Route path="/attendance" element={<Attendance />} />
            <Route path="/register" element={<RegisterView />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
