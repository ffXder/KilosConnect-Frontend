export interface UserAccount {
  userId: string;
  initials: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "custodian";
  isArchived: boolean;
  dateAdded: string;
  phoneNumber: string;
  createdAt: string;
}

export interface NewUserForm {
  firstName: string;
  lastName: string;
  password: string; 
  email: string;    
  role: string;     
  phoneNumber: string;
}