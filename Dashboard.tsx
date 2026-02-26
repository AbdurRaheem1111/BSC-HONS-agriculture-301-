import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { seedUniversityData } from '../services/seedData';
import { 
  Users, 
  School, 
  CalendarCheck, 
  AlertCircle,
  TrendingUp,
  Import,
  CheckCircle2
} from 'lucide-react';
import { motion } from 'motion/react';

export const Dashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalClasses: 0,
    todayAttendance: 0,
    avgAttendance: 0
  });
  const [isImported, setIsImported] = useState(false);

  const loadData = () => {
    const students = storage.getStudents();
    const classes = storage.getClasses();
    const attendance = storage.getAttendance();
    
    const today = new Date().toISOString().split('T')[0];
    const todayRecords = attendance.filter(r => r.date === today);
    
    const totalPresent = attendance.filter(r => r.status === 'Present').length;
    const avg = attendance.length > 0 ? (totalPresent / attendance.length) * 100 : 0;

    setStats({
      totalStudents: students.length,
      totalClasses: classes.length,
      todayAttendance: todayRecords.length,
      avgAttendance: Math.round(avg)
    });
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleImport = () => {
    seedUniversityData();
    setIsImported(true);
    loadData();
    setTimeout(() => setIsImported(false), 3000);
  };

  const cards = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'bg-blue-500' },
    { label: 'Total Classes', value: stats.totalClasses, icon: School, color: 'bg-purple-500' },
    { label: 'Today Records', value: stats.todayAttendance, icon: CalendarCheck, color: 'bg-emerald-500' },
    { label: 'Avg Attendance', value: `${stats.avgAttendance}%`, icon: TrendingUp, color: 'bg-orange-500' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h2>
        <p className="text-slate-500 mt-1">Welcome back, Professor. Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={card.label}
            className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-5"
          >
            <div className={`${card.color} p-4 rounded-xl text-white shadow-lg`}>
              <card.icon className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              <p className="text-2xl font-bold text-slate-900">{card.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 rounded-3xl p-8 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl shadow-slate-900/20"
      >
        <div className="flex items-center gap-6">
          <div className="bg-emerald-500 p-4 rounded-2xl shadow-lg shadow-emerald-500/20">
            <Import className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold">University of Agriculture Peshawar</h3>
            <p className="text-slate-400 text-sm">BSc (Hons) Agriculture Part-I • 2nd Semester (Spring 2026)</p>
          </div>
        </div>
        <button
          onClick={handleImport}
          disabled={isImported}
          className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all flex items-center gap-2 disabled:bg-emerald-500 disabled:text-white"
        >
          {isImported ? (
            <>
              <CheckCircle2 className="w-5 h-5" />
              Timetable Imported
            </>
          ) : (
            <>
              <Import className="w-5 h-5" />
              Import Semester Timetable
            </>
          )}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-emerald-500" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left hover:bg-emerald-50 hover:border-emerald-100 transition-colors group">
              <p className="font-bold text-slate-900 group-hover:text-emerald-700">Mark Attendance</p>
              <p className="text-xs text-slate-500">For current session</p>
            </button>
            <button className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-left hover:bg-blue-50 hover:border-blue-100 transition-colors group">
              <p className="font-bold text-slate-900 group-hover:text-blue-700">Add Student</p>
              <p className="text-xs text-slate-500">Register new enrollment</p>
            </button>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-4">
            {stats.todayAttendance === 0 ? (
              <p className="text-slate-400 text-sm italic">No attendance recorded yet today.</p>
            ) : (
              <div className="flex items-center gap-4 p-3 bg-slate-50 rounded-xl">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center font-bold">
                  {stats.todayAttendance}
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900">Attendance Marked</p>
                  <p className="text-xs text-slate-500">{stats.todayAttendance} students recorded today</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
