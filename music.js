console.log("Welcome, User!")
let now_playing = document.querySelector(".now-playing");
let track_art = document.querySelector(".track-art");
let track_name = document.querySelector(".track-name");
let track_artist = document.querySelector(".track-artist");

let playpause_btn = document.querySelector(".playpause-track");
let next_btn = document.querySelector(".next-track");
let prev_btn = document.querySelector(".prev-track");

let seek_slider = document.querySelector(".seek_slider");
let volume_slider = document.querySelector(".volume_slider");
let curr_time = document.querySelector(".current-time");
let total_duration = document.querySelector(".total-duration");

let track_index = 0;
let isPlaying = false;
let updateTimer;

let curr_track = document.createElement('audio');

let track_list = [
  {
    name: "Night Owl",
    artist: "Broke For Free",
    image: "img1.jpeg.jpg",
    path: "aud1.mp3"
  },
  {
    name: "Enthusiast",
    artist: "Tours",
    image: "img2.jpeg.jpg",
    path: "aud2.mp3"
  },
  {
    name: "Shipping Lanes",
    artist: "Chad Crouch",
    image: "img3.jpeg.jpg",
    path: "aud3.mp3"
  },
  {
    name: "Night Detective",
    artist: "Chad Crouch",
    image: "img4.jpg",
    path: "aud4.mp3"
  },
  {
    name: "Trippy People",
    artist: "Lil Eye-N-$tine",
    image: "img5.jpg",
    path: "aud5.mp3"
  },
  {
    name: "Just Dippin",
    artist: "Snoop Dogg",
    image: "img6.jpg",
    path: "aud6.mp3"
  },
  {
    name: "Squabble Up",
    artist: "Kendrick Lamar",
    image: "img7.jpg",
    path: "aud7.mp3"
  },
  {
    name: "Switching Lanes",
    artist: "Chad Crouch",
    image: "img8.jpg",
    path: "aud8.mp3"
  },
  {
    name: "Lazy Day",
    artist: "Chad Crouch",
    image: "img9.jpg",
    path: "aud9.mp3"
  },
  {
    name: "Movement",
    artist: "Chad Crouch",
    image: "img10.jpg",
    path: "aud10.mp3"
  }
];

function random_bg_color() {
  let red = Math.floor(Math.random() * 256) + 64;
  let green = Math.floor(Math.random() * 256) + 64;
  let blue = Math.floor(Math.random() * 256) + 64;

  let bgColor = "rgb(" + red + "," + green + "," + blue + ")";

  document.body.style.background = bgColor;
}

function loadTrack(track_index) {
  clearInterval(updateTimer);
  resetValues();
  curr_track.src = track_list[track_index].path;
  curr_track.load();

  track_art.style.backgroundImage = "url(" + track_list[track_index].image + ")";
  track_name.textContent = track_list[track_index].name;
  track_artist.textContent = track_list[track_index].artist;
  now_playing.textContent = "PLAYING " + (track_index + 1) + " OF " + track_list.length;

  updateTimer = setInterval(seekUpdate, 1000);
  curr_track.addEventListener("ended", nextTrack);
  random_bg_color();

  // Update active class in queue list
  updateQueueActiveStatus();
}

function resetValues() {
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  if (!isPlaying) playTrack();
  else pauseTrack();
}

function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}

function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}

function nextTrack() {
  if (track_index < track_list.length - 1)
    track_index += 1;
  else track_index = 0;
  loadTrack(track_index);
  playTrack();
}

function prevTrack() {
  if (track_index > 0)
    track_index -= 1;
  else track_index = track_list.length - 1;
  loadTrack(track_index);
  playTrack();
}

function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}

function setVolume() {
  curr_track.volume = volume_slider.value / 100;
}

function seekUpdate() {
  let seekPosition = 0;

  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);

    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}



function loadQueue() {
  const queueElement = document.getElementById('queue');
  track_list.forEach((track, index) => {
    const li = document.createElement('li');
    li.textContent = `${track.name} - ${track.artist}`;
    li.onclick = () => loadTrack(index);
    queueElement.appendChild(li);
  });
}

function updateQueueActiveStatus() {
  const queueItems = document.querySelectorAll('#queue li');
  queueItems.forEach((item, index) => {
    if (index === track_index) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}


loadQueue();
loadTrack(track_index);

