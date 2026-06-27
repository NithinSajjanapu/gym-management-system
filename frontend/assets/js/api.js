const BASE_URL = "https://gym-management-system-bjcd.onrender.com/api";
function getToken() {
    return localStorage.getItem("token");
}

// ----------------------
// AUTH
// ----------------------


async function login(username, password) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  return await res.json();
}

// ----------------------
// DASHBOARD
// ----------------------
async function getDashboard() {
  const res = await fetch(`${BASE_URL}/dashboard`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
}

// ----------------------
// MEMBERS
// ----------------------
async function getMembers() {
  const res = await fetch(`${BASE_URL}/members`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
}

async function addMember(data) {
  const res = await fetch(`${BASE_URL}/members`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${getToken()}`
    },
    body: data
  });

  return await res.json();
}

async function deleteMember(id) {
  const res = await fetch(`${BASE_URL}/members/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
}

async function updateMember(id, data) {
  const res = await fetch(`${BASE_URL}/members/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`
    },
    body: JSON.stringify(data)
  });

  return await res.json();
}

// ----------------------
// EXPIRING MEMBERS
// ----------------------
async function getExpiring() {
  const res = await fetch(`${BASE_URL}/members/expiring`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
}

// ----------------------
// EXPIRED MEMBERS
// ----------------------
async function getExpired() {
  const res = await fetch(`${BASE_URL}/members/expired`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
}
// ----------------------
// ACTIVE MEMBERS
// ----------------------
async function getActiveMembers() {
  const res = await fetch(`${BASE_URL}/members/active`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
}

// ----------------------
// PAYMENTS
// ----------------------
async function getPayments() {
  const res = await fetch(`${BASE_URL}/payments`, {
    headers: {
      Authorization: `Bearer ${getToken()}`
    }
  });

  return await res.json();
}