export interface SafeUserDto {
  id: string;
  fullName: string;
  email: string;
  role: {
    id: string;
    name: string;
    permissions: string[];
  } | null;
  contractorType: string | null;
  status: string;
  profilePhoto: string;
  phone: string;
  department: string;
  position: string;
}
