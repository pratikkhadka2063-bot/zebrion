const API_URL = "http://localhost:8080/api/articles";
let fetchedArticles = [];

document.addEventListener("DOMContentLoaded", () => {
    // १. सुरुमै index.html को hidden कन्फ्लिक्टहरू सफा गर्ने
    const homePageEl = document.getElementById('home-page');
    const detailPageEl = document.getElementById('detail-page');

    if (homePageEl) homePageEl.classList.remove('hidden');
    if (detailPageEl) detailPageEl.classList.add('hidden');

    // ग्लोबल सर्च सुन्ने प्रणाली
    initDeveloperSearch();

    // URL Parameters बाट 'id' छ कि छैन चेक गर्ने (article.html बाट आउँदा यो चाहिन्छ)
    const urlParams = new URLSearchParams(window.location.search);
    const articleIdFromUrl = urlParams.get('id');

    if (articleIdFromUrl) {
        loadLiveArticles(parseInt(articleIdFromUrl));
    } else {
        loadLiveArticles(null);
    }

    setupBackButtonLogic();
});

// पेज भ्यु म्यानेज गर्ने कन्ट्रोलर (Safe Visibility Handler)
function togglePageViews(mode) {
    const homePageEl = document.getElementById('home-page');
    const detailPageEl = document.getElementById('detail-page');
    const articleBox = document.querySelector('.full-article-view');

    if (mode === 'detail') {
        if (homePageEl) homePageEl.classList.add('hidden');
        if (detailPageEl) detailPageEl.classList.remove('hidden');
        
        // 🎯 म्याजिक फिक्स: अर्को पेजबाट आउँदा पनि CSS बक्स लुकेको भए कडा रूपमा देखाउने
        if (articleBox) {
            articleBox.style.setProperty('display', 'block', 'important');
            articleBox.style.setProperty('visibility', 'visible', 'important');
            articleBox.style.setProperty('opacity', '1', 'important');
        }
    } else {
        if (homePageEl) homePageEl.classList.remove('hidden');
        if (detailPageEl) detailPageEl.classList.add('hidden');
        if (articleBox) {
            articleBox.style.setProperty('display', 'none', 'important');
        }
    }
}

// ब्याकइन्डबाट डेटा तान्ने सफा फङ्सन
function loadLiveArticles(autoOpenId) {
    fetch(API_URL)
        .then(res => res.json())
        .then(data => {
            if (!data || data.length === 0) {
                fetchedArticles = [];
                renderOriginalUI([]);
                return;
            }
            fetchedArticles = data;
            renderOriginalUI(fetchedArticles);

            // 🎯 मुख्य फिक्स: यदि बाहिरको पेज (article.html) बाट ID लिएर आएको छ भने ट्याक्कै डाटाहरू भर्ने
            if (autoOpenId) {
                const art = fetchedArticles.find(a => a.id === autoOpenId);
                if (art) {
                    fillDetailData(art);
                    togglePageViews('detail');
                }
            }
        })
        .catch(err => {
            console.error("Database error: ", err);
            renderOriginalUI([]);
        });
}

// प्रिमियम ड्यासबोर्ड स्केच सर्च बार लजिक
function initDeveloperSearch() {
    const searchInput = document.getElementById("search-input");
    const searchBtn = document.getElementById("search-btn");

    if (!searchInput || !searchBtn) return;

    searchBtn.onclick = (e) => {
        e.preventDefault();
        executeSmartConceptSearch(searchInput.value);
    };

    searchInput.onkeyup = (e) => {
        if (e.key === "Enter") {
            executeSmartConceptSearch(searchInput.value);
        }
    };

    searchInput.addEventListener('input', (e) => {
        if (e.target.value.trim() === "") {
            restoreEverythingNormal();
        }
    });
}

function executeSmartConceptSearch(val) {
    const query = val.toLowerCase().trim();
    if (query === "") {
        restoreEverythingNormal();
        return;
    }

    const popularSec = document.querySelector('.popular-section');
    const catSec = document.querySelector('.categories-browse-section');
    if (popularSec) popularSec.style.setProperty('display', 'none', 'important');
    if (catSec) catSec.style.setProperty('display', 'none', 'important');

    const latestTitle = document.querySelector('.articles-section .section-header h2');
    if (latestTitle) latestTitle.innerHTML = `About results for "${val}"`;

    const matched = fetchedArticles.filter(a => 
        a.title.toLowerCase().includes(query) ||
        (a.summary && a.summary.toLowerCase().includes(query)) ||
        (a.category && a.category.toLowerCase().includes(query)) ||
        (a.content && a.content.toLowerCase().includes(query))
    );

    matched.sort((a, b) => {
        if (a.title.toLowerCase().includes(query) && !b.title.toLowerCase().includes(query)) return -1;
        if (!a.title.toLowerCase().includes(query) && b.title.toLowerCase().includes(query)) return 1;
        return b.id - a.id;
    });

    const featuredBox = document.getElementById('featured-article-box');
    const grid = document.getElementById('articles-grid');

    if (featuredBox) featuredBox.innerHTML = "";
    if (grid) {
        grid.innerHTML = "";
        grid.style.display = 'flex';
        grid.style.flexDirection = 'column';
        grid.style.gap = '20px';
        grid.style.width = '100%';
    }

    if (matched.length === 0) {
        if (grid) grid.innerHTML = `<p style="color:#cbdad2; text-align:center; padding:40px; width:100%;">No results found.</p>`;
        return;
    }

    const topMatch = matched[0];
    const topImg = topMatch.image ? (topMatch.image.startsWith('http') ? topMatch.image : `http://localhost:8080${topMatch.image}`) : 'https://via.placeholder.com/600x400';
    
    if (featuredBox) {
        featuredBox.innerHTML = `
            <div class="feat-img-box" style="position: relative;">
                <span style="position:absolute; top:12px; left:12px; background:#e2b13c; color:#111; padding:4px 12px; font-size:0.75rem; border-radius:4px; font-weight:bold; z-index:2;">Featured Match</span>
                <img id="top-main-img" src="${topImg}">
            </div>
            <div class="feat-text-box">
                <span style="color: #e2b13c; font-size: 0.8rem; font-weight: bold; text-transform: uppercase;">★ ${topMatch.category || 'PERSONALITY'}</span>
                <h3 style="margin: 10px 0;">${topMatch.title}</h3>
                <p>${topMatch.summary || 'No description summary available.'}</p>
                <div style="margin-top: 15px;">
                    <a href="#" class="read-bio-btn" onclick="viewFullStory(${topMatch.id}); event.preventDefault();">Read Biography <i class="fas fa-arrow-right"></i></a>
                </div>
            </div>
        `;
    }

    if (matched.length > 1) {
        for (let i = 1; i < matched.length; i++) {
            const art = matched[i];
            const cardImg = art.image ? (art.image.startsWith('http') ? art.image : `http://localhost:8080${art.image}`) : 'https://via.placeholder.com/400x250';
            const rowCard = document.createElement('div');
            rowCard.className = "regular-card search-row-card";
            rowCard.onclick = () => viewFullStory(art.id);
            rowCard.style.cssText = "display: flex; gap: 20px; background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); padding: 15px; border-radius: 12px; cursor: pointer; transition: transform 0.2s; width: 100%; box-sizing: border-box;";

            rowCard.innerHTML = `
                <div style="width: 180px; height: 115px; flex-shrink: 0; overflow: hidden; border-radius: 8px;">
                    <img src="${cardImg}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div style="display: flex; flex-direction: column; justify-content: center; flex-grow: 1;">
                    <span style="color: #cbdad2; font-size: 0.75rem; font-weight: bold; text-transform: uppercase;">${art.category || 'ARTICLE'}</span>
                    <h4 style="margin: 6px 0 4px 0; color: #fff; font-size: 1.25rem;">${art.title}</h4>
                    <p style="color: #cbdad2; font-size: 0.9rem; line-height: 1.4; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; margin: 0; opacity: 0.8;">
                        ${art.summary || 'Click to read full article.'}
                    </p>
                </div>
            `;
            grid.appendChild(rowCard);
        }
    }
}

function restoreEverythingNormal() {
    const popularSec = document.querySelector('.popular-section');
    const catSec = document.querySelector('.categories-browse-section');
    const latestTitle = document.querySelector('.articles-section .section-header h2');
    
    if (popularSec) popularSec.style.display = '';
    if (catSec) catSec.style.display = '';
    if (latestTitle) latestTitle.innerHTML = 'Latest Articles';

    loadLiveArticles(null);
}

function renderOriginalUI(articles) {
    const featuredBox = document.getElementById('featured-article-box');
    const grid = document.getElementById('articles-grid');
    const popularGrid = document.getElementById('popular-grid');
    
    if (featuredBox) featuredBox.innerHTML = "";
    if (grid) {
        grid.innerHTML = "";
        grid.style.display = 'grid';
        grid.style.flexDirection = 'unset';
        grid.style.gap = 'unset';
    }
    if (popularGrid) popularGrid.innerHTML = "";

    if (!articles || articles.length === 0) return;

    const first = articles[0];
    const mainImgSrc = first.image ? (first.image.startsWith('http') ? first.image : `http://localhost:8080${first.image}`) : 'https://via.placeholder.com/600x400';

    if (featuredBox) {
        featuredBox.innerHTML = `
            <div class="feat-img-box">
                <img id="top-main-img" src="${mainImgSrc}">
            </div>
            <div class="feat-text-box">
                <h3>${first.title}</h3>
                <p>${first.summary || 'No summary overview provided.'}</p>
                <a href="#" class="read-bio-btn" onclick="viewFullStory(${first.id}); event.preventDefault();">
                    Read Biography <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
    }

    if (articles.length > 1) {
        for (let i = 1; i < articles.length; i++) {
            const art = articles[i];
            const cardImgSrc = art.image ? (art.image.startsWith('http') ? art.image : `http://localhost:8080${art.image}`) : 'https://via.placeholder.com/400x250';

            if (grid) {
                const card = document.createElement('div');
                card.className = 'regular-card';
                card.onclick = () => viewFullStory(art.id);
                card.innerHTML = `
                    <div class="reg-img-box"><img src="${cardImgSrc}"></div>
                    <div class="card-content">
                        <div class="card-category">${art.category || 'PERSONALITY'}</div>
                        <h3>${art.title}</h3>
                    </div>
                `;
                grid.appendChild(card);
            }

            if (popularGrid && i <= 6) {
                const popCard = document.createElement('div');
                popCard.className = 'pop-card';
                popCard.onclick = () => viewFullStory(art.id);
                popCard.innerHTML = `
                    <div class="pop-img-box"><img src="${cardImgSrc}"></div>
                    <h4>${art.title.split(" ")[0]}</h4>
                    <p>${art.category || 'Public Figure'}</p>
                `;
                popularGrid.appendChild(popCard);
            }
        }
    }
}

function viewFullStory(id) {
    const art = fetchedArticles.find(a => a.id === id);
    if (!art) return;
    
    fillDetailData(art);
    togglePageViews('detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function fillDetailData(art) {
    const mainImgSrc = art.image ? (art.image.startsWith('http') ? art.image : `http://localhost:8080${art.image}`) : 'https://via.placeholder.com/600x400';
    
    const detTitle = document.getElementById('det-title');
    const detImg = document.getElementById('det-img');
    const detAuthor = document.getElementById('det-author');
    const detBody = document.getElementById('det-body');

    if (detTitle) {
        detTitle.innerText = art.title;
        detTitle.style.setProperty('display', 'block', 'important');
    }
    if (detImg) {
        detImg.src = mainImgSrc;
        detImg.style.setProperty('display', 'block', 'important');
    }
    if (detAuthor) detAuthor.innerText = art.author || 'Admin';
    
    if (detBody) {
        detBody.style.setProperty('display', 'block', 'important');
        const fullContent = art.content || art.summary || 'No biography text uploaded.';
        detBody.innerHTML = fullContent.replace(/\n/g, '<br>');
    }
}

function setupBackButtonLogic() {
    document.querySelectorAll(".back-home-btn, .back-btn, #return-back-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.preventDefault();
            
            // 🎯 विशेष कुरा: यदि युजर अर्कै पेज (article.html) बाट सिधै लिंक थिचेर आएको हो भने ब्याक गर्दा उतै फर्काइदिने
            const urlParams = new URLSearchParams(window.location.search);
            if (urlParams.get('id') && document.referrer.includes('article.html')) {
                window.location.href = 'article.html';
                return;
            }

            togglePageViews('home');
            restoreEverythingNormal();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
    });
}