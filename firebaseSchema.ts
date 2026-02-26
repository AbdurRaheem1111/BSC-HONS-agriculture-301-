import { AttendanceStatus } from '../types';

/**
 * Firestore Schema Proposal:
 * 
 * /universities/{uniId}
 *   /classes/{classId}
 *     /sections/{sectionId}
 *       /subjects/{subjectId}
 *         /attendance/{date} (YYYY-MM-DD)
 *           {
 *             records: [
 *               { studentId: "std_1", status: "Present", timestamp: serverTimestamp() },
 *               ...
 *             ],
 *             conductedBy: "teacher_uid",
 *             totalStudents: 123
 *           }
 * 
 * /students/{studentId}
 *   {
 *     name: "...",
 *     rollNo: "...",
 *     classId: "...",
 *     sectionId: "..."
 *   }
 */

export interface AttendanceRecordFirestore {
  studentId: string;
  status: AttendanceStatus;
  timestamp: any;
}

export interface DayAttendanceSheet {
  date: string;
  subjectId: string;
  records: AttendanceRecordFirestore[];
}
