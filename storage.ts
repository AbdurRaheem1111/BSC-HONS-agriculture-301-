import { ClassModel, StudentModel, TimetableModel, AttendanceRecord } from '../types';

const STORAGE_KEYS = {
  CLASSES: 'uni_attend_classes',
  STUDENTS: 'uni_attend_students',
  TIMETABLE: 'uni_attend_timetable',
  ATTENDANCE: 'uni_attend_attendance',
};

export const storage = {
  getClasses: (): ClassModel[] => {
    const data = localStorage.getItem(STORAGE_KEYS.CLASSES);
    return data ? JSON.parse(data) : [];
  },
  saveClasses: (classes: ClassModel[]) => {
    localStorage.setItem(STORAGE_KEYS.CLASSES, JSON.stringify(classes));
  },

  getStudents: (): StudentModel[] => {
    const data = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return data ? JSON.parse(data) : [];
  },
  saveStudents: (students: StudentModel[]) => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  },

  getTimetable: (): TimetableModel[] => {
    const data = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    return data ? JSON.parse(data) : [];
  },
  saveTimetable: (timetable: TimetableModel[]) => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  },

  getAttendance: (): AttendanceRecord[] => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return data ? JSON.parse(data) : [];
  },
  saveAttendance: (records: AttendanceRecord[]) => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(records));
  },
};
