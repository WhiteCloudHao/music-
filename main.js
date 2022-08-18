/*  asignment 

1. Render songs
2. Scroll tops
3. Play/ pause / seek /
4. CD rotate
5. Next / Previous
6. Random
7. Next / repeat when end
8. Active songs
9. Scroll Active songs interview
10. Play songs when click

*/
// các bug
/*
1. khi tua chậm thì sẽ ko tua đk
2. danh sách lặp lại phải hạn chế  các bài đã từng phát trong 1 vòng
3. bật đk cả 2 nút random và repeat(lại còn chỉ repeat hoạt động)
4. Khi F5 trinh duyệt bài hát sẽ trở lại 0s bài đang phát
5. scrollIntoView bị che mất mấy bài đầu do núp sau cd
6. Thêm chức năng điều chỉnh âm lượng, lưu vị trí âm lượng người dùng đã chọn. 
Mặc định 100%

*/
//  lấy ra tất cả các biến

$ = document.querySelector.bind(document);
$$ = document.querySelectorAll.bind(document);
const cd = $('.cd');
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const player = $('.player');
const playing = $('.btn-toggle-play');
const progress = $('#progress');
const nextbtn = $('.btn-next');
const prevbtn = $('.btn-prev');
const randombtn = $('.btn-random');
const repeatbtn = $('.btn-repeat');
const playlist = $('.playlist');
const PLAYER_STORAGE_KEY = 'MOONLAUGH';


  // Lấy ra các phần tử riêng lẻ




const app = {
currentIndex: 0,
isPlaying: false,
isRandom: false,
isRepeat: false,
config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
isTimeupdate: true,
  // playlist
songs: [
 
  {
    name: "Click Pow Get Down",
    singer: "Raftaar x Fortnite",
    path: "./playlist/song1.mp3",
    image: "./image/image1.jpg"
  },
  {
    name: "Tu Phir Se Aana",
    singer: "Raftaar x Salim Merchant x Karma",
    path: "./playlist/song2.mp3",
    image:
      "./image/image2.jpg"
  },
  {
    name: "Naachne Ka Shaunq",
    singer: "Raftaar x Brobha V",
    path:"./playlist/song3.mp3",
    image: "./image/image3.jpg"
  },
  {
    name: "Mantoiyat",
    singer: "Raftaar x Nawazuddin Siddiqui",
    path: "./playlist/song4.mp3",
    image:
      "./image/image4.jpg"
  },
  {
    name: "Aage Chal",
    singer: "Raftaar",
    path: "./playlist/song5.mp3",
    image:
      "./image/image5.jpg"
  },
  {
    name: "Damn",
    singer: "Raftaar x kr$na",
    path:"./playlist/song6.mp3",
    image:
      "./image/image6.jpg"
  }


],

// setconfig
setConfig : function(key, value) {
  this.config[key] =value;
  localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
},
defineProperties: function() { Object.defineProperty(this, "currentSong", {
  get: function() {
    return this.songs[this.currentIndex];
  }
}
); }
,

// loadconfig

loadConfig: function() {
  this.isRandom = this.config.isRandom;
  this.isRepeat = this.config.isRepeat;

},

// định nghĩa các function 
render: function() {
  const htmls = this.songs.map((song, index) => {
    return `
    
          <div class="song ${index === this.currentIndex ?'active': ''}" data-index = "${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
          
          `

  })
   
playlist.innerHTML = htmls.join("");
},

handleEvents: function() {
  const _this = this;
  const cdWidth = cd.offsetWidth;
  // khi cuộn sẽ phóng to thu nhỏ ảnh
  document.onscroll = function() {
    const scroll = window.scrollY || document.documentElement.scrollTop
    const newcdWidth = cdWidth - scroll
   cd.style.width = newcdWidth >0 ? newcdWidth + "px" : 0;
   cd.style.opacity = newcdWidth/cdWidth;

  
  }

  // quay ảnh
  const  cdThumbAnimate =  cdThumb.animate([{transform: 'rotate(360deg)'}], {
    duration: 10000,
    iterations: Infinity

    // viết đúng ko ăn hành ngay
  })

  cdThumbAnimate.pause();

  // xử lí khi click vào nút play
  playing.onclick = function() {
    if(_this.isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
  }

  // khi song play
  audio.onplay = function() {
    player.classList.add('playing');
    _this.isPlaying =true;
    cdThumbAnimate.play();
  }

// khi song pause
  audio.onpause = function() {
    player.classList.remove('playing');
    _this.isPlaying =false;
    cdThumbAnimate.pause();
  }

  // khi tiến độ bài hát changing
audio.ontimeupdate = function () {
  if(audio.duration && _this.isTimeupdate) {
    progress.value = progressPercent = Math.floor(audio.currentTime / audio.duration*100);
  } 

}

progress.onmousedown = function () {
  _this.isTimeupdate =false;
}
// khi  tua song
  progress.onchange = function(e) {
    
      audio.currentTime= seekTime = e.target.value*audio.duration/100;
      _this.isTimeupdate =true;
  }

  //  khi bấm next
  nextbtn.onclick = function () {
    if(_this.isRandom) {
      _this.RandomSong();

      
    } else {
      _this.nextSong();
      
    }
    audio.play();
    _this.render();
    _this.scrollIntoView();
   
   
  } 

  // khi bấm prev
  prevbtn.onclick = function () {
    if(_this.isRandom) {
      _this.RandomSong()
    } else {
      _this.prevSong();
    }
    audio.play();
    _this.render();
    _this.scrollIntoView();

  } 


  // phát random
  randombtn.onclick = function (e) {
    _this.isRandom = !_this.isRandom;
    _this.setConfig('isRandom', _this.isRandom);
    randombtn.classList.toggle('active', _this.isRandom);
    
  }

  // repeat song
  repeatbtn.onclick = function () {
    _this.isRepeat = !_this.isRepeat;
    _this.setConfig('isRepeat', _this.isRepeat);
    repeatbtn.classList.toggle('active', _this.isRepeat);
  }

  audio.onended = function () {
    if(_this.isRepeat) {
      audio.play();
    } else {nextbtn.click()}
    
  }

  // click playlist 
  playlist.onclick = function(e) {
    const elementNode = e.target.closest('.song:not(.active)');
    if(elementNode || e.target.closest('.option')) {
    //  để click chuyển bài hát
     
    if(elementNode) {
      _this.currentIndex = Number(elementNode.dataset.index);
      _this.loadCurrentSong();
      _this.render();
      audio.play();
    }
      
      

    // click vào option 
    if( e.target.closest('.option')) {
      
    }
    }
  }

},

loadCurrentSong: function() {
 heading.innerText = this.currentSong.name;
 cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
 audio.src = this.currentSong.path;

},

// next song
nextSong: function() { 
  if(this.currentIndex >= this.songs.length -1) {
    this.currentIndex = 0;

  } else {
    this.currentIndex++;
  }
  this.loadCurrentSong() ;
},

// khi prev song
prevSong: function() { 
  if(this.currentIndex === 0) {
    this.currentIndex = this.songs.length -1;

  } else {
    this.currentIndex--;
  }
  this.loadCurrentSong() ;

  

},

RandomSong: function() {
  let randomIndex;
  do( randomIndex = Math.floor(Math.random() * this.songs.length))
  while( randomIndex === this.currentIndex);
  this.currentIndex = randomIndex;
  this.loadCurrentSong();
 
},

// scrollIntoView
scrollIntoView: function() {
  setTimeout(function(){
    $('.song.active').scrollIntoView({behavior: "smooth", block:"end"})
  }, 300)
},

// hàm start: gọi 1 lần dùng mãi mãi
start: function() {
  this.loadConfig();

  //  định nghĩa
  this.defineProperties();


  // render
  this.render();

  // xử lí
  this.handleEvents();
  this.loadCurrentSong();

  randombtn.classList.toggle('active', this.isRandom);
  repeatbtn.classList.toggle('active', this.isRepeat);
 }
}

app.start();