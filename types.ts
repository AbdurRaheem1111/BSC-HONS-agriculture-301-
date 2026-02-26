export enum AttendanceStatus {
  PRESENT = 'Present',
  ABSENT = 'Absent',
  LATE = 'Late',
  LEAVE = 'Leave'
}

export interface ClassModel {
  id: string;
  name: string;
  subjects: string[];
}

export interface StudentModel {
  id: string;
  name: string;
  rollNo: string;
  classId: string;
}

export interface TimetableModel {
  id: string;
  classId: string;
  subject: string;
  day: string; // Monday, Tuesday, etc.
  startTime: string;
  endTime: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  classId: string;
  subject: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
}

export const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday'
];
