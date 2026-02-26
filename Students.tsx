import React, { useState, useEffect } from 'react';
import { storage } from '../services/storage';
import { StudentModel, ClassModel } from '../types';
import { Plus, Trash2, UserPlus, Search } from 'lucide-react';
import { motion } from 'motion/react';
import * as ReactWindow from 'react-window';
import { AutoSizer } from 'react-virtualized-auto-sizer';

const List = (ReactWindow as any).FixedSizeList || (ReactWindow as any).default?.FixedSizeList || (ReactWindow as any).default;
const TypedAutoSizer = AutoSizer as any;

export const Students = () => {
  const [students, setStudents] = useState<StudentModel[]>([]);
  const [classes, setClasses] = useState<ClassModel[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [formData, setFormData] = useState({
    name: '',
    rollNo: '',
    classId: ''
  });

  useEffect(() => {
    setStudents(storage.getStudents());
    setClasses(storage.getClasses());
  }, []);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.rollNo && formData.classId) {
      const newStudent: StudentModel = {
        id: `std_${Date.now()}`,
        ...formData
      };
      const updated = [...students, newStudent];
      setStudents(updated);
      storage.saveStudents(updated);
      setFormData({ name: '', rollNo: '', classId: '' });
    }
  };

  const deleteStudent = (id: string) => {
    const updated = students.filter(s => s.id !== id);
    setStudents(updated);
    storage.saveStudents(updated);
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const student = filteredStudents[index];
    const className = classes.find(c => c.id === student.classId)?.name || 'Unknown';

    return (
      <div 
        style={style} 
        className="flex items-center border-b border-slate-50 hover:bg-slate-50/50 transition-colors group px-6"
      >
        <div className="flex-1 min-w-0 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-slate-500 font-bold">
            {student.name.charAt(0)}
          </div>
          <span className="font-bold text-slate-900 truncate">{student.name}</span>
        </div>
        <div className="w-40 px-4">
          <span className="text-sm font-mono text-slate-600 bg-slate-100 px-2 py-1 rounded">
            {student.rollNo}
          </span>
        </div>
        <div className="w-48 px-4">
          <span className="text-sm text-slate-600 truncate block">
            {className}
          </span>
        </div>
        <div className="w-20 text-right">
          <button
            onClick={() => deleteStudent(student.id)}
            className="p-2 text-slate-300 hover:text-red-500 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Student Directory</h2>
          <p className="text-slate-500 mt-1">Manage student enrollments and records.</p>
        </div>
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name or roll no..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 pr-6 py-3 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none w-full md:w-80 bg-white"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 sticky top-24">
            <h3 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-emerald-500" />
              New Student
            </h3>
            <form onSubmit={handleAddStudent} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Roll Number</label>
                <input
                  type="text"
                  value={formData.rollNo}
                  onChange={(e) => setFormData({...formData, rollNo: e.target.value})}
                  placeholder="e.g. AG-23-01"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Assign Class</label>
                <select
                  value={formData.classId}
                  onChange={(e) => setFormData({...formData, classId: e.target.value})}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-emerald-500 outline-none"
                  required
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-bold shadow-lg shadow-emerald-500/20 hover:bg-emerald-600 transition-all"
              >
                Add Student
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden h-[600px] flex flex-col">
            <div className="flex items-center bg-slate-50 border-b border-slate-100 px-6 py-4">
              <div className="flex-1 text-xs font-bold text-slate-400 uppercase tracking-wider">Student Info</div>
              <div className="w-40 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Roll Number</div>
              <div className="w-48 px-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Class</div>
              <div className="w-20 text-right text-xs font-bold text-slate-400 uppercase tracking-wider">Actions</div>
            </div>
            <div className="flex-1">
              {filteredStudents.length > 0 ? (
                <TypedAutoSizer>
                  {({ height, width }: any) => (
                    <List
                      height={height}
                      itemCount={filteredStudents.length}
                      itemSize={72}
                      width={width}
                    >
                      {Row}
                    </List>
                  )}
                </TypedAutoSizer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 italic">
                  No students found.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
