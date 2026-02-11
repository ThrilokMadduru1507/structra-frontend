// Mock user database
// These are fake users for testing
// In a real app, users would come from a server

const mockUsers = [
  {
    id: 1,
    email: 'admin@structra.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'Administrator'
  },
  {
    id: 2,
    email: 'designer@structra.com',
    password: 'design123',
    name: 'Sarah Designer',
    role: 'Designer'
  },
  {
    id: 3,
    email: 'analyst@structra.com',
    password: 'analyst123',
    name: 'James Analyst',
    role: 'Data Analyst'
  }
];

// Function to check credentials
// Returns user object if found, null if not
export const authenticateUser = (email, password) => {
  const user = mockUsers.find(
    (u) => u.email === email && u.password === password
  );
  return user || null;
};

// Function to get user by email
export const getUserByEmail = (email) => {
  return mockUsers.find((u) => u.email === email) || null;
};

export default mockUsers;