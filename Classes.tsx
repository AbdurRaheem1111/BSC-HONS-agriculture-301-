import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { ClassModel } from '../types';
import { Plus, Trash2, BookOpen, School } from 'lucide-react';
import { motion } from 'motion/react';

export const Classes = () => {
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [newClassName, setNewClassName] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [subjects, setSubjects] = useState<string[]>([]);

  useEffect(() => {
    setClasses(storage.getClasses());
  }, []);

  const addSubject = () => {
    if (newSubject.trim()) {
      setSubjects([...subjects, newSubject.trim()]);
      setNewSubject('');
    }
  };

  const removeSubject = (index: number) => {
    setSubjects(subjects.filter((_, i) => i !== index));
  };

  const handleAddClass = (e: React.FormEvent) => {
    e.preventDefault();
    if (newClassName.trim() && subjects.length > 0) {
      const newClass: ClassModel = {
        id: `class_${Date.now()}`,
        name: newClassName.trim(),
        subjects: subjects
      };
      const updated = [...classes, newClass];
      setClasses(updated);
      storage.saveClasses(updated);
      setNewClassName('');
      setSubjects([]);
    }
  };

  const deleteClass = (id: string) => {
    const updated = classes.filter(c => c.id !== id);
    setClasses(updated);
    storage.saveClasses(updated);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Class Management</h2>
        <p className="text-slate-500 mt-1">Define your academic structure and subjects.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6">Add New Class</h3>
            <form onSubmit={handleAddClass} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Class Name</label>
                <input
                  type="text"
                  value={newClassName}
                  onChange={(e) => setNewClassName(e.target.value)}
                  placeholder="e.g. BS Agriculture 5th Sem"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Add Subjects</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Subject name"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                  />
                  <button
                    type="button"
                    onClick={addSubject}
                    className="bg-slate-900 text-white p-3 rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="mt-4 flex flex-wrap gap-2">
                  {subjects.map((sub, i) => (
                    <span key={i} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2">
                      {sub}
                      <button type="button" onClick={() => removeSubject(i)} className="hover:text-emerald-900">
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                Create Class
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {classes.map((cls) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                key={cls.id}
                className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 group hover:border-emerald-200 transition-all"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="bg-emerald-50 p-3 rounded-2xl text-emerald-600">
                    <School className="w-6 h-6" />
                  </div>
                  <button
                    onClick={() => deleteClass(cls.id)}
                    className="text-slate-300 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                <h4 className="text-xl font-bold text-slate-900 mb-2">{cls.name}</h4>
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <BookOpen className="w-3 h-3" />
                    Subjects
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {cls.subjects.map((sub, i) => (
                      <span key={i} className="text-xs bg-slate-50 text-slate-600 px-2 py-1 rounded-md border border-slate-100">
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
            {classes.length === 0 && (
              <div className="col-span-full py-20 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                <p className="text-slate-400 font-medium">No classes defined yet. Start by adding one!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
