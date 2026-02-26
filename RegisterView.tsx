import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { 
  ClassModel, 
  StudentModel, 
  AttendanceRecord, 
  AttendanceStatus 
} from '../types';
import { Printer, ChevronLeft, ChevronRight, FileSpreadsheet } from 'lucide-react';
import { cn } from '../lib/utils';

export const RegisterView = () => {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  
  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  useEffect(() => {
    setClasses(storage.getClasses());
    setStudents(storage.getStudents());
    setRecords(storage.getAttendance());
  }, []);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.classId === selectedClassId);

  // Get all unique dates for the selected subject and month
  const getDatesInMonth = () => {
    const dates = new Set<string>();
    records.forEach(r => {
      if (r.classId === selectedClassId && r.subject === selectedSubject) {
        const d = new Date(r.date);
        if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
          dates.add(r.date);
        }
      }
    });
    return Array.from(dates).sort();
  };

  const activeDates = getDatesInMonth();

  const getStatusChar = (studentId: string, date: string) => {
    const record = records.find(r => 
      r.studentId === studentId && 
      r.subject === selectedSubject && 
      r.date === date
    );
    if (!record) return '';
    if (record.status === AttendanceStatus.PRESENT) return 'P';
    if (record.status === AttendanceStatus.ABSENT) return 'A';
    if (record.status === AttendanceStatus.LEAVE) return 'L';
    return '';
  };

  const getMonthlyTotal = (studentId: string, month: number, year: number) => {
    return records.filter(r => 
      r.studentId === studentId && 
      r.subject === selectedSubject && 
      new Date(r.date).getMonth() === month &&
      new Date(r.date).getFullYear() === year &&
      (r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LEAVE)
    ).length;
  };

  const getGrandTotal = (studentId: string) => {
    return records.filter(r => 
      r.studentId === studentId && 
      r.subject === selectedSubject && 
      (r.status === AttendanceStatus.PRESENT || r.status === AttendanceStatus.LEAVE)
    ).length;
  };

  const monthName = new Date(currentYear, currentMonth).toLocaleString('default', { month: 'long' });

  return (
    <div className="space-y-8 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">Attendance Register</h2>
          <p className="text-slate-500 mt-2 font-medium italic">Official Register of Lectures Attendance</p>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-3 bg-white text-slate-900 px-6 py-3 rounded-2xl font-bold border border-slate-200 shadow-sm hover:bg-slate-50 transition-all"
          >
            <Printer className="w-5 h-5" />
            Print Register
          </button>
        </div>
      </div>

      <div className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 flex flex-wrap gap-6 items-center">
        <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <FileSpreadsheet className="w-4 h-4 text-slate-400" />
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedSubject('');
            }}
            className="bg-transparent outline-none text-sm font-black text-slate-900"
          >
            <option value="">Select Class</option>
            {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-3 bg-slate-50 px-6 py-3 rounded-2xl border border-slate-100">
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="bg-transparent outline-none text-sm font-black text-slate-900"
            disabled={!selectedClassId}
          >
            <option value="">Select Subject</option>
            {selectedClass?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="flex items-center gap-4 ml-auto">
          <button 
            onClick={() => {
              if (currentMonth === 0) {
                setCurrentMonth(11);
                setCurrentYear(currentYear - 1);
              } else {
                setCurrentMonth(currentMonth - 1);
              }
            }}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <span className="font-black text-slate-900 min-w-[120px] text-center">
            {monthName} {currentYear}
          </span>
          <button 
            onClick={() => {
              if (currentMonth === 11) {
                setCurrentMonth(0);
                setCurrentYear(currentYear + 1);
              } else {
                setCurrentMonth(currentMonth + 1);
              }
            }}
            className="p-2 hover:bg-slate-100 rounded-full transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      {selectedClassId && selectedSubject ? (
        <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-x-auto print:shadow-none print:border-none">
          <div className="p-10 min-w-[1000px]">
            <div className="text-center mb-10 border-b-2 border-slate-900 pb-6 uppercase">
              <h1 className="text-3xl font-black tracking-widest text-slate-900">The University of Agriculture, Peshawar.</h1>
              <div className="flex justify-center gap-10 mt-4 text-sm font-bold">
                <p>Register of Lectures Attendance for <span className="border-b border-slate-400 px-4">Spring 2026</span> Semester</p>
                <p>Class: <span className="border-b border-slate-400 px-4">{selectedClass?.name}</span></p>
                <p>Subject: <span className="border-b border-slate-400 px-4">{selectedSubject}</span></p>
              </div>
            </div>

            <table className="w-full border-collapse border-2 border-slate-900">
              <thead>
                <tr>
                  <th rowSpan={2} className="border-2 border-slate-900 px-4 py-2 text-left font-black uppercase text-xs w-64">Name</th>
                  <th colSpan={Math.max(activeDates.length, 15)} className="border-2 border-slate-900 px-4 py-1 text-center font-black uppercase text-[10px] tracking-widest">
                    Dates of Lectures Delivered
                  </th>
                  <th colSpan={3} className="border-2 border-slate-900 px-4 py-1 text-center font-black uppercase text-[10px] tracking-widest">Attendance</th>
                </tr>
                <tr>
                  {/* Date columns */}
                  {Array.from({ length: Math.max(activeDates.length, 15) }).map((_, i) => (
                    <th key={i} className="border-2 border-slate-900 w-8 h-12 text-center align-middle">
                      <div className="rotate-[-90deg] text-[9px] font-bold whitespace-nowrap">
                        {activeDates[i] ? new Date(activeDates[i]).getDate() : ''}
                      </div>
                    </th>
                  ))}
                  <th className="border-2 border-slate-900 w-10 text-[9px] font-black uppercase p-1 leading-tight text-center">This Month</th>
                  <th className="border-2 border-slate-900 w-10 text-[9px] font-black uppercase p-1 leading-tight text-center">Last Month</th>
                  <th className="border-2 border-slate-900 w-10 text-[9px] font-black uppercase p-1 leading-tight text-center">Total</th>
                </tr>
              </thead>
              <tbody>
                {classStudents.map((student) => {
                  const thisMonthTotal = getMonthlyTotal(student.id, currentMonth, currentYear);
                  const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                  const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                  const lastMonthTotal = getMonthlyTotal(student.id, lastMonth, lastYear);
                  const grandTotal = getGrandTotal(student.id);

                  return (
                    <tr key={student.id}>
                      <td className="border-2 border-slate-900 px-4 py-1 font-bold text-sm uppercase truncate">{student.name}</td>
                      {Array.from({ length: Math.max(activeDates.length, 15) }).map((_, i) => (
                        <td key={i} className="border-2 border-slate-900 text-center font-bold text-xs">
                          {activeDates[i] ? getStatusChar(student.id, activeDates[i]) : ''}
                        </td>
                      ))}
                      <td className="border-2 border-slate-900 text-center font-black text-xs bg-slate-50">{thisMonthTotal}</td>
                      <td className="border-2 border-slate-900 text-center font-black text-xs bg-slate-50">{lastMonthTotal}</td>
                      <td className="border-2 border-slate-900 text-center font-black text-xs bg-slate-100">{grandTotal}</td>
                    </tr>
                  );
                })}
                {/* Empty rows to fill the page like a real register */}
                {Array.from({ length: Math.max(0, 20 - classStudents.length) }).map((_, i) => (
                  <tr key={`empty-${i}`}>
                    <td className="border-2 border-slate-900 h-8"></td>
                    {Array.from({ length: Math.max(activeDates.length, 15) + 3 }).map((_, j) => (
                      <td key={j} className="border-2 border-slate-900"></td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="mt-10 flex justify-between text-sm font-black uppercase tracking-widest">
              <p>Dated: <span className="border-b border-slate-900 px-10 inline-block"></span></p>
              <p>Total Number of Lectures delivered: <span className="border-b border-slate-900 px-10 inline-block">{activeDates.length}</span></p>
              <p>Professor: <span className="border-b border-slate-900 px-10 inline-block"></span></p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-200">
          <div className="bg-slate-50 w-20 h-20 rounded-3xl flex items-center justify-center text-slate-300 mx-auto mb-6">
            <FileSpreadsheet className="w-10 h-10" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Select Class & Subject</h3>
          <p className="text-slate-400 mt-2">Choose a class and subject to view the official attendance register.</p>
        </div>
      )}
    </div>
  );
};
