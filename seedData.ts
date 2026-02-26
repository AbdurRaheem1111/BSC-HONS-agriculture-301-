import { storage } from './storage';
import { ClassModel, TimetableModel, StudentModel } from '../types';

export const seedUniversityData = () => {
  const classId = 'class_uap_2026';
  
  const universityClass: ClassModel = {
    id: classId,
    name: 'BSc (Hons) Agriculture 2nd Sem (Sec A)',
    subjects: [
      'ENT-311',
      'ISES-311',
      'AgM-311',
      'PBG-311',
      'MATH-311',
      'PakS-311',
      'UHQ-311',
      'Library',
      'AgM-311 Lab',
      'ENT-311 Lab',
      'PBG-311 Lab'
    ]
  };

  const timetable: TimetableModel[] = [
    // Monday
    { id: 'tt_m1', classId, subject: 'ENT-311', day: 'Monday', startTime: '08:00', endTime: '08:40' },
    { id: 'tt_m2', classId, subject: 'ISES-311', day: 'Monday', startTime: '08:40', endTime: '09:20' },
    { id: 'tt_m3', classId, subject: 'AgM-311', day: 'Monday', startTime: '09:20', endTime: '10:00' },
    { id: 'tt_m4', classId, subject: 'PBG-311', day: 'Monday', startTime: '10:00', endTime: '10:40' },
    { id: 'tt_m5', classId, subject: 'AgM-311 Lab', day: 'Monday', startTime: '10:40', endTime: '11:40' },
    { id: 'tt_m6', classId, subject: 'AgM-311 Lab', day: 'Monday', startTime: '11:40', endTime: '12:40' },
    
    // Tuesday
    { id: 'tt_t1', classId, subject: 'MATH-311', day: 'Tuesday', startTime: '08:00', endTime: '08:40' },
    { id: 'tt_t2', classId, subject: 'ISES-311', day: 'Tuesday', startTime: '08:40', endTime: '09:20' },
    { id: 'tt_t3', classId, subject: 'PakS-311', day: 'Tuesday', startTime: '09:20', endTime: '10:00' },
    { id: 'tt_t4', classId, subject: 'AgM-311', day: 'Tuesday', startTime: '10:00', endTime: '10:40' },
    { id: 'tt_t5', classId, subject: 'ENT-311 Lab', day: 'Tuesday', startTime: '10:40', endTime: '11:40' },
    { id: 'tt_t6', classId, subject: 'ENT-311 Lab', day: 'Tuesday', startTime: '11:40', endTime: '12:40' },

    // Wednesday
    { id: 'tt_w1', classId, subject: 'MATH-311', day: 'Wednesday', startTime: '08:00', endTime: '08:40' },
    { id: 'tt_w2', classId, subject: 'ISES-311', day: 'Wednesday', startTime: '08:40', endTime: '09:20' },
    { id: 'tt_w3', classId, subject: 'PakS-311', day: 'Wednesday', startTime: '09:20', endTime: '10:00' },
    { id: 'tt_w4', classId, subject: 'Library', day: 'Wednesday', startTime: '10:00', endTime: '10:40' },
    { id: 'tt_w5', classId, subject: 'PBG-311 Lab', day: 'Wednesday', startTime: '10:40', endTime: '11:40' },
    { id: 'tt_w6', classId, subject: 'PBG-311 Lab', day: 'Wednesday', startTime: '11:40', endTime: '12:40' },

    // Thursday
    { id: 'tt_th1', classId, subject: 'UHQ-311', day: 'Thursday', startTime: '08:00', endTime: '08:40' },
    { id: 'tt_th2', classId, subject: 'MATH-311', day: 'Thursday', startTime: '08:40', endTime: '09:20' },
    { id: 'tt_th3', classId, subject: 'ENT-311', day: 'Thursday', startTime: '09:20', endTime: '10:00' },
    { id: 'tt_th4', classId, subject: 'PBG-311', day: 'Thursday', startTime: '10:00', endTime: '10:40' },
  ];

  // Save to storage
  const existingClasses = storage.getClasses();
  if (!existingClasses.find(c => c.id === classId)) {
    storage.saveClasses([...existingClasses, universityClass]);
  }

  const studentNames = [
    "Muhammad Taufeeq Khan", "Huzaifa Usman", "Selab", "Awad Badar", "Waqas Uddin",
    "Ishtiaq Ahmad", "Shahab Ud Din", "Kamran Khan", "Hasan Shah", "Muhammad Atif",
    "Abdullah Shah", "Zayrab Sabir", "Adil Raza", "Shehriyar Hassan", "Haroon Ur Rashid",
    "Aftab Khan", "Muhammad Ismail", "Hamza Aftab", "Abdul Khaliq", "Uzair Ahmad",
    "Gulzar Nawaz Ahmad", "Raz Uddin", "Ihtisham Ul Haq", "Abdurraheem", "Syed Muneeb Shah",
    "Muhammad Zubair", "Imdad Ullah", "Saqibur Rahman", "Hasanain Khan", "Noor Eman",
    "Memoona Jahan", "Ayesha", "Marwa Ahmed", "Sawaira Syed", "Isbah Naseem",
    "Rania Gul Mohmand", "Syeda Abeeha Shah", "Alishba Fari", "Iram Bibi", "Sanoodiya",
    "Manahil", "Syeda Malaika Jehangir", "Marwa Khalil", "Hira Bibi", "Mahrukh Fatima",
    "Masood Khan", "Muhammad Omer", "Ayaz Muhammad", "Malak Saad Tanoli", "Muhammad Bilal",
    "Muhammad Khalid", "Tausif Ullah", "Daniyal Abbas", "Ahmad Hashim", "Shehbaz Khan",
    "Muhammad Israr Khan", "Atif Khan", "Farhadnoor", "Saad Khan", "Shahsawar Ahmad Khan",
    "Muhammad Usman", "Abdullah Khan", "Muhammad Ahsan", "Imran Jehangir", "Saud Ur Rahman",
    "Muhammad Bilal", "Kiramat Ali Khan", "Muhammad Israr", "Muhammad Usman Sidiqi", "Adnan Khan",
    "Haseen Jan", "Muhammad Waqas", "Khayam Zaman", "Nasir Khan", "Syed Talha",
    "Ashraf Ali", "Irshad Ahmad", "Hamza Maqsood", "Zain Khan", "Muhammad Umar",
    "Atif Ullah", "Farman Ullah", "Asad Ihsan", "Farhan Ullah", "Atta Ur Rehman",
    "Muhammad Dawood", "Saim Mahmood", "Syed Mehmood Ahmad Shah", "Hizbullah", "Muhammad Anfal",
    "Hashim Hussain", "Muhammad Hamza", "Muhammad Afaq Alam", "Mekail Khan", "Akhtar Rahman",
    "Zahoor Ahmad", "Muhammad Rahim", "Muhammad Yaseen Durrani", "Eric Nazir Bhatti", "Adil Khan",
    "Muhammad Abdullah", "Habib Ullah Khan", "Ihtesham Khan", "Muhammad Usman", "Muhammad Yahya Shah",
    "Hameed Ullah", "Hassan Aimal Shah", "Qazi Muhammad Zakariya", "Fawad Ali Khan", "Hammad Elahi",
    "Muhammad Aslam", "Nouman Ashraf", "Arsalan Asif Lone", "Muhammad Nouman", "Muhammad Adil Mabood",
    "Saud Ur Rahman", "Ibrar Ahmad Khan", "Muhammad Hammad", "Suliman Khan", "Muhammad Adnan",
    "Haseen Afzal", "Ibrar Hussain", "Safi ullah"
  ];

  const students: StudentModel[] = studentNames.map((name, index) => ({
    id: `std_uap_${index + 1}`,
    name,
    rollNo: `AG-26-${(index + 1).toString().padStart(3, '0')}`,
    classId
  }));

  const existingStudents = storage.getStudents();
  const filteredStudents = existingStudents.filter(s => s.classId !== classId);
  storage.saveStudents([...filteredStudents, ...students]);

  const existingTimetable = storage.getTimetable();
  const filteredTimetable = existingTimetable.filter(t => t.classId !== classId);
  storage.saveTimetable([...filteredTimetable, ...timetable]);
};
