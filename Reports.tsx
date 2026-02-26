import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { 
  ClassModel, 
  StudentModel, 
  AttendanceRecord, 
  AttendanceStatus 
} from '../types';
import { BarChart3, Download, Search, Filter, TrendingUp, Award, AlertTriangle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Reports = () => {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setClasses(storage.getClasses());
    setStudents(storage.getStudents());
    setRecords(storage.getAttendance());
  }, []);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  
  const calculatePercentage = (studentId: string) => {
    const studentRecords = records.filter(r => 
      r.studentId === studentId && 
      (selectedClassId ? r.classId === selectedClassId : true) &&
      (selectedSubject ? r.subject === selectedSubject : true)
    );
    
    if (studentRecords.length === 0) return 0;
    
    const presentCount = studentRecords.filter(r => 
      r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LEAVE
    ).length;
    
    return Math.round((presentCount / studentRecords.length) * 100);
  };

  const filteredStudents = students
    .filter(s => selectedClassId ? s.classId === selectedClassId : true)
    .filter(s => 
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .map(s => ({
      ...s,
      percentage: calculatePercentage(s.id)
    }))
    .sort((a, b) => b.percentage - a.percentage);

  const exportToCSV = () => {
    const headers = ['Name', 'Roll No', 'Class', 'Attendance %'];
    const rows = filteredStudents.map(s => [
      s.name,
      s.rollNo,
      classes.find(c => c.id === s.classId)?.name || 'N/A',
      `${s.percentage}%`
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-10 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Academic Analytics</h2>
          <p className="text-slate-500 mt-2 font-medium">Real-time attendance tracking and performance monitoring.</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-[2rem] font-black shadow-2xl hover:bg-slate-800 transition-all"
        >
          <Download className="w-5 h-5" />
          Export Report
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="bg-emerald-500 p-4 rounded-2xl text-white shadow-lg shadow-emerald-500/20">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Top Performer</p>
            <p className="text-xl font-black text-slate-900">{filteredStudents[0]?.name || 'N/A'}</p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="bg-blue-500 p-4 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Class Average</p>
            <p className="text-xl font-black text-slate-900">
              {filteredStudents.length > 0 
                ? Math.round(filteredStudents.reduce((acc, s) => acc + s.percentage, 0) / filteredStudents.length) 
                : 0}%
            </p>
          </div>
        </div>
        <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 flex items-center gap-6">
          <div className="bg-red-500 p-4 rounded-2xl text-white shadow-lg shadow-red-500/20">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Low Attendance</p>
            <p className="text-xl font-black text-slate-900">
              {filteredStudents.filter(s => s.percentage < 75).length} Students
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-wrap gap-6 items-center">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search student by name or roll..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-900"
          />
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedSubject('');
            }}
            className="bg-transparent outline-none text-sm font-black text-slate-900"
          >
            <option value="">All Classes</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <BarChart3 className="w-4 h-4 text-slate-400" />
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-transparent outline-none text-sm font-black text-slate-900"
            disabled={!selectedClassId}
          >
            <option value="">All Subjects</option>
            {selectedClass?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50/50 border-b border-slate-100">
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Name</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Roll Number</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Attendance Rate</th>
              <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredStudents.map((student) => (
              <tr key={student.id} className="hover:bg-slate-50/30 transition-colors group">
                <td className="px-10 py-6">
                  <p className="font-black text-slate-900 text-lg">{student.name}</p>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                    {classes.find(c => c.id === student.classId)?.name}
                  </p>
                </td>
                <td className="px-10 py-6">
                  <span className="font-mono font-black text-slate-400 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    {student.rollNo}
                  </span>
                </td>
                <td className="px-10 py-6">
                  <div className="flex items-center gap-4">
                    <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden max-w-[120px]">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${student.percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={cn(
                          "h-full rounded-full",
                          student.percentage >= 75 ? "bg-emerald-500" : student.percentage >= 60 ? "bg-orange-500" : "bg-red-500"
                        )}
                      />
                    </div>
                    <span className="text-lg font-black text-slate-900">{student.percentage}%</span>
                  </div>
                </td>
                <td className="px-10 py-6 text-right">
                  <span className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest",
                    student.percentage >= 75 ? "bg-emerald-50 text-emerald-600" : student.percentage >= 60 ? "bg-orange-50 text-orange-600" : "bg-red-50 text-red-600"
                  )}>
                    {student.percentage >= 75 ? 'Excellent' : student.percentage >= 60 ? 'Warning' : 'Critical'}
                  </span>
                </td>
              </tr>
            ))}
            {filteredStudents.length === 0 && (
              <tr>
                <td colSpan={4} className="px-10 py-32 text-center">
                  <div className="flex flex-col items-center gap-4 opacity-20">
                    <BarChart3 className="w-16 h-16" />
                    <p className="text-xl font-black uppercase tracking-widest">No Records Found</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
