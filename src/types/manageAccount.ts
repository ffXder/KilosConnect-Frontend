export interface UserAccount {
  userId: string;
  initials: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "custodian";
  isArchived: boolean;
  archivedBy: string | null;
  archivedAt: string | null;
  dateAdded: string;
  phoneNumber: string;
  createdAt: string;
  profileImage?: { url: string; public_id: string } | null;
}

export interface NewUserForm {
  firstName: string;
  lastName: string;
  password: string; 
  email: string;    
  role: string;     
  phoneNumber: string;
}