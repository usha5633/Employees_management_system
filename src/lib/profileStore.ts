export interface EmployeeProfile {
  name: string;
  designation: string;
  employeeId: string;
  status: string;
  email: string;
  phone: string;
  location: string;
  department: string;
  manager: {
    name: string;
    designation: string;
    email: string;
    phone: string;
    initials: string;
  };
  security: {
    lastPasswordChange: string;
    lastLogin: string;
  };
  documents: Array<{ name: string; status: string; state: 'success' | 'warning' }>;
  assets: Array<{ name: string; details: string; tone: 'blue' | 'purple' | 'green' }>;
  personalInfo: Array<{ label: string; value: string }>;
  employmentInfo: Array<{ label: string; value: string }>;
  emergencyInfo: Array<{ label: string; value: string }>;
}

export let globalProfileData: EmployeeProfile = {
  name: 'Priya Sharma',
  designation: 'Senior Full Stack Developer',
  employeeId: 'EMP-2026-894',
  status: 'Active',
  email: 'priya.sharma@infinitecloud.com',
  phone: '+91 98765 43210',
  location: 'Bengaluru, India',
  department: 'Engineering & Product',
  manager: {
    name: 'Rajesh Kumar',
    designation: 'Engineering Vice President',
    email: 'rajesh.k@infinitecloud.com',
    phone: '+91 91234 56789',
    initials: 'RK',
  },
  security: {
    lastPasswordChange: '14 Days ago',
    lastLogin: 'Today, 09:42 AM • IP: 172.16.24.13',
  },
  documents: [
    { name: 'Employment Offer Letter', status: 'Verified', state: 'success' },
    { name: 'Identity Compliance', status: 'Verified', state: 'success' },
    { name: 'Tax Compliance Form', status: 'Pending Review', state: 'warning' },
    { name: 'Degree & Certifications', status: 'Verified', state: 'success' },
  ],
  assets: [
    { name: 'Laptop', details: 'MacBook Pro M3 Max 36GB', tone: 'blue' },
    { name: 'SIM card', details: 'Corporate Unlimited 5G', tone: 'purple' },
    { name: 'Access Card', details: 'HQ RFID Keycard #4829', tone: 'green' },
  ],
  personalInfo: [
    { label: 'Full Legal Name', value: 'Priya Sharma' },
    { label: 'Date of Birth', value: '14 August 1996' },
    { label: 'Blood Group', value: 'O Positive (O+)' },
    { label: 'Gender', value: 'Female' },
  ],
  employmentInfo: [
    { label: 'Date of Joining', value: '01 October 2023' },
    { label: 'Work Mode', value: 'Hybrid / Remote Flexible' },
    { label: 'Job Title', value: 'Senior Developer' },
    { label: 'Department', value: 'Software Engineering' },
  ],
  emergencyInfo: [
    { label: 'Contact Person', value: 'Anindya Sharma (Spouse)' },
    { label: 'Relationship', value: 'Spouse' },
    { label: 'Primary Contact', value: '+91 98111 22334' },
    { label: 'Alternative Contact', value: '+91 98222 33445' },
  ],
};