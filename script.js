document.addEventListener("DOMContentLoaded", function onReady() {
    // Mobile nav toggle
    var toggle = document.querySelector('.nav-toggle');
    var menu = document.getElementById('navMenu');
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            var open = menu.classList.toggle('open');
            toggle.setAttribute('aria-expanded', String(open));
        });
    }

    // Smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            var targetId = anchor.getAttribute('href');
            if (targetId.length > 1) {
                var target = document.querySelector(targetId);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    if (menu && menu.classList.contains('open')) { menu.classList.remove('open'); toggle.setAttribute('aria-expanded', 'false'); }
                }
            }
        });
    });

    // Active nav on scroll
    var sections = ['#home', '#trailer', '#features', '#gallery', '#tech', '#about', '#contact']
        .map(function(sel){ return document.querySelector(sel); })
        .filter(Boolean);
    var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-menu a'));
    function setActiveNav() {
        var scrollPos = window.scrollY + 120;
        var current = sections[0];
        sections.forEach(function(sec){ if (sec.offsetTop <= scrollPos) current = sec; });
        var id = current ? '#' + current.id : '#home';
        navLinks.forEach(function(link){ link.classList.toggle('active', link.getAttribute('href') === id); });
    }
    window.addEventListener('scroll', setActiveNav, { passive: true });
    setActiveNav();

    // Back to top button
    var backToTop = document.getElementById('backToTop');
    function toggleBackToTop() {
        if (!backToTop) return;
        backToTop.classList.toggle('show', window.scrollY > 500);
    }
    if (backToTop) {
        backToTop.addEventListener('click', function(){ window.scrollTo({ top: 0, behavior: 'smooth' }); });
        window.addEventListener('scroll', toggleBackToTop, { passive: true });
        toggleBackToTop();
    }

    // Gallery modal
    var modal = document.getElementById('imgModal');
    var modalImg = modal ? modal.querySelector('.modal-img') : null;
    var modalClose = modal ? modal.querySelector('.modal-close') : null;
    if (modal && modalImg && modalClose) {
        document.querySelectorAll('.gallery-item').forEach(function(item){
            item.addEventListener('click', function(e){
                e.preventDefault();
                var src = item.getAttribute('data-img') || (item.querySelector('img') ? item.querySelector('img').src : '');
                modalImg.src = src;
                modal.classList.add('open');
                modal.setAttribute('aria-hidden', 'false');
            });
        });
        modalClose.addEventListener('click', function(){ modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); modalImg.src=''; });
        modal.addEventListener('click', function(e){ if (e.target === modal) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); modalImg.src=''; } });
        document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && modal.classList.contains('open')) { modal.classList.remove('open'); modal.setAttribute('aria-hidden', 'true'); modalImg.src=''; } });
    }

    // Starfield canvas animation
    var canvas = document.getElementById('starfield');
    if (canvas) {
        var ctx = canvas.getContext('2d');
        var stars = [];
        var starCount = 180;
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        window.addEventListener('resize', resize);
        resize();
        function initStars() {
            stars = new Array(starCount).fill(0).map(function(){
                return {
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    z: Math.random() * 0.6 + 0.4,
                    r: Math.random() * 1.2 + 0.2,
                    tw: Math.random() * Math.PI * 2
                };
            });
        }
        initStars();
        function draw() {
            ctx.clearRect(0,0,canvas.width,canvas.height);
            for (var i=0;i<stars.length;i++) {
                var s = stars[i];
                s.tw += 0.02;
                var alpha = 0.4 + Math.sin(s.tw) * 0.25;
                var color = Math.random() < 0.5 ? 'rgba(123,255,234,'+alpha+')' : 'rgba(157,123,255,'+alpha+')';
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r * s.z, 0, Math.PI*2);
                ctx.fillStyle = color;
                ctx.fill();
            }
            requestAnimationFrame(draw);
        }
        draw();
    }

    // Parallax effect for elements marked with data-parallax
    var parallaxEls = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
    if (parallaxEls.length) {
        window.addEventListener('scroll', function(){
            var y = window.scrollY;
            parallaxEls.forEach(function(el){ el.style.transform = 'translateY(' + (y * -0.05) + 'px)'; });
        }, { passive: true });
    }

    // Reveal on scroll
    var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
    if ('IntersectionObserver' in window && revealEls.length) {
        var io = new IntersectionObserver(function(entries){
            entries.forEach(function(entry){
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });
        revealEls.forEach(function(el){ io.observe(el); });
    } else {
        // Fallback
        revealEls.forEach(function(el){ el.classList.add('revealed'); });
    }
});


