export type Frequency = 'Daily' | 'Weekly' | 'Monthly';

export type DayType = 
    | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'  // weekly
    | number   // monthly (1-31)
    | null;    // daily

export type Priority = 'Low' | 'Medium' | 'High';

// for cloundinary
export interface CloudinaryImage {
    url: string;
    public_id: string;
}

export interface ChecklistItem {
    _id?: string;
    label: string;
    isDone: boolean;
}

export interface Task {
  _id: string;
  title: string;
  description?: string;
  area: string;        
  priority: Priority;
  frequency: Frequency;
  dayType: DayType;
  startTime: string;    
  endTime: string;      
  requiresVerification: boolean; 
  isBreak: boolean;
  standardPhotoUrl?: CloudinaryImage;
  checklist?: ChecklistItem[]; 
  createdAt: string;
  updatedAt: string;
}

// create 
export type NewTask = Omit<Task, '_id' | 'createdAt' | 'updatedAt'>;

// update 
export type UpdateTask = Partial<Omit<Task, '_id' | 'createdAt' | 'updatedAt'>>;

export type TaskLogStatus = 'Pending' | 'In Progress' | 'Completed' | 'Missed' | 'Disputed' | 'Pending Review' | 'Cancelled';

export type VerificationStatus = 'Not Required' | 'Pending Review' | 'Verified' | 'Rejected' | 'Disputed';

export interface UserSummary {
  _id: string;
  firstName: string;
  lastName?: string;
}
//for task log
export interface TaskLog {
  _id: string;
  task: Pick<Task, '_id' | 'standardPhotoUrl' | 'title' | 'description' | 'area' | 'startTime' | 'endTime' | 'isBreak' | 'frequency' | 'priority' | 'requiresVerification'>;
  checklist: ChecklistItem[];
  status: TaskLogStatus;
  startedBy?: UserSummary;
  startedAt?: string;
  completedBy?: UserSummary;
  completedAt?: string;
  
  // for live photo verification
  submittedPhoto?: string | null;
  verifiedBy?: UserSummary | null;
  verificationStatus: VerificationStatus;
  verificationNote?: string | null;
  createdAt: string;
  updatedAt: string;
}   

export interface AreaQRCode {
  area: string;
  url: string;
  qrCode: string;
}

// for custidan 
export interface TaskSummary {
    activePending: number;
    flagged: number;
    completed: number;
}
