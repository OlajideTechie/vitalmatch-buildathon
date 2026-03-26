export const fetchProfile = async (token) => {
  const response = await fetch(
    'https://vitalmatch-backend-service.onrender.com/api/auth/profile',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch profile');
  }

  return response.json();
};

export const fetchRequests = async (token) => {
  const response = await fetch(
    'https://vitalmatch-backend-service.onrender.com/api/auth/hospital/blood-requests',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch requests');
  }

  return response.json();
};