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

// services/requests.js
export const fetchRequestById = async (requestId, token) => {
  const res = await fetch(
    `https://vitalmatch-backend-service.onrender.com/api/auth/hospital/blood-requests/${requestId}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch request details");
  }

  return res.json();
};

export const fetchDonorsByRequest = async (requestId, token) => {
  const res = await fetch(
    `https://vitalmatch-backend-service.onrender.com/api/auth/hospital/blood-requests/${requestId}/donors`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch donors');
  }

  return res.json();
};

export const confirmDonation = async ({ requestId, donorId, token }) => {
  const res = await fetch(
    "https://vitalmatch-backend-service.onrender.com/api/auth/hospital/confirm-donation",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        request_id: requestId,
        donor_id: donorId,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Failed to confirm donation");
  }

  return res.json();
};

export const retryMatching = async ({ requestId, token }) => {
  const res = await fetch(
    `https://vitalmatch-backend-service.onrender.com/api/hospital/blood-requests/${requestId}/retry-matching`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to retry matching");
  }

  return res.json();
};

export const fetchNotifications = async (token) => {
  const res = await fetch(
    "https://vitalmatch-backend-service.onrender.com/api/notifications",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch notifications");
  }

  return res.json();
};