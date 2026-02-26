import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'motion/react';
import { Check, X, ArrowDown, RotateCcw } from 'lucide-react';
import { AttendanceStatus } from '../types';
import { cn } from '../lib/utils';

interface SwipeCardProps {
  key?: string | number;
  student: { name: string; rollNo: string };
  onSwipe: (status: AttendanceStatus) => void;
  subject: string;
}

export const SwipeCard = ({ student, onSwipe, subject }: SwipeCardProps) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const rotate = useTransform(x, [-200, 200], [-25, 25]);
  const opacity = useTransform(x, [-200, -150, 0, 150, 200], [0, 1, 1, 1, 0]);
  
  const presentOpacity = useTransform(x, [50, 150], [0, 1]);
  const absentOpacity = useTransform(x, [-150, -50], [1, 0]);
  const leaveOpacity = useTransform(y, [50, 150], [0, 1]);

  const handleDragEnd = (_: any, info: any) => {
    if (info.offset.x > 100) onSwipe(AttendanceStatus.PRESENT);
    else if (info.offset.x < -100) onSwipe(AttendanceStatus.ABSENT);
    else if (info.offset.y > 100) onSwipe(AttendanceStatus.LEAVE);
  };

  return (
    <motion.div
      drag
      dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, y, rotate, opacity }}
      className="absolute inset-0 cursor-grab active:cursor-grabbing"
    >
      <div className="w-full h-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-10 flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Status Indicators */}
        <motion.div style={{ opacity: presentOpacity }} className="absolute top-10 right-10 bg-emerald-500 text-white p-4 rounded-full shadow-lg">
          <Check className="w-8 h-8" />
        </motion.div>
        <motion.div style={{ opacity: absentOpacity }} className="absolute top-10 left-10 bg-red-500 text-white p-4 rounded-full shadow-lg">
          <X className="w-8 h-8" />
        </motion.div>
        <motion.div style={{ opacity: leaveOpacity }} className="absolute bottom-10 bg-orange-500 text-white p-4 rounded-full shadow-lg">
          <ArrowDown className="w-8 h-8" />
        </motion.div>

        <div className="mb-6">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
            {subject}
          </span>
        </div>
        
        <h3 className="text-4xl font-black text-slate-900 mb-2 tracking-tight">{student.name}</h3>
        <p className="text-xl font-mono font-bold text-slate-400">{student.rollNo}</p>
        
        <div className="mt-12 grid grid-cols-3 gap-8 w-full max-w-xs">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center text-red-500">
              <X className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Absent</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500">
              <ArrowDown className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Leave</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500">
              <Check className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-bold text-slate-400 uppercase">Present</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
