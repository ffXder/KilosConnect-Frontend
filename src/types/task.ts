export type Frequency = 'Daily' | 'Weekly' | 'Monthly';

export type DayType = 
    | 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday'  // weekly
    | number   // monthly (1-31)
    | null;    // daily

export type Priority = 'Low' | 'Medium' | 'High';

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
  isBreak: boolean;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}

// create 
export type NewTask = Omit<Task, '_id' | 'isArchived' | 'createdAt' | 'updatedAt'>;

// update 
export type UpdateTask = Partial<Omit<Task, '_id' | 'createdAt' | 'updatedAt'>>;

export type TaskLogStatus = 'Pending' | 'In Progress' | 'Completed' | 'Missed';

//for task log
export interface TaskLog {
  _id: string;
  task: Pick<Task, '_id' | 'title' | 'description' | 'area' | 'startTime' | 'endTime' | 'isBreak' | 'frequency' | 'priority'>;
  status: TaskLogStatus;
  completedBy?: { _id: string; firstName: string };
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}   