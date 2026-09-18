export interface UserAccount {
  userId: string;
  initials?: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: "admin" | "custodian"
  phoneNumber: string;
  address?: string | null;              
  mustChangePassword?: boolean;         
  requireOtp?: boolean;                 
  createdAt: string;
  updatedAt?: string;
  dateAdded?: string;
  profileImage?: { url: string; public_id: string } | null;
}

export interface NewUserForm {
  firstName: string;
  lastName: string;
  password?: string;
  email: string;
  role: "admin" | "custodian"
  phoneNumber: string;
  address?: string;
}

export type UpdateUserForm = Partial<Omit<NewUserForm, "password">>;