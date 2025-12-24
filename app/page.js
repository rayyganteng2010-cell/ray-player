<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Ray Player • YouTube Audio Mode</title>

  <!-- Tailwind + Fonts + Icons -->
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;700;900&display=swap" rel="stylesheet">
  <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">

  <script>
    tailwind.config = {
      theme: {
        extend: {
          fontFamily: { sans: ['Outfit', 'sans-serif'] },
          colors: {
            glass: "rgba(255, 255, 255, 0.05)",
            glassBorder: "rgba(255, 255, 255, 0.1)",
          }
        }
      }
    }
  </script>

  <style>
    body {
      background-color: #050505;
      background-image:
        radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%),
        radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%),
        radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
      color: #fff;
      overflow-x: hidden;
    }
    .blob-bg {
      position: fixed; top: -20%; left: -20%;
      width: 140vw; height: 140vh;
      background:
        radial-gradient(circle at 15% 50%, rgba(76, 29, 149, 0.15), transparent 40%),
        radial-gradient(circle at 85% 30%, rgba(14, 165, 233, 0.15), transparent 40%);
      z-index: -1;
      animation: moveGradient 20s ease-in-out infinite alternate;
    }
    @keyframes moveGradient { 0%{transform:scale(1)} 100%{transform:scale(1.1)} }
    .glass-panel {
      background: rgba(20, 20, 25, 0.6);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 20px 50px rgba(0,0,0,0.5);
    }
    .glass-input {
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      transition: all 0.3s ease;
    }
    .glass-input:focus {
      background: rgba(0, 0, 0, 0.5);
      border-color: rgba(56, 189, 248, 0.5);
      box-shadow: 0 0 15px rgba(56, 189, 248, 0.2);
    }
    input[type="range"] { -webkit-appearance:none; background:transparent; height:6px; border-radius:5px; cursor:pointer; }
    input[type="range"]::-webkit-slider-runnable-track { width:100%; height:6px; background:rgba(255,255,255,0.1); border-radius:5px; }
    input[type="range"]::-webkit-slider-thumb {
      -webkit-appearance:none; height:16px; width:16px; border-radius:50%;
      background:#38bdf8; margin-top:-5px;
      box-shadow:0 0 10px rgba(56,189,248,0.5); transition:transform 0.1s;
    }
    input[type="range"]::-webkit-slider-thumb:hover { transform: scale(1.2); }
    .modern-scroll::-webkit-scrollbar { width:6px; }
    .modern-scroll::-webkit-scrollbar-track { background:transparent; }
    .modern-scroll::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.15); border-radius:10px; }
    .modern-scroll::-webkit-scrollbar-thumb:hover { background:rgba(255,255,255,0.3); }

    .spin-slow { animation: spin 8s linear infinite; }
    @keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

    .toast-anim { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    @keyframes slideUp {
      from { opacity: 0; transform: translateY(20px) scale(0.95); }
      to { opacity: 1; transform: translateY(0) scale(1); }
    }

    .btn-action {
      background: linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05));
      border: 1px solid rgba(255,255,255,0.1);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    }
    .btn-action:hover { background: rgba(255,255,255,0.15); transform: translateY(-2px); }
    .btn-action:active { transform: translateY(0) scale(0.98); }

    .btn-primary {
      background: linear-gradient(135deg, #0ea5e9, #2563eb);
      box-shadow: 0 4px 15px rgba(14, 165, 233, 0.4);
      border: none;
    }
    .btn-primary:hover {
      box-shadow: 0 6px 20px rgba(14, 165, 233, 0.6);
      filter: brightness(1.1);
    }

    .cover-art { transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

    /* Hidden YT Player container */
    #ytPlayer {
      width: 0; height: 0; overflow: hidden;
      position: absolute; left: -9999px; top: -9999px;
    }
  </style>
</head>

<body class="min-h-screen flex flex-col items-center pt-8 pb-32">
  <div class="blob-bg"></div>

  <div class="w-full max-w-6xl px-4 z-10">
    <header class="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
      <div class="text-center md:text-left">
        <h1 class="text-5xl font-black tracking-tight">
          <span class="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-violet-400 to-fuchsia-400">𝐑𝐚𝐲</span>
          <span class="text-white/90">Player</span>
        </h1>
        <p class="text-white/40 text-sm font-medium tracking-wide mt-1 uppercase">YouTube Audio Mode • Vercel Ready</p>
      </div>

      <div class="flex items-center gap-3 bg-black/20 p-1.5 rounded-full border border-white/5 backdrop-blur-md">
        <span id="repeatModeText" class="px-4 py-1.5 text-xs font-bold text-sky-300 bg-sky-500/10 rounded-full border border-sky-500/20">Loop: Off</span>
        <button onclick="cycleRepeat()" class="w-9 h-9 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white transition active:scale-95">
          <i class="fas fa-repeat"></i>
        </button>
      </div>
    </header>

    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
      <div class="lg:col-span-7 space-y-6">
        <div class="glass-panel p-2 rounded-2xl flex items-center relative group">
          <div class="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
            <i class="fas fa-search text-gray-400 group-focus-within:text-sky-400 transition-colors"></i>
          </div>
          <input id="searchInput" type="text"
            class="block w-full pl-12 pr-4 py-4 bg-transparent text-white placeholder-gray-500 focus:outline-none font-medium text-lg"
            placeholder="Cari lagu apa hari ini?" autocomplete="off">
          <button id="searchBtn" onclick="searchMusic()" class="btn-primary text-white font-bold py-3 px-8 rounded-xl mr-1 transition-all">
            <span id="searchBtnText">Cari</span>
          </button>
        </div>

        <div id="resultContainer" class="hidden glass-panel p-6 rounded-3xl relative overflow-hidden">
          <div class="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

          <div class="flex flex-col sm:flex-row gap-6 items-center sm:items-start relative z-10">
            <div class="relative group">
              <img id="thumb" src="" alt="Album Art" class="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl object-cover shadow-2xl border border-white/10 group-hover:scale-105 transition-transform duration-500">
              <div class="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl backdrop-blur-[2px]">
                <i class="fas fa-music text-3xl text-white/80"></i>
              </div>
            </div>

            <div class="flex-1 text-center sm:text-left min-w-0 w-full">
              <h2 id="title" class="text-2xl sm:text-3xl font-bold leading-tight truncate text-white mb-2">Judul Lagu</h2>
              <div class="flex flex-wrap items-center justify-center sm:justify-start gap-3 mb-6">
                <span class="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold text-gray-300">
                  <i class="fas fa-clock mr-1.5 text-sky-400"></i><span id="duration">0:00</span>
                </span>
                <span class="px-3 py-1 rounded-lg bg-green-500/10 border border-green-500/20 text-xs font-semibold text-green-400">
                  YouTube
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <button onclick="playResultSingle()" class="btn-primary py-3.5 px-6 rounded-xl font-bold flex items-center justify-center gap-2 group">
                  <i class="fas fa-play group-hover:scale-110 transition-transform"></i> Play Now
                </button>
                <button onclick="addToPlaylistFromResult()" class="btn-action py-3.5 px-6 rounded-xl font-bold text-gray-200 flex items-center justify-center gap-2">
                  <i class="fas fa-plus"></i> Add Playlist
                </button>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center lg:text-left">
          <p class="text-white/30 text-sm italic">"Music is the soundtrack of your life."</p>
        </div>
      </div>

      <div class="lg:col-span-5">
        <div class="glass-panel p-6 rounded-3xl h-[500px] flex flex-col relative">
          <div class="flex items-center justify-between mb-6">
            <div>
              <h3 class="text-xl font-bold flex items-center gap-2">
                <i class="fas fa-list-ul text-sky-400"></i> Playlist
              </h3>
              <p id="playlistMeta" class="text-xs text-gray-400 mt-1">0 Tracks • Single Mode</p>
            </div>
            <div class="flex gap-2">
              <button onclick="shufflePlaylist()" class="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-300 transition" title="Shuffle">
                <i class="fas fa-random text-sm"></i>
              </button>
              <button onclick="clearPlaylist()" class="w-8 h-8 rounded-lg bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 flex items-center justify-center text-red-400 transition" title="Clear">
                <i class="fas fa-trash-alt text-sm"></i>
              </button>
            </div>
          </div>

          <div id="playlistList" class="flex-1 overflow-y-auto modern-scroll space-y-2 pr-2"></div>

          <div id="playlistEmpty" class="absolute inset-0 flex flex-col items-center justify-center text-gray-500 pointer-events-none">
            <i class="fas fa-compact-disc text-5xl mb-3 opacity-20"></i>
            <p class="text-sm">Playlist kosong</p>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Bottom Player -->
  <div id="playerControl" class="fixed bottom-6 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:w-[95%] max-w-4xl transform translate-y-[150%] transition-transform duration-500 z-50">
    <div class="glass-panel p-4 pr-6 rounded-[2rem] flex items-center gap-5 shadow-[0_8px_32px_rgba(0,0,0,0.6)] border border-white/10 bg-[#0a0a0c]/80">
      <div class="relative shrink-0 group">
        <img id="miniThumb" src="" class="cover-art w-16 h-16 rounded-full object-cover border-2 border-white/10 shadow-lg" alt="">
        <div id="playingIndicator" class="absolute inset-0 rounded-full border-2 border-sky-400 border-t-transparent animate-spin hidden"></div>
        <div class="absolute -bottom-1 -right-1 bg-black text-xs px-1.5 py-0.5 rounded-md border border-white/10 text-gray-400" id="nowIndexMini"></div>
      </div>

      <div class="flex-1 min-w-0 flex flex-col justify-center gap-1">
        <div class="flex justify-between items-end mb-1">
          <div class="min-w-0 pr-4">
            <h4 id="miniTitle" class="font-bold text-white text-lg truncate leading-tight">Waiting for music...</h4>
            <div class="flex items-center gap-2 mt-0.5">
              <span id="modeBadge" class="text-[10px] uppercase tracking-wider font-bold px-1.5 py-0.5 rounded bg-white/10 text-gray-300">Single</span>
              <span id="statusText" class="text-xs text-sky-400">Ready</span>
            </div>
          </div>

          <div class="hidden sm:flex items-center gap-2 group">
            <i class="fas fa-volume-up text-gray-400 text-xs"></i>
            <input id="volBar" type="range" min="0" max="1" step="0.01" value="1" class="w-20 accent-sky-400">
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span id="curTime" class="text-xs font-mono text-gray-400 w-9 text-right">0:00</span>
          <div class="relative flex-1 h-4 flex items-center group">
            <input id="seekBar" type="range" min="0" max="100" value="0" class="w-full relative z-10 opacity-0 group-hover:opacity-100 transition-opacity h-full cursor-pointer">
            <div class="absolute left-0 right-0 h-1.5 bg-white/10 rounded-full overflow-hidden pointer-events-none">
              <div id="progressBarFill" class="h-full bg-gradient-to-r from-sky-400 to-violet-500 w-0 transition-all duration-100 ease-out relative">
                <div class="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.8)]"></div>
              </div>
            </div>
          </div>
          <span id="totTime" class="text-xs font-mono text-gray-400 w-9">0:00</span>
        </div>
      </div>

      <div class="flex items-center gap-3 pl-2 border-l border-white/5">
        <button onclick="prevTrack()" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition"><i class="fas fa-step-backward"></i></button>

        <button id="toggleBtn" onclick="togglePlay()" class="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          <i class="fas fa-play ml-1 text-xl"></i>
        </button>

        <button onclick="nextTrack()" class="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white hover:bg-white/10 transition"><i class="fas fa-step-forward"></i></button>
      </div>
    </div>
  </div>

  <div id="toastWrap" class="fixed top-6 left-0 right-0 flex flex-col items-center gap-2 pointer-events-none z-[60]"></div>

  <!-- Hidden YouTube Player -->
  <div id="ytPlayer"></div>

  <script>
    /* ===========================
       CONFIG (Vercel API route)
       =========================== */
    // Next.js API route: /api/youtube/search?q=...
    const API = "/api/youtube/search?q=";

    // State
    let playlist = [];
    let currentIndex = -1;
    let repeatMode = 0; // 0:off, 1:all, 2:one
    let playMode = "single";
    let singleTrack = null;
    let isPlayingState = false;

    // Helper Elements
    const el = (id) => document.getElementById(id);

    // Toast
    function toast(message, type="info"){
      const wrap = el("toastWrap");
      const box = document.createElement("div");

      let colors = "bg-slate-800/90 border-slate-600/50 text-white";
      let icon = "fa-info-circle";

      if(type==="success") { colors = "bg-emerald-900/90 border-emerald-500/30 text-emerald-100"; icon = "fa-check-circle text-emerald-400"; }
      if(type==="error")   { colors = "bg-rose-900/90 border-rose-500/30 text-rose-100"; icon = "fa-exclamation-circle text-rose-400"; }

      box.className = `toast-anim pointer-events-auto backdrop-blur-md border px-5 py-3 rounded-full shadow-2xl flex items-center gap-3 ${colors}`;
      box.innerHTML = `<i class="fas ${icon}"></i> <span class="text-sm font-medium">${message}</span>`;

      wrap.appendChild(box);
      setTimeout(()=> { box.style.opacity="0"; box.style.transform="translateY(-10px)"; }, 2500);
      setTimeout(()=> box.remove(), 2900);
    }

    function formatTime(seconds){
      const s = Math.max(0, Math.floor(Number(seconds) || 0));
      const m = Math.floor(s/60);
      const r = s%60;
      return `${m}:${String(r).padStart(2,"0")}`;
    }

    /* ===========================
       STORAGE
       =========================== */
    const PLAYLIST_KEY = "ray_playlist_v3";
    const INDEX_KEY    = "ray_index_v3";
    const REPEAT_KEY   = "ray_repeat_v3";

    function persist(){
      localStorage.setItem(PLAYLIST_KEY, JSON.stringify(playlist));
      localStorage.setItem(INDEX_KEY, String(currentIndex));
      localStorage.setItem(REPEAT_KEY, String(repeatMode));
    }

    function loadPersist(){
      try{ playlist = JSON.parse(localStorage.getItem(PLAYLIST_KEY) || "[]") || []; } catch{ playlist = []; }
      currentIndex = Number(localStorage.getItem(INDEX_KEY) || "-1");
      repeatMode = Number(localStorage.getItem(REPEAT_KEY) || "0");
      if(![0,1,2].includes(repeatMode)) repeatMode=0;

      updateRepeatUI(false);
      renderPlaylist();
    }

    /* ===========================
       YOUTUBE IFRAME PLAYER (audio-only feel)
       =========================== */
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    document.head.appendChild(tag);

    let ytPlayer = null;
    let ytReady = false;
    let currentVideoId = null;

    window.onYouTubeIframeAPIReady = () => {
      ytPlayer = new YT.Player('ytPlayer', {
        height: '0',
        width: '0',
        videoId: '',
        playerVars: {
          autoplay: 0,
          controls: 0,
          disablekb: 1,
          fs: 0,
          modestbranding: 1,
          rel: 0,
        },
        events: {
          onReady: () => { ytReady = true; },
          onStateChange: (e) => {
            // -1 unstarted, 0 ended, 1 playing, 2 paused, 3 buffering, 5 cued
            if(e.data === 1) setPlayingState(true);
            if(e.data === 2) setPlayingState(false);
            if(e.data === 3) el("statusText").innerText = "Buffering...";
            if(e.data === 0) handleEnded();
          }
        }
      });
    };

    function ytLoadAndPlay(videoId) {
      if(!ytReady) { toast("Player belum siap...", "info"); return; }
      currentVideoId = videoId;
      ytPlayer.loadVideoById(videoId, 0);
      ytPlayer.playVideo();
      // volume from slider
      ytPlayer.setVolume(Math.round(Number(el("volBar").value) * 100));
    }

    function ytToggle() {
      if(!ytReady || !currentVideoId) return;
      const st = ytPlayer.getPlayerState();
      if(st === 1) ytPlayer.pauseVideo();
      else ytPlayer.playVideo();
    }

    function ytStop() {
      if(!ytReady) return;
      ytPlayer.stopVideo();
      setPlayingState(false);
    }

    function ytSeekTo(seconds) {
      if(!ytReady) return;
      ytPlayer.seekTo(seconds, true);
    }

    function ytGetCurrentTime() {
      if(!ytReady) return 0;
      return ytPlayer.getCurrentTime() || 0;
    }

    function ytGetDuration() {
      if(!ytReady) return 0;
      return ytPlayer.getDuration() || 0;
    }

    /* ===========================
       SEARCH (calls Vercel backend)
       =========================== */
    let currentMusicData = null;

    async function searchMusic(){
      const query = el("searchInput").value.trim();
      if(!query) return toast("Masukkan kata kunci lagu.", "error");

      const btn = el("searchBtn");
      const txt = el("searchBtnText");
      btn.disabled = true;
      txt.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

      try{
        const res = await fetch(API + encodeURIComponent(query));
        const json = await res.json();

        const first = json?.success ? (json.data?.[0] || null) : null;

        if(first){
          currentMusicData = first;

          const track = normalizeFromResult();
          el("thumb").src = track.thumbnail;
          el("title").innerText = track.title;
          el("duration").innerText = `${formatTime(track.duration)}`;

          el("resultContainer").classList.remove("hidden");
          toast(`Ditemukan: ${track.title.substring(0,22)}...`, "success");
        } else {
          currentMusicData = null;
          el("resultContainer").classList.add("hidden");
          toast("Lagu tidak ditemukan.", "error");
        }
      }catch(err){
        console.error(err);
        toast("Gagal menghubungi server.", "error");
      }finally{
        btn.disabled = false;
        txt.innerText = "Cari";
      }
    }

    function normalizeFromResult(){
      if(!currentMusicData) return null;
      return {
        title: currentMusicData.title || "Unknown Title",
        thumbnail: currentMusicData.thumbnail || "https://via.placeholder.com/150",
        duration: Number(currentMusicData.durationSec) || 0,
        videoId: currentMusicData.videoId
      };
    }

    /* ===========================
       PLAYLIST
       =========================== */
    function updateMetaUI(){
      const count = playlist.length;
      el("playlistMeta").innerText = `${count} Lagu • ${playMode === "playlist" ? "Mode Playlist" : "Mode Single"}`;
      el("playlistEmpty").classList.toggle("hidden", count !== 0);
    }

    function addToPlaylistFromResult(){
      const track = normalizeFromResult();
      if(!track?.videoId) return toast("Cari lagu dulu.", "error");

      const exists = playlist.some(t => t.videoId === track.videoId);
      if(exists) return toast("Lagu sudah ada di playlist.", "info");

      playlist.push(track);
      if(currentIndex === -1) currentIndex = 0;
      persist();
      renderPlaylist();
      toast("Ditambahkan ke Playlist", "success");
    }

    function removeFromPlaylist(i){
      if(i<0 || i>=playlist.length) return;
      const removingCurrent = (playMode==="playlist" && i===currentIndex);

      playlist.splice(i, 1);

      if(playlist.length===0){
        currentIndex=-1;
        persist();
        renderPlaylist();
        if(removingCurrent) { stopMusic(true); playMode="single"; updatePlayerBadges(); }
        return;
      }

      if(i<currentIndex) currentIndex--;
      if(currentIndex>=playlist.length) currentIndex = playlist.length-1;

      persist();
      renderPlaylist();
      if(removingCurrent) playPlaylistIndex(currentIndex);
      else toast("Lagu dihapus", "info");
    }

    function clearPlaylist(){
      if(!playlist.length) return;
      if(!confirm("Hapus semua playlist?")) return;
      playlist=[];
      currentIndex=-1;
      persist();
      renderPlaylist();
      if(playMode==="playlist") stopMusic();
      toast("Playlist bersih.", "success");
    }

    function shufflePlaylist(){
      if(playlist.length < 2) return toast("Butuh minimal 2 lagu.", "info");
      const currentTrack = (playMode === "playlist" && currentIndex >= 0) ? playlist[currentIndex] : null;

      for (let i = playlist.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [playlist[i], playlist[j]] = [playlist[j], playlist[i]];
      }

      if (currentTrack) {
        currentIndex = playlist.findIndex(t => t.videoId === currentTrack.videoId);
      }
      persist();
      renderPlaylist();
      toast("Playlist diacak 🔀", "success");
    }

    function renderPlaylist(){
      const list = el("playlistList");
      list.innerHTML = "";

      playlist.forEach((t,i)=>{
        const active = (playMode==="playlist" && i===currentIndex);

        const div = document.createElement("div");
        div.className = `group flex items-center gap-3 p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
          active
            ? "bg-sky-500/20 border-sky-500/30 shadow-[0_0_15px_rgba(14,165,233,0.15)]"
            : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
        }`;

        div.onclick = ()=> playPlaylistIndex(i);
        div.innerHTML = `
          <div class="relative shrink-0">
            <img src="${t.thumbnail}" class="w-10 h-10 rounded-lg object-cover ${active ? 'animate-pulse' : ''}">
            ${active ? '<div class="absolute inset-0 flex items-center justify-center bg-black/30 rounded-lg"><i class="fas fa-volume-up text-sky-400 text-xs"></i></div>' : ''}
          </div>
          <div class="min-w-0 flex-1">
            <p class="font-bold text-sm truncate ${active ? 'text-sky-300' : 'text-gray-200'}">${t.title}</p>
            <p class="text-xs text-gray-500 font-mono">${formatTime(t.duration)}</p>
          </div>
          <button class="w-8 h-8 rounded-full flex items-center justify-center text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100 z-10" onclick="event.stopPropagation(); removeFromPlaylist(${i});">
            <i class="fas fa-times"></i>
          </button>
        `;
        list.appendChild(div);
      });

      updateMetaUI();
    }

    /* ===========================
       PLAYER CONTROL
       =========================== */
    const seekBar = el("seekBar");
    const volBar = el("volBar");
    const pBarFill = el("progressBarFill");

    function cycleRepeat(){
      repeatMode = (repeatMode + 1) % 3;
      updateRepeatUI(true);
      persist();
    }

    function updateRepeatUI(notify){
      const texts = ["Loop: Off", "Loop: All", "Loop: One"];
      el("repeatModeText").innerText = texts[repeatMode];

      const btnIcon = document.querySelector("button[onclick='cycleRepeat()'] i");
      if(repeatMode === 2) btnIcon.className = "fas fa-1";
      else btnIcon.className = "fas fa-repeat";

      if(notify) toast(texts[repeatMode], "info");
    }

    function showPlayer(){
      el("playerControl").classList.remove("translate-y-[150%]");
    }

    function updatePlayerBadges(){
      el("modeBadge").innerText = playMode==="playlist" ? "PLAYLIST" : "SINGLE";
      el("nowIndexMini").innerText = (playMode==="playlist" && currentIndex>=0)
        ? `${currentIndex+1}/${playlist.length}` : "";
    }

    function setBottomUI(track){
      el("miniThumb").src = track.thumbnail;
      el("miniTitle").innerText = track.title;
      el("totTime").innerText = formatTime(track.duration);
      updatePlayerBadges();

      el("miniThumb").classList.remove("spin-slow");
      el("playingIndicator").classList.add("hidden");
    }

    function setPlayingState(playing){
      isPlayingState = playing;
      const btn = el("toggleBtn");
      const thumb = el("miniThumb");
      const indicator = el("playingIndicator");
      const status = el("statusText");

      if(playing){
        btn.innerHTML = '<i class="fas fa-pause text-xl"></i>';
        thumb.classList.add("spin-slow");
        indicator.classList.remove("hidden");
        status.innerText = "Playing";
        status.className = "text-xs text-sky-400 animate-pulse";
      }else{
        btn.innerHTML = '<i class="fas fa-play ml-1 text-xl"></i>';
        thumb.classList.remove("spin-slow");
        indicator.classList.add("hidden");
        status.innerText = "Paused";
        status.className = "text-xs text-gray-500";
      }
    }

    function playResultSingle(){
      const track = normalizeFromResult();
      if(!track?.videoId) return toast("Tidak ada lagu.", "error");

      playMode = "single";
      singleTrack = track;
      currentIndex = -1;
      renderPlaylist();

      startTrack(track);
    }

    function playPlaylistIndex(i){
      if(i<0 || i>=playlist.length) return;
      playMode = "playlist";
      currentIndex = i;
      persist();
      renderPlaylist();
      startTrack(playlist[i]);
    }

    function startTrack(track){
      showPlayer();
      setBottomUI(track);

      // play via YouTube (audio-only feel)
      ytLoadAndPlay(track.videoId);

      // set displayed duration from metadata (YT will also provide duration)
      el("totTime").innerText = formatTime(track.duration || ytGetDuration());
    }

    function togglePlay(){
      ytToggle();
    }

    function stopMusic(silent=false){
      ytStop();
      el("statusText").innerText = "Stopped";
      el("statusText").className = "text-xs text-gray-500";
      if(!silent) toast("Musik berhenti.", "info");
    }

    function handleEnded(){
      if(playMode === "single"){
        if(repeatMode === 2) { ytSeekTo(0); ytPlayer.playVideo(); }
        else setPlayingState(false);
        return;
      }
      if(repeatMode === 2) { ytSeekTo(0); ytPlayer.playVideo(); return; }
      nextTrack();
    }

    function nextTrack(){
      if(playMode !== "playlist" || playlist.length === 0) return toast("Mode Single aktif.", "info");

      if(currentIndex < playlist.length - 1){
        playPlaylistIndex(currentIndex + 1);
      } else {
        if(repeatMode === 1) playPlaylistIndex(0);
        else { stopMusic(); toast("Playlist selesai.", "info"); }
      }
    }

    function prevTrack(){
      if(playMode !== "playlist" || playlist.length === 0) return;

      // if already playing and >3s, restart
      const cur = ytGetCurrentTime();
      if(cur > 3) { ytSeekTo(0); return; }

      if(currentIndex > 0) playPlaylistIndex(currentIndex - 1);
      else playPlaylistIndex(playlist.length - 1);
    }

    /* ===========================
       SEEK + VOLUME + PROGRESS LOOP
       =========================== */
    // Progress update loop (replace audio timeupdate)
    setInterval(() => {
      const dur = ytGetDuration();
      const cur = ytGetCurrentTime();

      el("curTime").innerText = formatTime(cur);

      if(dur > 0) {
        const pct = (cur / dur) * 100;
        seekBar.value = pct;
        pBarFill.style.width = pct + "%";
        el("totTime").innerText = formatTime(dur);
      }
    }, 250);

    seekBar.addEventListener("input", () => {
      const dur = ytGetDuration();
      const val = Number(seekBar.value || 0);
      pBarFill.style.width = val + "%";
      if(dur > 0) ytSeekTo((val / 100) * dur);
    });

    volBar.addEventListener("input", () => {
      if(!ytReady) return;
      ytPlayer.setVolume(Math.round(Number(volBar.value) * 100));
    });

    el("searchInput").addEventListener("keypress", (e)=>{ if(e.key==="Enter") searchMusic(); });

    // Init
    loadPersist();
  </script>
</body>
</html>
