const BASE_URL = "http://localhost:5000/api";

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
  const res = await fetch(`${BASE_URL}/dashboard`);
  return await res.json();
}

// ----------------------
// MEMBERS
// ----------------------
async function getMembers() {
  const res = await fetch(`${BASE_URL}/members`);
  return await res.json();
}

async function addMember(data) {
  const res = await fetch(`${BASE_URL}/members`, {
    method: "POST",
    body: data
  });

  return await res.json();
}

async function deleteMember(id) {
  const res = await fetch(`${BASE_URL}/members/${id}`, {
    method: "DELETE"
  });

  return await res.json();
}

async function updateMember(id, data) {
  const res = await fetch(`${BASE_URL}/members/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  return await res.json();
}

// ----------------------
// EXPIRING MEMBERS
// ----------------------
async function getExpiring() {
  const res = await fetch(`${BASE_URL}/members/expiring`);
  return await res.json();
}

// ----------------------
// EXPIRED MEMBERS
// ----------------------
async function getExpired() {
  const res = await fetch(`${BASE_URL}/members/expired`);
  return await res.json();
}

// ----------------------
// ACTIVE MEMBERS
// ----------------------
async function getActiveMembers() {
  const res = await fetch(`${BASE_URL}/members/active`);
  return await res.json();
}

// ----------------------
// PAYMENTS
// ----------------------
async function getPayments() {
  const res = await fetch(`${BASE_URL}/payments`);
  return await res.json();
}