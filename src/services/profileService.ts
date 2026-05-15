import type { UserAccount } from "../types/manageAccount";
import { apiRequest } from "./authService";

// userId comes from useAuth() 
export const getMyProfile = async (userId: string): Promise<UserAccount> => {
  const res = await apiRequest(`/users/${userId}`, { method: "GET" });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Could not load profile");
  }
  return await res.json();
};

export const updateMyProfile = async (
  data: Pick<UserAccount, "firstName" | "lastName" | "email" | "phoneNumber">
): Promise<void> => {
  const res = await apiRequest("/users/my-profile", {
    method: "PUT",
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update profile");
  }
};

export const updateProfileImage = async (
  userId: string,
  imageFile: File
): Promise<{ url: string; public_id: string }> => {
  const formData = new FormData();
  formData.append("image", imageFile);

 
  const res = await apiRequest(`/users/${userId}/profile`, {
    method: "PUT",
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to update profile image");
  }

  const data = await res.json();
  return data.profileImage;
};