// FinancePro API Helper
const API = 'http://localhost:3000/api';

function getToken(){
  return localStorage.getItem('token');
}

function getUser(){
  try{ return JSON.parse(localStorage.getItem('user')); } catch(e){ return null; }
}

function requireAuth(){
  if(!getToken()){
    window.location.href = 'auth.html';
    return false;
  }
  return true;
}

function logout(){
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'auth.html';
}

async function apiFetch(path, options={}){
  const token = getToken();
  const headers = {'Content-Type':'application/json', ...(options.headers||{})};
  if(token) headers['Authorization'] = 'Bearer ' + token;
  const res = await fetch(API + path, {...options, headers});
  if(res.status === 401){
    logout();
    return null;
  }
  return res;
}

// Inject username into nav if element exists
document.addEventListener('DOMContentLoaded', () => {
  const userEl = document.getElementById('navUser');
  if(userEl){
    const u = getUser();
    if(u) userEl.textContent = '👤 ' + u.username;
  }
});
