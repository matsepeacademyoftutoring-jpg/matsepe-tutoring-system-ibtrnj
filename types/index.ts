
export type UserRole = 'admin' | 'tutor' | 'student' | 'parent' | 'receptionist';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  avatar?: string;
}

export interface Student {
  id: string;
  studentId: string;
  name: string;
  email: string;
  phone: string;
  grade: string;
  subjects: string[];
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  enrollmentDate: string;
  status: 'active' | 'inactive' | 'suspended';
  tutorId?: string;
  avatar?: string;
}

export interface Tutor {
  id: string;
  name: string;
  email: string;
  phone: string;
  subjects: string[];
  qualifications: string;
  schedule: string[];
  students: string[];
  avatar?: string;
}

export interface Class {
  id: string;
  subject: string;
  grade: string;
  tutorId: string;
  tutorName: string;
  studentIds: string[];
  schedule: {
    day: string;
    startTime: string;
    endTime: string;
  };
  room?: string;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

export interface Attendance {
  id: string;
  studentId: string;
  classId: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
}

export interface Assessment {
  id: string;
  studentId: string;
  subject: string;
  title: string;
  score: number;
  maxScore: number;
  date: string;
  type: 'test' | 'assignment' | 'exam' | 'quiz';
  notes?: string;
}

export interface Payment {
  id: string;
  studentId: string;
  amount: number;
  date: string;
  type: 'tuition' | 'registration' | 'materials' | 'other';
  status: 'paid' | 'pending' | 'overdue';
  method?: string;
  receiptNumber?: string;
}

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  recipientId: string;
  recipientName: string;
  subject: string;
  content: string;
  date: string;
  read: boolean;
}
