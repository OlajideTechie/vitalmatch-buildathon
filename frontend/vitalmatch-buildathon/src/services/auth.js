const BASE_URL = "https://b6fc-102-89-41-90.ngrok-free.app"

// https://dfab-102-219-155-6.ngrok-free.app
export const loginUser = async (payload) => {
    const res = await fetch(
      `${BASE_URL}/api/auth/donor/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();

    if (!res.ok) {
      const error = new Error(data.message || "Login failed");
      error.response = { data };
      throw error;
    }
    return data;
};

export const registerDonor = async (payload) => {
	const res = await fetch(
		`${BASE_URL}/api/auth/donor/register`,
		{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
		}
	);

	const data = await res.json();

	if (!res.ok) {
		// Attach backend response to error
		const error = new Error(data.message || "Registration failed");
		error.response = { data };
		throw error;
	}

	return data;
};

export const registerHospital = async (payload) => {
	const res = await fetch(
		`${BASE_URL}/api/auth/hospital/register`,
		{
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify(payload),
		}
	);

	const data = await res.json();

	if (!res.ok) {
		// Attach backend response to error
		const error = new Error(data.message || "Registration failed");
		error.response = { data };
		throw error;
	}

	return data;
};

export const fetchProfile = async (token) => {
  const response = await fetch(
    `${BASE_URL}/api/auth/profile`,
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
    `${BASE_URL}/api/auth/hospital/blood-requests`,
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
    `${BASE_URL}/api/auth/hospital/blood-requests/${requestId}`,
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
    `${BASE_URL}/api/auth/hospital/blood-requests/${requestId}/donors`,
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

export const confirmDonation = async ({ acceptanceId, token }) => {
  const response = await fetch(
    `${BASE_URL}/api/auth/hospital/confirm-donation`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        acceptance_id: acceptanceId, // ✅ MUST match backend exactly
      }),
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Failed to confirm donation");
  }

  return response.json();
};

export const retryMatching = async ({ requestId, token }) => {
  const res = await fetch(
    `${BASE_URL}/api/hospital/blood-requests/${requestId}/retry-matching`,
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
    `${BASE_URL}/api/notifications`,
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

export const fetchDonorRequests = async (token) => {
  const res = await fetch(
    `${BASE_URL}/api/auth/donor/requests/dashboard`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch donor requests");
  }

  return res.json();
};

export const respondToRequest = async ({ requestId, status, token }) => {
  const res = await fetch(
    `${BASE_URL}/api/donor/requests/${requestId}/respond`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }), // "accepted" or "declined"
    }
  );

  if (!res.ok) {
    throw new Error("Failed to respond to request");
  }

  return res.json();
};