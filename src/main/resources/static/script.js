/**
 * ZEBRION - Platform Core System Script (PRODUCTION READY - FULLY FIXED)
 */

// ==========================================================================
// 1. Global Variables & Database Fetcher
// ==========================================================================
const API_BASE_URL = "http://localhost:8080/api/articles"; 
let GLOBAL_ARTICLES = []; 

document.addEventListener("DOMContentLoaded", () => {
    loadAllArticles();
    setupHamburgerMenu(); // 🎯 यहाँ फङ्सन कल गरिएको छ

    window.onpopstate = () => {
        parseUrlAndApplyFilters();
    };
});

async function loadAllArticles() {
    try {
        const response = await fetch(API_BASE_URL);
        if (!response.ok) throw new Error("Backend connection failed!");
        const data = await response.json();
        
        // १. नचाहिने टेस्ट डाटा फिल्टर गर्ने
        let validArticles = data.filter(a => 
            a.title && 
            !a.title.toLowerCase().includes('fghgf') && 
            a.title.toLowerCase() !== 'kumar'
        );

        // २. 🎯 सधैँ सबैभन्दा नयाँ (Latest Published) आर्टिकल माथि आउने गरी मिलाउने
        // (यदि डेटाबेसमा ID वा मिति छ भने त्यसको आधारमा उल्टो क्रममा राख्ने)
        GLOBAL_ARTICLES = validArticles.reverse(); 
        
        initializeComponents();
        setupEventHandlers();
        parseUrlAndApplyFilters(); 
    } catch (error) {
        console.error("Error loading articles:", error);
    }
}
// ==========================================================================
// 2. URL Router & State Manager (History Engine)
// ==========================================================================
function parseUrlAndApplyFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    const search = urlParams.get('search');
    const category = urlParams.get('category');
    const alphabet = urlParams.get('alphabet');

    if (id) {
        viewArticle(id, false);
    } else if (search) {
        applySearchOrFilter(search, 'search', false);
    } else if (category) {
        applySearchOrFilter(category, 'category', false);
    } else if (alphabet) {
        applySearchOrFilter(alphabet, 'alphabet', false);
    } else {
        resetToHome(false);
    }
}

function showPage(pageId) {
    const homePage = document.getElementById('home-page');
    const detailPage = document.getElementById('detail-page');
    const aboutPage = document.getElementById('about-page');
    const contactPage = document.getElementById('contact-page');
    const termsPage = document.getElementById('terms-page');
    const privacyPage = document.getElementById('privacy-page');
    const disclaimerPage = document.getElementById('disclaimer-page');
    const faqPage = document.getElementById('faq-page');

    // १. सुरुमा सबै पेजहरू लुकाउने
    if (homePage) homePage.classList.add('hidden');
    if (detailPage) {
        detailPage.style.display = 'none';
        detailPage.classList.add('hidden');
    }
    if (aboutPage) aboutPage.classList.add('hidden');
    if (contactPage) contactPage.classList.add('hidden');
    if (termsPage) termsPage.classList.add('hidden');
    if (privacyPage) privacyPage.classList.add('hidden');
    if (disclaimerPage) disclaimerPage.classList.add('hidden');
    if (faqPage) faqPage.classList.add('hidden');

    document.querySelectorAll('.nav-links a').forEach(link => link.classList.remove('active'));

    // २. माग गरिएको पेज मात्र देखाउने
    if (pageId === 'home') {
        if (homePage) homePage.classList.remove('hidden');
        const homeLink = document.querySelector('.nav-links a[href="#"]');
        if (homeLink) homeLink.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pageId === 'about') {
        if (aboutPage) aboutPage.classList.remove('hidden');
        const aboutLink = document.getElementById('nav-about-btn');
        if (aboutLink) aboutLink.classList.add('active');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pageId === 'contact') {
        if (contactPage) contactPage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pageId === 'terms') {
        if (termsPage) termsPage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pageId === 'privacy') {
        if (privacyPage) privacyPage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pageId === 'disclaimer') {
        if (disclaimerPage) disclaimerPage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pageId === 'faq') {
        if (faqPage) faqPage.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else if (pageId === 'detail') {
        if (detailPage) {
            detailPage.style.display = 'block';
            detailPage.classList.remove('hidden'); // 🌟 मुख्य फिक्स: hidden क्लास हटाउने!
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}
// ==========================================================================
// 3. UI Render & Components Initialization
// ==========================================================================
// ==========================================================================
// 3. UI Render & Components Initialization (SMART FEATURED CARD WITH TRANSITION)
// ==========================================================================
let featuredInterval = null;

function initializeComponents() {
    const featuredGrid = document.getElementById('featured-article-box');
    const popularGrid = document.getElementById('popular-grid');

    const featuredList = GLOBAL_ARTICLES.filter(a => a.featured).length > 0 
        ? GLOBAL_ARTICLES.filter(a => a.featured) 
        : GLOBAL_ARTICLES.slice(0, 5);

    if (featuredList.length > 0 && featuredGrid) {
        let currentIndex = Math.floor(Math.random() * featuredList.length);

        // 🎯 १. बक्समा स्मूथ CSS Transition पहिले नै सेट गर्ने
        featuredGrid.style.transition = 'opacity 0.4s ease-in-out, transform 0.4s ease-in-out';
        featuredGrid.style.opacity = '1';
        featuredGrid.style.transform = 'translateY(0)';

        function renderFeaturedCard(item) {
            featuredGrid.style.cursor = 'pointer';
            featuredGrid.onclick = () => viewArticle(item.id, true);

            featuredGrid.innerHTML = `
                <div class="feat-img-box" style="height: 380px; overflow: hidden; border-radius: 12px;">
                    <img src="${item.image}" alt="${item.title}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="feat-text-box">
                    <span style="color: #ffffff; font-size: 0.8rem; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 15px; display: block;">
                        <i class="far fa-bookmark" style="color: #4ade80; margin-right: 5px;"></i> ${item.category || 'PERSONALITY'}
                    </span>
                    <h3 style="font-size: 32px; font-weight: 700; margin-bottom: 15px; color: #fff;">${item.title}</h3>
                    <p style="color: #cbdad2; line-height: 1.6; font-size: 15px; margin-bottom: 25px;">${item.summary || 'No summary available.'}</p>
                    <span class="read-bio-btn">Read Full Story <i class="fas fa-arrow-right" style="margin-left: 5px;"></i></span>
                </div>
            `;
        }

        // 🎯 २. स्मूथ ट्रान्जिसनसहित कार्ड फेर्ने फङ्सन (Fade Out -> Change -> Fade In)
        function changeCardWithTransition(item) {
            // पहिला बिस्तारै लुकाउने (Fade Out) र हल्का तल सार्ने
            featuredGrid.style.opacity = '0';
            featuredGrid.style.transform = 'translateY(12px)';

            // 400ms पछि नयाँ सामग्री राखेर फेरि देखाउने (Fade In)
            setTimeout(() => {
                renderFeaturedCard(item);
                featuredGrid.style.opacity = '1';
                featuredGrid.style.transform = 'translateY(0)';
            }, 400);
        }

        // पहिलो कार्ड देखाउने
        renderFeaturedCard(featuredList[currentIndex]);

        // ३. हरेक ६ सेकेन्डमा ट्रान्जिसनसहित फेरिने
        if (featuredList.length > 1) {
            if (featuredInterval) clearInterval(featuredInterval);
            featuredInterval = setInterval(() => {
                currentIndex = (currentIndex + 1) % featuredList.length;
                changeCardWithTransition(featuredList[currentIndex]);
            }, 6000);
        }
    }

    // Popular Personalities (गोलो फोटो भएको सेक्सन)
    if (popularGrid) {
        // १. views को आधारमा धेरैबाट थोरै (High to Low) क्रमबद्ध (Sort) गर्ने
        // (यदि डाटाबेसमा views छैन भने 0 मान्ने ताकि कोड नबिग्रियोस्)
        const mostViewedList = [...GLOBAL_ARTICLES]
            .sort((a, b) => (b.views || 0) - (a.views || 0))
            .slice(0, 12); // टप १२ वटा मात्र लिने

        popularGrid.innerHTML = mostViewedList.map(person => `
            <div class="personality-card" style="cursor:pointer; text-align: center;" onclick="viewArticle('${person.id}', true)">
                <div style="width: 150px; height: 150px; margin: 0 auto; overflow: hidden; border-radius: 50%; border: 3px solid transparent; transition: all 0.3s ease; box-shadow: 0 5px 15px rgba(0,0,0,0.2);" 
                     onmouseover="this.style.transform='scale(1.08)'; this.style.borderColor='#4ade80';" 
                     onmouseout="this.style.transform='scale(1)'; this.style.borderColor='transparent';">
                    <img src="${person.image}" alt="${person.title}" style="width: 100%; height: 100%; object-fit: cover; object-position: top;">
                </div>
                <h4 style="font-size: 16px; margin-top: 15px; margin-bottom: 4px; color: #fff; font-weight: 600;">${person.title ? person.title.split(' ')[0] : ''}</h4>
                <p style="font-size: 13px; color: #4ade80; font-weight: 500;">${person.category || 'Figure'}</p>
            </div>
        `).join('');
    }
}
function renderLatestArticles(articles) {
    const latestGrid = document.getElementById('articles-grid');
    if (!latestGrid) return;

    if (articles.length === 0) {
        latestGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: #cbdad2; padding: 40px 0;">No articles found matching your criteria.</p>`;
        return;
    }

    latestGrid.innerHTML = articles.map(article => `
        <div class="article-row-card" onclick="viewArticle('${article.id}', true)" style="cursor:pointer;" onmouseover="this.style.background='#08351d'; this.style.transform='translateY(-3px)'" onmouseout="this.style.background='#062b17'; this.style.transform='translateY(0)'">
            <div class="row-card-img" style="width: 280px; min-width: 280px; height: 180px;">
                <img src="${article.image}" alt="${article.title}" style="width: 100%; height: 100%; object-fit: cover;">
            </div>
            <div class="row-card-info" style="padding: 20px 25px; display: flex; flex-direction: column; flex: 1; justify-content: space-between;">
                <span style="color: #4ade80; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 8px;">
                    ${article.category || 'POLITICS'}
                </span>
                <h2 style="font-size: 20px; color: #ffffff; margin: 0 0 8px 0; font-weight: 600; line-height: 1.3;">${article.title}</h2>
                <p style="color: #a3b8ad; font-size: 14.5px; line-height: 1.6; margin-bottom: 15px; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden;">
                    ${article.summary || 'Click here to read the full story and explore more details about this topic.'}
                </p>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: auto;">
                    <span style="color: #8da699; font-size: 13px;">
                        May 27, 2026 • <i class="far fa-clock" style="margin: 0 4px;"></i> 5 min read
                    </span>
                    <i class="far fa-bookmark" style="color: #8da699; font-size: 16px;"></i>
                </div>
            </div>
        </div>
    `).join('');
}

// ==========================================================================
// 4. Detail View Controller
// ==========================================================================
let currentFontSize = 18;

function viewArticle(id, updateHistory = true) {
    fetch(`${API_BASE_URL}/view/${id}`, { method: 'POST' }).catch(err => console.log("Views update failed:", err));
    if (updateHistory) {
        const currentParams = new URLSearchParams(window.location.search);
        if (currentParams.get('id') !== String(id)) {
            const newUrl = `?id=${id}`;
            window.history.pushState({ path: newUrl }, '', newUrl);
        }
    }

    const article = GLOBAL_ARTICLES.find(item => String(item.id) === String(id));
    if (!article) return;

    const detTitle = document.getElementById('det-title');
    const detAuthor = document.getElementById('det-author');
    const detCategory = document.getElementById('det-category');
    const detPubDate = document.getElementById('det-pub-date');
    const detUpDate = document.getElementById('det-up-date');
    const detReadTime = document.getElementById('det-read-time');
    const detImg = document.getElementById('det-img');
    const detBody = document.getElementById('det-body');

    if (detTitle) detTitle.innerText = article.title || '';
    if (detAuthor) detAuthor.innerText = article.author || 'Pratik Khadka';
    if (detCategory) detCategory.innerText = (article.category || 'BIOGRAPHY').toUpperCase();
    if (detImg) detImg.src = article.image || '';
    if (detPubDate) detPubDate.innerText = article.publishDate || 'May 27, 2026';
    if (detUpDate) detUpDate.innerText = article.updatedDate || 'July 29, 2026';

    const fullContent = article.content || article.description || article.summary || 'No content available for this article.';
    const wordCount = String(fullContent).trim().split(/\s+/).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
    if (detReadTime) detReadTime.innerText = `${readMinutes} min read`;
    
    if (detBody) {
        currentFontSize = 18;
        detBody.style.fontSize = `${currentFontSize}px`;
        detBody.innerHTML = `
            <div style="margin-bottom: 40px; line-height: 1.9; color: #e0e8e4; letter-spacing: 0.3px;">
                ${String(fullContent).replace(/\n/g, '<br><br>')}
            </div>
        `;
    }

    showPage('detail');
}

// ==========================================================================
// 5. Search & Filter Engine 
// ==========================================================================
// 5. Search & Filter Engine (100% FIXED)
// ==========================================================================
function applySearchOrFilter(val, type, updateHistory = true) {
    const query = val.toLowerCase().trim();
    if (!query) {
        resetToHome(updateHistory);
        return;
    }

    if (updateHistory) {
        const newUrl = `?${type}=${encodeURIComponent(val)}`;
        window.history.pushState({ path: newUrl }, '', newUrl);
    }

    const sectionHeading = document.querySelector('.articles-section h2');
    const searchInput = document.getElementById('search-input');
    
    // १. Featured र Popular सेक्सन मात्र लुकाउने
    const featuredSection = document.querySelector('.featured-section');
    const popularSec = document.querySelector('.popular-section, .popular-personalities');
    
    if (featuredSection) featuredSection.style.display = 'none';
    if (popularSec) popularSec.style.display = 'none';

    // २. हेडिङ परिवर्तन गर्ने
    if (sectionHeading) {
        if (type === "alphabet") {
            sectionHeading.innerText = `Names starting with "${val.toUpperCase()}"`;
        } else if (type === "category") {
            sectionHeading.innerText = `${val.toUpperCase()} Articles`;
        } else {
            sectionHeading.innerText = "Search Results";
        }
    }
    
    // ३. सर्च इनपुट व्यवस्थापन
    if (searchInput) {
        if (type === "alphabet" || type === "category") {
            searchInput.value = ""; 
        } else {
            searchInput.value = val;
        }
    }

    // ४. सही तरिकाले आर्टिकल फिल्टर गर्ने
    let filtered = [];
    if (type === "alphabet") {
        filtered = GLOBAL_ARTICLES.filter(a => a.title && a.title.toUpperCase().startsWith(query.toUpperCase()));
    } else if (type === "category") {
        filtered = GLOBAL_ARTICLES.filter(a => (a.category || 'OTHER').toLowerCase() === query);
    } else {
        filtered = GLOBAL_ARTICLES.filter(a => 
            a.title.toLowerCase().includes(query) || 
            (a.summary && a.summary.toLowerCase().includes(query)) || 
            (a.category && a.category.toLowerCase().includes(query))
        );
    }

    // 🎯 मुख्य सुधार: GLOBAL_ARTICLES को साटो 'filtered' पठाइयो!
    renderLatestArticles(filtered);
    
    // ५. पेज होममा देखाउने
    showPage('home');

    // ६. फिल्टर भएको ठाउँतिर स्मूथ स्क्रोल गराउने
    setTimeout(() => {
        const resultsSection = document.querySelector('.articles-section');
        if (resultsSection) {
            resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }, 100);
}
function resetToHome(updateHistory = true) {
    if (updateHistory) {
        // 🌟 बग १ & ३ फिक्स: URL बाट ह्यास (#) र सबै क्वेरी पूर्ण रूपमा सफा गरेर मूल पाथमा रिसेट गर्ने
        window.history.pushState({ path: window.location.pathname }, '', window.location.pathname);
    }

    const sectionHeading = document.querySelector('.articles-section h2');
    const searchInput = document.getElementById('search-input');
    const featuredSection = document.querySelector('.featured-section');
    const popularSec = document.querySelector('.popular-section, .popular-personalities');
    const catSecs = document.querySelectorAll('.browse-category, .categories-section, .categories-browse-section');

    if (sectionHeading) sectionHeading.innerText = "Latest Articles";
    if (searchInput) searchInput.value = "";
    
    if (featuredSection) featuredSection.style.display = 'block';
    if (popularSec) popularSec.style.display = 'block';
    catSecs.forEach(sec => { if (sec) sec.style.display = 'block'; });

    renderLatestArticles(GLOBAL_ARTICLES.slice(0, 8));
    showPage('home');
}
// ==========================================================================
// 6. Master Event Handlers & Mobile Hamburger / Categories Dropdown Fix
// ==========================================================================
function setupEventHandlers() {
    const searchInput = document.getElementById('search-input');
    const searchBtn = document.getElementById('search-btn');

    function executeSearch() {
        if (!searchInput) return;
        applySearchOrFilter(searchInput.value, 'search', true);
    }
    if (searchBtn && searchInput) {
        searchBtn.addEventListener('click', (e) => { e.preventDefault(); executeSearch(); });
        searchInput.addEventListener('keyup', (e) => { if(e.key === "Enter") executeSearch(); }); 
        searchInput.addEventListener('input', (e) => { if (e.target.value.trim() === "") resetToHome(true); });
    }

    const allCategoryLinks = document.querySelectorAll('.cat-card, .dropdown-menu-horizontal a, .footer-links-grid div:nth-child(2) ul a');
    allCategoryLinks.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const val = (e.currentTarget.querySelector('span') ? e.currentTarget.querySelector('span').textContent : e.currentTarget.textContent).trim();
            
            // 🎯 मुख्य सुधार: 'Other' लाई रिसेट नगराएर सिधै 'other' क्याटेगोरीकै रूपमा फिल्टर गर्न पठाउने!
            applySearchOrFilter(val, 'category', true);
        });
    });

    document.querySelectorAll('.alpha-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const val = e.currentTarget.textContent.trim().toUpperCase();
            if (val.length === 1) applySearchOrFilter(val, 'alphabet', true);
        });
    });

    document.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('.back-home-btn, .dynamic-back-btn');
        if (targetBtn) {
            e.preventDefault();
            resetToHome(true);
        }
    });

    const sliderContainer = document.getElementById('popular-grid');
    const leftArrow = document.querySelector('.slider-arrow.left');
    const rightArrow = document.querySelector('.slider-arrow.right');
    if (sliderContainer && leftArrow && rightArrow) {
        leftArrow.addEventListener('click', () => { sliderContainer.scrollLeft -= 260; });
        rightArrow.addEventListener('click', () => { sliderContainer.scrollLeft += 260; });
    }
}

// ==========================================================================
// 📱 MOBILE HAMBURGER MENU & CATEGORIES TOGGLE ENGINE (FULLY FIXED)
// ==========================================================================
function setupHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navLinks = document.getElementById('nav-links');
    const catTriggerBtn = document.querySelector('.cat-trigger-btn');
    const dropdownMenu = document.querySelector('.dropdown-menu-horizontal');
    const dropdownArrow = document.querySelector('.dropdown-arrow');
    
    if (hamburgerBtn && navLinks) {
        // १. ह्याम्बर्गर बटन क्लिक गर्दा मेनु खोल्ने/बन्द गर्ने
        hamburgerBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = hamburgerBtn.querySelector('i');
            if (icon) {
                icon.classList.toggle('fa-bars');
                icon.classList.toggle('fa-xmark');
            }
        });

        // २. Categories बटन क्लिक गर्दा मेनु बन्द नभई केवल ड्रपडाउन खोल्ने/बन्द गर्ने
        if (catTriggerBtn && dropdownMenu) {
            catTriggerBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropdownMenu.classList.toggle('show-dropdown');
                if (dropdownArrow) {
                    dropdownArrow.classList.toggle('rotate');
                }
            });
        }

        // ३. अन्य साधारण लिङ्कहरूमा क्लिक गर्दा मात्र मुख्य मेनु बन्द हुने
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.classList.contains('cat-trigger-btn')) {
                    return; // Categories हो भने केही नगर्ने (मेनु खुला रहन्छ)
                }

                navLinks.classList.remove('active');
                if (dropdownMenu) dropdownMenu.classList.remove('show-dropdown');
                if (dropdownArrow) dropdownArrow.classList.remove('rotate');

                const icon = hamburgerBtn.querySelector('i');
                if (icon) {
                    icon.classList.add('fa-bars');
                    icon.classList.remove('fa-xmark');
                }
            });
        });
    }
}

// ==========================================================================
// Support, Subscription & Utility Handlers
// ==========================================================================
function handleSubscribe(e) {
    e.preventDefault();
    const emailInput = document.getElementById('subscriber-email');
    const userEmail = emailInput.value.trim();
    
    if (userEmail) {
        const myAdminEmail = "your.email@gmail.com";
        const subject = encodeURIComponent("New Newsletter Subscription - Zebrion");
        const body = encodeURIComponent(`Hello Admin,\n\nPlease add this email to your newsletter subscriber list: ${userEmail}`);
        
        window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${myAdminEmail}&su=${subject}&body=${body}`, '_blank');
        alert("Thank you for subscribing to Zebrion!");
        emailInput.value = "";
    }
}

window.addEventListener('scroll', () => {
    const scrollTopBtn = document.querySelector('.scroll-top-btn');
    if (!scrollTopBtn) return;

    if (window.scrollY > 300) {
        scrollTopBtn.classList.add('show');
    } else {
        scrollTopBtn.classList.remove('show');
    }
});

function adjustFontSize(change) {
    const detBody = document.getElementById('det-body');
    if (!detBody) return;

    if (change === 0) {
        currentFontSize = 18;
    } else {
        currentFontSize += change;
        if (currentFontSize < 14) currentFontSize = 14;
        if (currentFontSize > 28) currentFontSize = 28;
    }

    detBody.style.fontSize = `${currentFontSize}px`;
}

function shareArticle(platform) {
    const shareUrl = encodeURIComponent(window.location.href);
    const title = encodeURIComponent(document.getElementById('det-title')?.innerText || "Check out this article on Zebrion");

    let url = "";
    if (platform === 'facebook') {
        url = `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`;
    } else if (platform === 'twitter') {
        url = `https://twitter.com/intent/tweet?text=${title}&url=${shareUrl}`;
    } else if (platform === 'whatsapp') {
        url = `https://api.whatsapp.com/send?text=${title}%20-%20${shareUrl}`;
    } else if (platform === 'copy') {
        navigator.clipboard.writeText(window.location.href);
        alert("Article link copied to clipboard!");
        return;
    }

    if (url) {
        window.open(url, '_blank', 'width=600,height=400');
    }
}
// ==========================================================================
// 🎯 SMART BACK BUTTON CONTROLLER (article.html मा फर्किने फिक्स)
// ==========================================================================
function handleSmartBack() {
    // १. यदि प्रयोगकर्ता 'article.html' (All Published Articles) बाट आएको हो भने
    // history.back() गर्दा पुरानै पेज, फिल्टर र स्क्रोल पोजिसनमा ठ्याक्कै फर्किन्छ!
    if (document.referrer && document.referrer.includes('article.html')) {
        window.history.back();
    } 
    // २. यदि Home Page (index.html) बाटै खोलेको हो भने होमपेजमै रिसेट गर्ने
    else {
        resetToHome(true);
    }
}