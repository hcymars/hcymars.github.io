/*
 * @Author: c
 * @Date: 2025-03-06 02:47:24
 * @Descripttion: 
 * @version: 
 * @LastEditors: c
 * @LastEditTime: 2025-03-06 03:09:06
 */
// 导航切换
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 移除所有active状态
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
        
        // 获取目标页面
        const pageId = this.getAttribute('href').substring(1);
        loadPage(pageId);
    });
});

// 页面加载函数
function loadPage(pageId) {
    const container = document.getElementById('content-container');
    
    switch(pageId) {
        case 'home':
            container.innerHTML = document.querySelector('.home-content').outerHTML;
            break;
        case 'history':
            fetch('history.html')
                .then(res => res.text())
                .then(html => {
                    container.innerHTML = html;
                    setupYearSelector();
                });
            break;
        // 其他页面加载逻辑类似...
        case 'contact':
            fetch('contact.html')
                .then(res => res.text())
                .then(html => {
                    container.innerHTML = html;
                    setupContactForm();
                });
            break;
    }
}

// 表单提交
function setupContactForm() {
    document.getElementById('contactForm').addEventListener('submit', function(e) {
        e.preventDefault();
        
        // 这里需要替换为你的实际处理接口
        fetch('https://your-form-endpoint.com', {
            method: 'POST',
            body: new FormData(this)
        })
        .then(res => alert('提交成功！'))
        .catch(err => alert('提交失败，请重试'));
    });
}

// 新增背景切换功能 ⭐
const bgImages = [
    'url(images/bg1.png)',
    'url(images/bg1.png)',
    'url(images/bg1.png)'
];
let currentBg = 0;

function changeBackground() {
    const bg = document.querySelector('.bg-container');
    bg.style.backgroundImage = bgImages[currentBg];
    currentBg = (currentBg + 1) % bgImages.length;
}

// 新增轮播图功能 ⭐
let currentSlide = 0;
function rotateCarousel() {
    const slides = document.querySelectorAll('.carousel-img');
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
}

// 初始化函数（在页面加载时调用）
function init() {
    // 启动背景切换（每8秒换一次）
    changeBackground();
    setInterval(changeBackground, 8000);
    
    // 启动轮播图（每5秒切换）
    if(document.querySelector('.carousel')) {
        setInterval(rotateCarousel, 5000);
    }
}

// 页面加载完成后运行初始化
window.onload = init;

// 二级菜单数据示例 ⭐（新建data/2024.json）
/*
{
  "concerts": [
    {
      "id": 1,
      "title": "2024火星演唱会·第一场",
      "date": "2024年3月15日",
      "location": "上海体育场",
      "content": "本次演唱会采用全新舞台设计...",
      "image": "images/2024-1.jpg",
      "video": "videos/2024-1.mp4"
    },
    {
      "id": 2,
      "title": "2024火星演唱会·收官之战",
      "date": "2024年12月24日",
      "location": "北京鸟巢",
      "content": "圣诞特别场次..."
    }
  ]
}
*/

// 修改后的年份选择逻辑 ⭐
function setupYearSelector() {
    const yearSelect = document.getElementById('yearSelect');
    const concertSelect = document.getElementById('concertSelect');
    
    yearSelect.addEventListener('change', function() {
        const year = this.value;
        concertSelect.style.display = 'block';
        
        // 清空二级菜单
        concertSelect.innerHTML = '<option value="">请选择场次</option>';
        
        if(year) {
            fetch(`data/${year}.json`)
                .then(res => res.json())
                .then(data => {
                    data.concerts.forEach(concert => {
                        const option = document.createElement('option');
                        option.value = concert.id;
                        option.textContent = concert.title;
                        concertSelect.appendChild(option);
                    });
                });
        }
    });
    
    // 新增场次选择监听 ⭐
    concertSelect.addEventListener('change', function() {
        const concertId = this.value;
        if(!concertId) return;
        
        fetch(`data/${yearSelect.value}.json`)
            .then(res => res.json())
            .then(data => {
                const concert = data.concerts.find(c => c.id == concertId);
                showConcertDetails(concert);
            });
    });
}

// 显示详情函数 ⭐
function showConcertDetails(concert) {
    const container = document.getElementById('concertDetails');
    
    let mediaHTML = '';
    if(concert.image) {
        mediaHTML += `<img src="${concert.image}" class="news-image">`;
    }
    if(concert.video) {
        mediaHTML += `
        <video controls class="news-video">
            <source src="${concert.video}" type="video/mp4">
            您的浏览器不支持视频播放
        </video>`;
    }
    
    container.innerHTML = `
    <div class="news-article">
        <h2 class="news-title">${concert.title}</h2>
        <p>时间：${concert.date}</p>
        <p>地点：${concert.location}</p>
        <div class="media-container">${mediaHTML}</div>
        <p>${concert.content}</p>
    </div>`;
}