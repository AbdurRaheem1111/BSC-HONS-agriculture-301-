import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { 
  ClassModel, 
  StudentModel, 
  TimetableModel, 
  AttendanceRecord, 
  AttendanceStatus,
  DAYS_OF_WEEK 
} from '../types';
import { 
  ClipboardCheck, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Layers, 
  Hash, 
  RotateCcw,
  LayoutGrid,
  ListTodo
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';
import { SwipeCard } from './SwipeCard';

type AttendanceMode = 'swipe' | 'quick' | 'list';

export const Attendance = () => {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [timetable, setTimetable] = useState<TimetableModel[]>([]);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  
  const [mode, setMode] = useState<AttendanceMode>('list');
  const [attendanceMap, setAttendanceMap] = useState<Record<string, AttendanceStatus>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [quickEntryValue, setQuickEntryValue] = useState('');
  const [isSaved, setIsSaved] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    setClasses(storage.getClasses());
    setStudents(storage.getStudents());
    setTimetable(storage.getTimetable());
    setRecords(storage.getAttendance());
  }, []);

  useEffect(() => {
    setSelectedSubject('');
    setAttendanceMap({});
    setIsSaved(false);
    setCurrentIndex(0);
    setShowConfirmModal(false);
    setMode('list');
  }, [selectedClassId]);

  useEffect(() => {
    if (selectedClassId && selectedSubject && date) {
      const existing = records.filter(r => 
        r.classId === selectedClassId && 
        r.subject === selectedSubject && 
        r.date === date
      );
      
      if (existing.length > 0) {
        const map: Record<string, AttendanceStatus> = {};
        existing.forEach(r => map[r.studentId] = r.status);
        setAttendanceMap(map);
        setIsSaved(true);
      } else {
        setAttendanceMap({});
        setIsSaved(false);
        setCurrentIndex(0);
        setShowConfirmModal(false);
        setMode('list');
      }
    }
  }, [selectedClassId, selectedSubject, date, records]);

  const selectedClass = classes.find(c => c.id === selectedClassId);
  const classStudents = students.filter(s => s.classId === selectedClassId);
  
  const dayName = DAYS_OF_WEEK[new Date(date).getDay() === 0 ? 6 : new Date(date).getDay() - 1];
  const isScheduled = timetable.some(t => 
    t.classId === selectedClassId && 
    t.subject === selectedSubject && 
    t.day === dayName
  );

  const handleMarkAllPresent = () => {
    const newMap: Record<string, AttendanceStatus> = {};
    classStudents.forEach(s => newMap[s.id] = AttendanceStatus.PRESENT);
    setAttendanceMap(newMap);
  };

  const handleSwipe = (status: AttendanceStatus) => {
    const student = classStudents[currentIndex];
    setAttendanceMap(prev => ({ ...prev, [student.id]: status }));
    if (currentIndex < classStudents.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setMode('list'); // Switch to list to review before saving
    }
  };

  const handleQuickEntry = () => {
    const presentRolls = quickEntryValue.split(',').map(s => s.trim());
    const newMap: Record<string, AttendanceStatus> = {};
    
    classStudents.forEach(student => {
      // Extract numeric part of roll number if it's like AG-26-001
      const numericRoll = student.rollNo.split('-').pop()?.replace(/^0+/, '');
      if (presentRolls.includes(numericRoll || '') || presentRolls.includes(student.rollNo)) {
        newMap[student.id] = AttendanceStatus.PRESENT;
      } else {
        newMap[student.id] = AttendanceStatus.ABSENT;
      }
    });
    
    setAttendanceMap(newMap);
    setMode('list');
  };

  const handleSave = () => {
    if (!isScheduled) return;
    
    const newRecords: AttendanceRecord[] = classStudents.map(student => ({
      id: `att_${Date.now()}_${student.id}`,
      studentId: student.id,
      classId: selectedClassId,
      subject: selectedSubject,
      date: date,
      status: attendanceMap[student.id] || AttendanceStatus.ABSENT
    }));

    const updatedRecords = [
      ...records.filter(r => !(r.classId === selectedClassId && r.subject === selectedSubject && r.date === date)),
      ...newRecords
    ];

    setRecords(updatedRecords);
    storage.saveAttendance(updatedRecords);
    setIsSaved(true);
    setShowConfirmModal(false);
  };

  const stats = {
    present: classStudents.filter(s => attendanceMap[s.id] === AttendanceStatus.PRESENT).length,
    absent: classStudents.filter(s => attendanceMap[s.id] === AttendanceStatus.ABSENT || !attendanceMap[s.id]).length,
    leave: classStudents.filter(s => attendanceMap[s.id] === AttendanceStatus.LEAVE).length,
  };

  return (
    <div className="space-y-8 pb-20">
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 p-12 max-w-lg w-full"
            >
              <div className="text-center mb-10">
                <div className="bg-slate-900 w-20 h-20 rounded-3xl flex items-center justify-center text-white mx-auto mb-6 shadow-xl">
                  <ClipboardCheck className="w-10 h-10" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 tracking-tight">Finalize Attendance?</h3>
                <p className="text-slate-500 mt-2 font-medium">Review the summary before submitting to the official register.</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-10">
                <div className="bg-emerald-50 p-6 rounded-3xl text-center border border-emerald-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-600 mb-1">Present</p>
                  <p className="text-3xl font-black text-emerald-700">{stats.present}</p>
                </div>
                <div className="bg-red-50 p-6 rounded-3xl text-center border border-red-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-600 mb-1">Absent</p>
                  <p className="text-3xl font-black text-red-700">{stats.absent}</p>
                </div>
                <div className="bg-orange-50 p-6 rounded-3xl text-center border border-orange-100">
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-600 mb-1">Leave</p>
                  <p className="text-3xl font-black text-orange-700">{stats.leave}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 px-8 py-5 rounded-2xl font-black text-slate-400 hover:bg-slate-50 transition-all uppercase tracking-widest text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-slate-900 text-white px-8 py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-slate-800 transition-all"
                >
                  Confirm & Save
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Attendance System</h2>
          <p className="text-slate-500 mt-1">Professional real-time tracking with swipe & quick entry.</p>
        </div>
        
        {selectedClassId && selectedSubject && isScheduled && !isSaved && (
          <div className="flex bg-white p-1.5 rounded-2xl shadow-sm border border-slate-100">
            <button
              onClick={() => setMode('swipe')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                mode === 'swipe' ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Layers className="w-4 h-4" /> Swipe
            </button>
            <button
              onClick={() => setMode('quick')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                mode === 'quick' ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <Hash className="w-4 h-4" /> Quick
            </button>
            <button
              onClick={() => setMode('list')}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all",
                mode === 'list' ? "bg-slate-900 text-white" : "text-slate-400 hover:text-slate-600"
              )}
            >
              <ListTodo className="w-4 h-4" /> Review
            </button>
          </div>
        )}
      </div>

      <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Class & Section</label>
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-900"
            >
              <option value="">Choose Class</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Academic Subject</label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-900"
              disabled={!selectedClassId}
            >
              <option value="">Choose Subject</option>
              {selectedClass?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1">Session Date</label>
            <div className="relative">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 border-none outline-none focus:ring-4 focus:ring-emerald-500/10 font-bold text-slate-900"
              />
            </div>
          </div>
        </div>

        {!isScheduled && selectedClassId && selectedSubject && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mt-8 p-6 bg-orange-50 border border-orange-100 rounded-3xl flex items-center gap-4 text-orange-800"
          >
            <div className="bg-orange-100 p-3 rounded-2xl">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <p className="font-black text-lg">Not Scheduled Today</p>
              <p className="text-sm opacity-80">
                {selectedSubject} is not in the timetable for {dayName}.
              </p>
            </div>
          </motion.div>
        )}
      </div>

      <AnimatePresence mode="wait">
        {selectedClassId && selectedSubject && isScheduled && (
          <motion.div
            key={mode}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="relative"
          >
            {mode === 'swipe' && !isSaved && (
              <div className="max-w-md mx-auto h-[500px] relative mt-10">
                <div className="absolute -top-12 left-0 right-0 flex justify-between items-center px-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    Student {currentIndex + 1} of {classStudents.length}
                  </span>
                  <button 
                    onClick={() => setCurrentIndex(0)}
                    className="text-emerald-600 font-bold text-xs flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset
                  </button>
                </div>
                <div className="relative w-full h-full">
                  {classStudents.map((student, index) => (
                    index === currentIndex && (
                      <SwipeCard 
                        key={student.id} 
                        student={student} 
                        subject={selectedSubject}
                        onSwipe={handleSwipe} 
                      />
                    )
                  ))}
                </div>
              </div>
            )}

            {mode === 'quick' && !isSaved && (
              <div className="bg-white p-10 rounded-[3rem] shadow-xl border border-slate-100 max-w-2xl mx-auto">
                <div className="text-center mb-8">
                  <div className="bg-emerald-500 w-16 h-16 rounded-3xl flex items-center justify-center text-white mx-auto mb-4 shadow-lg shadow-emerald-500/20">
                    <Hash className="w-8 h-8" />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">Quick Roll Entry</h3>
                  <p className="text-slate-500 mt-2">Enter roll numbers of present students separated by commas.</p>
                </div>
                
                <textarea
                  value={quickEntryValue}
                  onChange={(e) => setQuickEntryValue(e.target.value)}
                  placeholder="e.g. 1, 5, 12, 45, 102"
                  className="w-full h-40 p-8 rounded-[2rem] bg-slate-50 border-none outline-none focus:ring-4 focus:ring-emerald-500/10 font-mono text-lg text-slate-900 placeholder:text-slate-300 resize-none"
                />
                
                <button
                  onClick={handleQuickEntry}
                  className="w-full mt-8 bg-slate-900 text-white py-5 rounded-2xl font-black text-lg shadow-2xl hover:bg-slate-800 transition-all"
                >
                  Process Attendance
                </button>
              </div>
            )}

            {(mode === 'list' || isSaved) && (
              <div className="space-y-8">
                <div className="flex justify-between items-end px-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight">Student List</h3>
                  {!isSaved && (
                    <button
                      onClick={handleMarkAllPresent}
                      className="text-emerald-600 font-bold text-xs flex items-center gap-2 bg-emerald-50 px-4 py-2 rounded-xl hover:bg-emerald-100 transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Mark All Present
                    </button>
                  )}
                </div>
                <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50/50 border-b border-slate-100">
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Identity</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Roll Number</th>
                        <th className="px-10 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {classStudents.map((student) => (
                        <tr key={student.id} className="hover:bg-slate-50/30 transition-colors">
                          <td className="px-10 py-5 font-extrabold text-slate-900 text-lg">{student.name}</td>
                          <td className="px-10 py-5 font-mono font-bold text-slate-400">{student.rollNo}</td>
                          <td className="px-10 py-5">
                            <div className="flex justify-center gap-3">
                              {[AttendanceStatus.PRESENT, AttendanceStatus.ABSENT, AttendanceStatus.LEAVE].map((status) => (
                                <button
                                  key={status}
                                  onClick={() => !isSaved && setAttendanceMap(prev => ({ ...prev, [student.id]: status }))}
                                  disabled={isSaved}
                                  className={cn(
                                    "px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                    attendanceMap[student.id] === status
                                      ? status === AttendanceStatus.PRESENT ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                                        : status === AttendanceStatus.ABSENT ? "bg-red-500 text-white shadow-lg shadow-red-500/20"
                                        : "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                                      : "bg-slate-100 text-slate-400 hover:bg-slate-200"
                                  )}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end gap-6">
                  {isSaved ? (
                    <div className="flex items-center gap-4 text-emerald-600 font-black text-lg bg-emerald-50 px-10 py-5 rounded-[2rem] border border-emerald-100 shadow-sm">
                      <CheckCircle2 className="w-6 h-6" />
                      Attendance Finalized
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowConfirmModal(true)}
                      disabled={classStudents.length === 0}
                      className="bg-slate-900 text-white px-16 py-6 rounded-[2rem] font-black text-xl shadow-2xl hover:bg-slate-800 transition-all disabled:opacity-50"
                    >
                      Finalize Attendance
                    </button>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
