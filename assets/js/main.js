const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const PLAYER_STORAGE_KEY ='Linh_PLAYER'

const player = $('.player')
const heading = $('header h2')
const cdThumb = $('.cd-thumb')
const audio = $('#audio')
const cd = $('.cd')
const playBtn =$('.btn-toggle-play')
const progress = $('#progress')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn =  $('.btn-random')
const repeatBtn = $('.btn-repeat')
const playlist = $('.playlist')


const app ={
    isPlaying: false,
    isRandom: false,
    isRepeact: false,
    currentIndex: 0,
    config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
    setConfig: function(key, value){
        this.config[key] = value
        localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config))
    },
    songs: [
        {
            name: 'SummerTime',
            singer: 'K-391',
            path: './assets/music/K-391-Summertime-Sunshine-K391.mp3',
            image:'./assets/img/SummerTime.jpg'
        },
        {
            name: 'Reality',
            singer: 'Feat',
            path: './assets/music/Reality-Feat-Janieck-Devy-Lost-Frequencies.mp3',
            image:'./assets/img/Reality.jpg'
        },
        {
            name: 'Monody',
            singer: 'THeFatRat',
            path: './assets/music/Monody-TheFatRat-feat-Laura-Brehm.mp3',
            image:'./assets/img/Monody.jpg'
        },
        {
            name: 'Đế Vương',
            singer: 'Nhật Linh',
            path: './assets/music/DeVuong-DinhDungACV-7121634.mp3',
            image:'./assets/img/devuong.jpg'
        },
        {
            name: 'Cưới Thôi',
            singer: 'Bray - Masew',
            path: './assets/music/CuoiThoi-MasewMasiuBRayTAPVietNam-7085648.mp3',
            image:'./assets/img/cuoithoi.jpg'
        },
        {
            name: 'Ái Nộ',
            singer: 'Khởi Vũ',
            path: './assets/music/AiNo1-MasewKhoiVu-7078913.mp3',
            image:'./assets/img/aino.jpg'
        },
        {
            name: 'Nàng Thơ',
            singer: 'Hoàng Dũng',
            path: './assets/music/NangTho-HoangDung-6413381.mp3',
            image:'./assets/img/nangtho.jpg'
        },
        {
            name: 'Chân Ái',
            singer: 'Orange',
            path: './assets/music/ChanAi-OrangeKhoi-6225088.mp3',
            image:'./assets/img/chanai.jpg'
        },
    ],

    render: function(){
        const html = this.songs.map((song, index) => {
            return `
                <div class="song ${index === this.currentIndex ? 'active' :''}" data-index='${index}'>
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
        playlist.innerHTML = html.join('')
    },
    defineProperties: function(){
        Object.defineProperty(this,'currentSong',{
            get: function(){
                return this.songs[this.currentIndex]
            }
        })
    },

    handleEvents:function(){
        const _this  = this
        const cdWidth = cd.offsetWidth

        // xử lý CD quay  / dừng
        const cdThumbAnimate = cdThumb.animate([
            {transform: 'rotate(360deg)'},
        ],{
            duration: 10000, // 10s
            iterations: Infinity,
        })
        cdThumbAnimate.pause(),

        // xữ lý phóng to ~ thu nhỏ cd
        document.onscroll = function(){
        const scrollTop = window.scrollY || document.documentElement.scrollTop
           const newCdWidth = cdWidth - scrollTop

           cd.style.width = newCdWidth > 0 ? newCdWidth + 'px': 0
           cd.style.opacity = newCdWidth / cdWidth
        }

        // xữ lý khi click play
        playBtn.onclick = function(){
            if(_this.isPlaying){
                audio.pause()

            }else{
                audio.play()
            }
        }
        // khi song được play
        audio.onplay = function(){
            _this.isPlaying = true
            player.classList.add('playing')
            cdThumbAnimate.play()
        }

        // khi song bi pause
        audio.onpause = function(){
            _this.isPlaying = false
            player.classList.remove('playing')
            cdThumbAnimate.pause()
        }

        // thanh time thay thay đổi
        audio.ontimeupdate = function(){
            if(audio.duration){
                const percent = Math.floor((audio.currentTime / audio.duration) * 100)
                progress.value = percent 
            }
        }
        // xữ lý khi tua song
        progress.onchange = function(e){
            // cach 1
            const seakTime = audio.duration / 100 * e.target.value
            audio.currentTime = seakTime

            //cach 2
            // const percent = this.value
            // audio.currentTime = (percent * audio.duration) / 100
        }

        // xữ lý click vào next song
        nextBtn.onclick = function () {
            if (_this.isRandom) {
              _this.randomSong();
            } else {
              _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
          };

          prevBtn.onclick = function () {
            if (_this.isRandom) {
              _this.randomSong();
            } else {
              _this.nextSong();
            }
            audio.play();
            _this.render();
            _this.scrollToActiveSong();
          };
        
        // xữ lý tắt bặt random
        randomBtn.onclick = function(){
            _this.isRandom = !_this.isRandom
            _this.setConfig('isRandom', _this.isRandom)
            randomBtn.classList.toggle('active',_this.isRandom)
        }

        // xữ lý lặp lại 1 bài hát
        repeatBtn.onclick = function(e){
            _this.isRepeact = !_this.isRepeact
            _this.setConfig('isRepeact', _this.isRepeact)
            repeatBtn.classList.toggle('active',_this.isRepeact)
        }

        // xử lý next song khi audio ended
        audio.onended = function(){
            if(_this.isRepeact){
                audio.play();
            }else{
                nextBtn.click()
            }
        }

        // lắng nghe click vào playlist
        playlist.onclick = function(e){
            const songNode = e.target.closest('.song:not(.active)')

            if(songNode || !e.target.closest('option')) {
                // xử lý sự kiện click vào song
                if(songNode){
                    _this.currentIndex = Number(songNode.dataset.index)
                    _this.loadCurrentSong()
                    _this.render()
                    audio.play()
                }
            }
        }
    },

    scrollToActiveSong: function(){
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: 'smooth',
                block:'nearest'
            })
        },300)
    },

    loadConfig: function(){
        this.isRandom = this.config.isRandom
        this.isRepeact = this.config.isRepeact
    },

    loadCurrentSong: function(){
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path
    },

    nextSong: function(){
        this.currentIndex++
        if(this.currentIndex >= this.songs.length){
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },

    prevSong: function(){
        this.currentIndex--
        if(this.currentIndex < 0){
            this.currentSOng = this.songs.length - 1
        }
        this.loadCurrentSong()
    },

    randomSong: function(){
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length);
        } 
        while(newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },

    start: function(){
        //gán các cấu hình config vào app

        //load config
        this.loadConfig()

        // định nghĩa các thuộc tính cho obj
        this.defineProperties()

        // lắng nghe và xử lý các sự kiện
        this.handleEvents()

        // Tải bài hát đầu tiên khi tải Ul vào ứng dụng
        this.loadCurrentSong()

        // render lại danh sách bài hát
        this.render()

        // hiển thị trạng thái ban đầu của button repeat and random
        randomBtn.classList.toggle('active',this.isRandom)
        repeatBtn.classList.toggle('active',this.isRepeact)
    },
}

app.start()

