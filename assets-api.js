// api.js — Central API Module for ShivExa Pro

const BASE_URL = "https://api.shivexa.com"; // Replace with your backend base URL

// Generic function to make API requests
async function request(endpoint, method = "GET", data = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const config = {
    method,
    headers,
  };

  if (data) {
    config.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("API Error:", error.message);
    throw error;
  }
}

// ==============================
// === ShivExa API Functions ===
// ==============================

// --- User Authentication ---
export function loginUser(credentials) {
  return request("/auth/login", "POST", credentials);
}

export function registerUser(userData) {
  return request("/auth/register", "POST", userData);
}

export function getUserProfile(token) {
  return request("/user/profile", "GET", null, token);
}

// --- Posts & Reels ---
export function fetchPosts() {
  return request("/posts");
}

export function createPost(postData, token) {
  return request("/posts", "POST", postData, token);
}

export function fetchReels() {
  return request("/reels");
}

// --- News & Headlines ---
export function fetchBreakingNews() {
  return request("/news/breaking");
}

export function fetchAllNews() {
  return request("/news");
}

// --- Books & PDFs ---
export function fetchBookList() {
  return request("/books");
}

export function fetchPDF(fileId) {
  return request(`/books/pdf/${fileId}`);
}

// --- Comments & Likes ---
export function addComment(postId, commentData, token) {
  return request(`/posts/${postId}/comment`, "POST", commentData, token);
}

export function likePost(postId, token) {
  return request(`/posts/${postId}/like`, "POST", null, token);
}

// --- Notifications ---
export function getNotifications(token) {
  return request("/notifications", "GET", null, token);
}

// --- Follow / Unfollow ---
export function followUser(userId, token) {
  return request(`/follow/${userId}`, "POST", null, token);
}

export function unfollowUser(userId, token) {
  return request(`/unfollow/${userId}`, "POST", null, token);
}
