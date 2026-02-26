import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { TimetableModel, ClassModel, DAYS_OF_WEEK } from '../types';
import { Plus, Trash2, Clock, Calendar, School } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const Timetable = () => {
  const [timetable, setTimetable] = useState<TimetableModel[]>([]);
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [selectedClassId, setSelectedClassId] = useState('');
  
  const [formData, setFormData] = useState({
    classId: '',
    subject: '',
    day: 'Monday',
    startTime: '09:00',
    endTime: '10:00'
  });

  useEffect(() => {
    setTimetable(storage.getTimetable());
    setClasses(storage.getClasses());
  }, []);

  const handleAddEntry = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.classId && formData.subject && formData.day) {
      const newEntry: TimetableModel = {
        id: `tt_${Date.now()}`,
        ...formData
      };
      const updated = [...timetable, newEntry];
      setTimetable(updated);
      storage.saveTimetable(updated);
      setFormData({ ...formData, subject: '' });
    }
  };

  const deleteEntry = (id: string) => {
    const updated = timetable.filter(t => t.id !== id);
    setTimetable(updated);
    storage.saveTimetable(updated);
  };

  const selectedClass = classes.find(c => c.id === formData.classId);
  const filteredTimetable = selectedClassId 
    ? timetable.filter(t => t.classId === selectedClassId)
    : timetable;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Academic Timetable</h2>
        <p className="text-slate-500 mt-1">Schedule subjects and time slots for each class.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Plus className="w-5 h-5 text-emerald-500" />
              Add Schedule
            </h3>
            <form onSubmit={handleAddEntry} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Class</label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({...formData, classId: e.target.value, subject: ''})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Subject</label>
                <select
                  value={formData.subject}
                  onChange={(e) => setFormData({...formData, subject: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                  disabled={!formData.classId}
                >
                  <option value="">Select Subject</option>
                  {selectedClass?.subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Day</label>
                <select
                  value={formData.day}
                  onChange={(e) => setFormData({...formData, day: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                >
                  {DAYS_OF_WEEK.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">Start</label>
                  <input
                    type="time"
                    value={formData.startTime}
                    onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">End</label>
                  <input
                    type="time"
                    value={formData.endTime}
                    onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                Add to Schedule
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
            <Calendar className="w-5 h-5 text-slate-400 ml-2" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="bg-transparent outline-none font-bold text-slate-900 flex-1"
            >
              <option value="">All Classes Schedule</option>
              {classes.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {DAYS_OF_WEEK.map(day => {
              const dayEntries = [...filteredTimetable]
                .filter(t => t.day === day)
                .sort((a, b) => a.startTime.localeCompare(b.startTime));

              if (dayEntries.length === 0 && selectedClassId) return null;
              if (dayEntries.length === 0) return null;

              const isToday = DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1] === day;

              return (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={day} 
                  className={cn(
                    "bg-white rounded-[2rem] shadow-sm border overflow-hidden transition-all duration-300",
                    isToday ? "border-emerald-500 ring-4 ring-emerald-500/5 shadow-xl" : "border-slate-100"
                  )}
                >
                  <div className={cn(
                    "px-8 py-6 flex justify-between items-center",
                    isToday ? "bg-emerald-500" : "bg-slate-900"
                  )}>
                    <h4 className="text-white font-black text-xl tracking-tight uppercase">{day}</h4>
                    {isToday && (
                      <span className="bg-white/20 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest backdrop-blur-md">
                        Today
                      </span>
                    )}
                  </div>
                  <div className="p-6 space-y-4 relative">
                    {/* Timeline line */}
                    <div className="absolute left-10 top-8 bottom-8 w-px bg-slate-100" />
                    
                    {dayEntries.map((entry) => (
                      <div key={entry.id} className="relative flex items-start gap-6 group">
                        {/* Time indicator dot */}
                        <div className={cn(
                          "mt-2 w-3 h-3 rounded-full border-2 border-white ring-2 z-10 transition-all duration-300 group-hover:scale-125",
                          isToday ? "ring-emerald-500 bg-emerald-500" : "ring-slate-200 bg-slate-200"
                        )} />
                        
                        <div className="flex-1 bg-slate-50/50 rounded-2xl p-5 border border-slate-100/50 hover:bg-white hover:shadow-md hover:border-emerald-100 transition-all duration-300 group/item">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2 py-0.5 rounded">
                                  {entry.startTime}
                                </span>
                                <span className="text-slate-300">—</span>
                                <span className="text-[10px] font-bold text-slate-400">
                                  {entry.endTime}
                                </span>
                              </div>
                              <h5 className="font-extrabold text-slate-900 text-lg leading-tight group-hover/item:text-emerald-700 transition-colors">
                                {entry.subject}
                              </h5>
                              <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
                                <School className="w-3 h-3" />
                                {classes.find(c => c.id === entry.classId)?.name}
                              </p>
                            </div>
                            <button
                              onClick={() => deleteEntry(entry.id)}
                              className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-lg hover:bg-red-50 opacity-0 group-hover:opacity-100"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              );
            })}
            {filteredTimetable.length === 0 && (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No schedule entries found for this selection.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
