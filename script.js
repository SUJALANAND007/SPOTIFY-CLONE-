// ─── DATA ───

const songs = [
  { id: 1,  title: "Blinding Lights",   artist: "The Weeknd",      emoji: "🌃", gradient: "grad-2", duration: 200 },
  { id: 2,  title: "Shape of You",      artist: "Ed Sheeran",      emoji: "🎸", gradient: "grad-1", duration: 234 },
  { id: 3,  title: "Levitating",        artist: "Dua Lipa",        emoji: "🪐", gradient: "grad-3", duration: 203 },
  { id: 4,  title: "Peaches",           artist: "Justin Bieber",   emoji: "🍑", gradient: "grad-4", duration: 198 },
  { id: 5,  title: "Bad Guy",           artist: "Billie Eilish",   emoji: "😈", gradient: "grad-5", duration: 194 },
  { id: 6,  title: "Watermelon Sugar",  artist: "Harry Styles",    emoji: "🍉", gradient: "grad-6", duration: 174 },
  { id: 7,  title: "drivers license",   artist: "Olivia Rodrigo",  emoji: "🚗", gradient: "grad-7", duration: 242 },
  { id: 8,  title: "Stay",              artist: "The Kid LAROI",   emoji: "💫", gradient: "grad-8", duration: 141 },
  { id: 9,  title: "Montero",           artist: "Lil Nas X",       emoji: "🔥", gradient: "grad-2", duration: 137 },
  { id: 10, title: "Good 4 U",          artist: "Olivia Rodrigo",  emoji: "🎤", gradient: "grad-3", duration: 178 },
  { id: 11, title: "Industry Baby",     artist: "Lil Nas X",       emoji: "🏭", gradient: "grad-4", duration: 212 },
  { id: 12, title: "Kiss Me More",      artist: "Doja Cat",        emoji: "💋", gradient: "grad-6", duration: 208 },
];

const artists = [
  { name: "The Weeknd",    emoji: "🌙", gradient: "grad-2" },
  { name: "Dua Lipa",      emoji: "💎", gradient: "grad-1" },
  { name: "Ed Sheeran",    emoji: "🎸", gradient: "grad-5" },
  { name: "Billie Eilish", emoji: "🎧", gradient: "grad-7" },
  { name: "Harry Styles",  emoji: "🌹", gradient: "grad-6" },
  { name: "Olivia Rodrigo",emoji: "💔", gradient: "grad-3" },
];

const playlists = [
  "Chill Vibes", "Workout Mix", "Late Night Drive", "Morning Coffee",
  "Party Mode", "Focus Flow", "Throwbacks", "Top Hits 2024",
  "Indie Discoveries", "R&B Classics"
];

// ─── STATE ───

let currentSong     = null;
let isPlaying       = false;
let isShuffled      = false;
let repeatMode      = 0;      // 0 = off | 1 = all | 2 = one
let isMuted         = false;
let volume          = 70;
let currentTime     = 0;
let progressInterval = null;
let likedSongs      = new Set();

// ─── RENDER ───

function renderAll() {
  renderPlaylists();
  renderFeatured();
  renderRecentlyPlayed();
  renderArtists();
  renderNewReleases();
}

function renderPlaylists() {
  const el = document.getElementById('playlistSidebar');
  el.innerHTML = playlists.map(p =>
    `<div class="playlist-item" onclick="alert('Opening: ${p}')">${p}</div>`
  ).join('');
}

function renderFeatured() {
  const featured = songs.slice(0, 6);
  document.getElementById('featuredRow').innerHTML = featured.map(s => `
    <div class="featured-card" onclick="playSong(${s.id})">
      <div class="featured-img ${s.gradient}">${s.emoji}</div>
      <div class="featured-title">${s.title}</div>
      <button class="play-btn-featured"><i class="fas fa-play"></i></button>
    </div>
  `).join('');
}

function renderRecentlyPlayed() {
  const shuffled = [...songs].sort(() => Math.random() - 0.5).slice(0, 6);
  document.getElementById('recentlyPlayed').innerHTML = shuffled.map(s => `
    <div class="card" onclick="playSong(${s.id})">
      <div class="card-thumb ${s.gradient}">${s.emoji}</div>
      <div class="card-title">${s.title}</div>
      <div class="card-sub">${s.artist}</div>
      <button class="play-btn-overlay"><i class="fas fa-play"></i></button>
    </div>
  `).join('');
}

function renderArtists() {
  document.getElementById('topArtists').innerHTML = artists.map(a => `
    <div class="card" onclick="alert('Artist: ${a.name}')">
      <div class="card-thumb circle ${a.gradient}">${a.emoji}</div>
      <div class="card-title">${a.name}</div>
      <div class="card-sub">Artist</div>
      <button class="play-btn-overlay"><i class="fas fa-play"></i></button>
    </div>
  `).join('');
}

function renderNewReleases() {
  const shuffled = [...songs].sort(() => Math.random() - 0.5).slice(0, 6);
  document.getElementById('newReleases').innerHTML = shuffled.map(s => `
    <div class="card" onclick="playSong(${s.id})">
      <div class="card-thumb ${s.gradient}">${s.emoji}</div>
      <div class="card-title">${s.title}</div>
      <div class="card-sub">${s.artist} • Single</div>
      <button class="play-btn-overlay"><i class="fas fa-play"></i></button>
    </div>
  `).join('');
}

// ─── PLAYER LOGIC ───

function playSong(id) {
  const song = songs.find(s => s.id === id);
  if (!song) return;
  currentSong = song;
  currentTime = 0;
  isPlaying = true;
  updateNowPlaying();
  startProgress();
}

function updateNowPlaying() {
  if (!currentSong) return;
  document.getElementById('npThumb').className    = `np-thumb ${currentSong.gradient}`;
  document.getElementById('npThumb').textContent  = currentSong.emoji;
  document.getElementById('npTitle').textContent  = currentSong.title;
  document.getElementById('npArtist').textContent = currentSong.artist;
  document.getElementById('totalTime').textContent = formatTime(currentSong.duration);
  document.getElementById('playIcon').className   = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  updateHeartBtn();
}

function togglePlay() {
  if (!currentSong) {
    playSong(songs[0].id);
    return;
  }
  isPlaying = !isPlaying;
  document.getElementById('playIcon').className = isPlaying ? 'fas fa-pause' : 'fas fa-play';
  if (isPlaying) startProgress();
  else stopProgress();
}

function startProgress() {
  stopProgress();
  progressInterval = setInterval(() => {
    if (!isPlaying) return;
    currentTime++;
    if (currentTime >= currentSong.duration) {
      handleSongEnd();
      return;
    }
    const pct = (currentTime / currentSong.duration) * 100;
    document.getElementById('progressFill').style.width = pct + '%';
    document.getElementById('currentTime').textContent  = formatTime(currentTime);
  }, 1000);
}

function stopProgress() {
  clearInterval(progressInterval);
}

function handleSongEnd() {
  if (repeatMode === 2) { currentTime = 0; return; }
  nextSong();
}

function prevSong() {
  if (!currentSong) return;
  if (currentTime > 3) { currentTime = 0; return; }
  const idx  = songs.findIndex(s => s.id === currentSong.id);
  const prev = songs[(idx - 1 + songs.length) % songs.length];
  playSong(prev.id);
}

function nextSong() {
  if (!currentSong) { playSong(songs[0].id); return; }
  let idx = songs.findIndex(s => s.id === currentSong.id);
  if (isShuffled) {
    let next;
    do { next = Math.floor(Math.random() * songs.length); } while (next === idx);
    idx = next;
  } else {
    idx = (idx + 1) % songs.length;
  }
  playSong(songs[idx].id);
}

function seekTo(e) {
  if (!currentSong) return;
  const bar  = document.getElementById('progressBar');
  const rect = bar.getBoundingClientRect();
  const pct  = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
  currentTime = Math.floor(pct * currentSong.duration);
  document.getElementById('progressFill').style.width = (pct * 100) + '%';
  document.getElementById('currentTime').textContent  = formatTime(currentTime);
}

function toggleShuffle() {
  isShuffled = !isShuffled;
  document.getElementById('shuffleBtn').classList.toggle('active', isShuffled);
}

function toggleRepeat() {
  repeatMode = (repeatMode + 1) % 3;
  const btn  = document.getElementById('repeatBtn');
  btn.classList.toggle('active', repeatMode > 0);
  btn.title  = ['Repeat off', 'Repeat all', 'Repeat one'][repeatMode];
  btn.querySelector('i').className = repeatMode === 2 ? 'fas fa-redo-alt' : 'fas fa-redo';
}

// ─── LIKE ───

function toggleLike() {
  if (!currentSong) return;
  if (likedSongs.has(currentSong.id)) likedSongs.delete(currentSong.id);
  else likedSongs.add(currentSong.id);
  updateHeartBtn();
}

function updateHeartBtn() {
  const btn = document.getElementById('heartBtn');
  if (currentSong && likedSongs.has(currentSong.id)) {
    btn.classList.add('liked');
    btn.innerHTML = '<i class="fas fa-heart"></i>';
  } else {
    btn.classList.remove('liked');
    btn.innerHTML = '<i class="far fa-heart"></i>';
  }
}

// ─── VOLUME ───

function toggleMute() {
  isMuted = !isMuted;
  const icon = document.getElementById('muteBtn').querySelector('i');
  icon.className = isMuted
    ? 'fas fa-volume-mute'
    : (volume > 50 ? 'fas fa-volume-up' : 'fas fa-volume-down');
  document.getElementById('volFill').style.width = isMuted ? '0%' : volume + '%';
}

function setVolume(e) {
  const bar  = document.getElementById('volSlider');
  const rect = bar.getBoundingClientRect();
  volume     = Math.max(0, Math.min(100, Math.round(((e.clientX - rect.left) / rect.width) * 100)));
  isMuted    = false;
  document.getElementById('volFill').style.width = volume + '%';
  const icon = document.getElementById('muteBtn').querySelector('i');
  icon.className = volume === 0
    ? 'fas fa-volume-mute'
    : (volume > 50 ? 'fas fa-volume-up' : 'fas fa-volume-down');
}

// ─── HELPERS ───

function formatTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// ─── INIT ───

document.getElementById('createPlaylistBtn').onclick = () => {
  const name = prompt('Playlist name:');
  if (name) {
    playlists.unshift(name);
    renderPlaylists();
  }
};

renderAll();
