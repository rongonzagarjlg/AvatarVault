const pages = ['home', 'about', 'shop', 'hats', 'faces', 'accessories', 'limited', 'login', 'register', 'contact'];

// page titles for tab switching
const pageTitles = {
  home: 'AvatarVault - Roblox Avatar Shop',
  about: 'About Us - AvatarVault',
  shop: 'Shop - AvatarVault',
  hats: 'Hats - AvatarVault',
  faces: 'Faces - AvatarVault',
  accessories: 'Accessories - AvatarVault',
  limited: 'Limited Items - AvatarVault',
  login: 'Login - AvatarVault',
  register: 'Register - AvatarVault',
  contact: 'Contact - AvatarVault'
};

var recentlyViewed = []; // dontTouchThis - Ron

function show(pageId) {
    pages.forEach(function(p) {
        var pageEl = document.getElementById(p);
        var navEl = document.getElementById('nav-' + p);

        if (p === pageId) {
            pageEl.classList.add('active');
            if (navEl) navEl.classList.add('active');
        } else {
            pageEl.classList.remove('active');
            if (navEl) navEl.classList.remove('active');
        }
    });

    // update browser tab title
    document.title = pageTitles[pageId] || 'AvatarVault';

    // loading spinner (quick flash)
    showLoader();

    window.scrollTo({ top: 0, behavior: 'smooth' });

    // track recently viewed pages (not items yet, tempFix)
    if (pageId !== 'home' && !recentlyViewed.includes(pageId)) {
        recentlyViewed.push(pageId);
    }
}

function showLoader() {
    var loader = document.getElementById('page-loader');
    if (!loader) return;
    loader.classList.add('visible');
    setTimeout(function() {
        loader.classList.remove('visible');
    }, 400);
}

// timer countdown - written by Misenila
function updateTimers() {
    let timerElements = document.querySelectorAll('.timer');

    timerElements.forEach(function(el) {
        let timeText = el.textContent.replace('⏳ ', '');
        let parts = timeText.split(':');

        if (parts.length !== 3) return;

        let hours = parseInt(parts[0]);
        let minutes = parseInt(parts[1]);
        let seconds = parseInt(parts[2]);

        if (seconds > 0) {
            seconds--;
        } else if (minutes > 0) {
            minutes--;
            seconds = 59;
        } else if (hours > 0) {
            hours--;
            minutes = 59;
            seconds = 59;
        }

        let h = String(hours).padStart(2, '0');
        let m = String(minutes).padStart(2, '0');
        let s = String(seconds).padStart(2, '0');

        el.textContent = '⏳ ' + h + ':' + m + ':' + s;
    });

    let popupTimerVal = document.getElementById('popup-timer-val');
    if (popupTimerVal && popupTimerVal.textContent) {
        let popupTime = popupTimerVal.textContent.split(':');
        if (popupTime.length === 3) {
            let h = parseInt(popupTime[0]);
            let m = parseInt(popupTime[1]);
            let s = parseInt(popupTime[2]);

            if (s > 0) {
                s--;
            } else if (m > 0) {
                m--;
                s = 59;
            } else if (h > 0) {
                h--;
                m = 59;
                s = 59;
            }

            popupTimerVal.textContent = String(h).padStart(2, '0') + ':' + String(m).padStart(2, '0') + ':' + String(s).padStart(2, '0');
        }
    }
}

setInterval(updateTimers, 1000);

// item popup stuff
let currentItem = null;
let wishlistItems = new Set();

const itemDescriptions = {
    "Luffy Squinting Laugh": "A face that says it all. Perfect for dramatic moments and trolling your friends.",
    "Markiplier": "The iconic Markiplier face from Roblox. Classic content creator collab.",
    "Thukuna": "Ryomen Sukuna's terrifying expression. Show the world your cursed energy.",
    "Tongue Out Face": "Updated version of the fan-favorite surprised grin. Creepier than ever.",
    "White Mask Face": "Mysterious and unsettling. Who knows what's under there.",
    "Toji": "Toji Fushiguro's cold gaze. No cursed energy, just pure intimidation.",
    "Luffy Gear 5 Face": "Joyboy awakened. The wildest expression in One Piece, now on your avatar.",
    "Luffy Gear 4 Angry": "Behold the King of Beasts. Pure drip, no explanation needed.",
    "Luffy Crazy Grin": "Donquixote Doflamingo's sinister smile. For the villain arc.",
    "Luffy Curly Brow Laugh": "Buggy the Clown's laugh - underrated character, honestly.",
    "Luffy Gear 5 w/ Hair": "Complete Gear 5 look with the wild white hair included.",
    "Zoro Battle Scar": "The three-sword style swordsman with his iconic scar. Nothing happened.",
    "Zoro Bandana": "Zoro going serious mode. Strap in.",
    "Zoro Green Hair": "Classic Zoro look, green hair and all. The goat.",
    "Shanks Scar Face": "The greatest swordsman in the world is looking at you. Be afraid.",
    "Luffy Frown Face": "SUPER! Franky's angry face. He built himself, you know.",
    "Luffy Shocked Face": "Usopp realizing he has to fight. Extremely relatable.",
    "Luffy Purple Eyes Rage": "Charlotte Katakuri going all out. The mochi man is not happy.",
    "Luffy Smug Face": "Little Coby got a glow up. Marines are eating good.",
    "Luffy Squinting Laugh 2": "Nami's expression when she sees money. Business mode activated.",
    "Luffy Happy Smile": "The Red Hair Pirates captain looking chill as always.",
    "Doflamingo Grin": "Bartholomew Kuma's eerie expression. Paw Paw fruit included (not really).",
    "Crocodile Smirk": "Mr. 0's scheming face. Desert king energy.",
    "Doflamingo Grin V2": "Charlotte Linlin on her birthday. Oshiruko not included.",
    "Cute Blush": "Soft and cute - a rare find in this shop full of angry faces lol.",
    "Luffy Goggles Face": "Usopp with his sniper goggles. Sogeking arc was peak.",
    "Ace Hat w/ Necklace": "Portgas D. Ace's full hat setup with the bead necklace. Fire fist drip.",
    "Luffy Full Body": "Monkey D. Luffy's classic red outfit. The main character look.",
    "Gothic Sword": "A cursed blade straight from Soul Society. Bankai not included.",
    "Chopper Hat": "Tony Tony Chopper's pink hat. Extremely cute, do not underestimate.",
    "Chopper Hat Back": "Chopper hat from the back view. Still adorable.",
    "Whitebeard Full Head": "Edward Newgate's signature look. The strongest man in the world.",
    "Skull Pirate Hat": "Classic pirate skull cap with gold trim. A staple for any pirate build.",
    "Straw Hat": "THE straw hat. Shanks gave it to him. Iconic.",
    "Dark Horn Helmet": "Heavy armor with curved horns. Demon king cosplay unlocked.",
    "Whitebeard V2": "Alternate Whitebeard design. Same energy, slightly different look.",
    "Ace Full Head": "Full Ace head piece including the hat and hair. Complete the look.",
    "Ace Hat Only": "Just the hat. Mix and match with your own face.",
    "Straw Hat + Lightning": "Straw hat with Gear 5 lightning effects. Gear 5 arc was insane.",
    "Straw Hat Dark Aura": "Dark version of the straw hat. For the villain arc moment.",
    "Straw Hat Storm Aura": "Storm variant with wind and cloud effects. Looking like a weather station.",
    "Blue Oni Mask": "Kaido's Oni mask. King of the Beasts in mask form.",
    "Toji Worm": "The cursed worm from Toji's eye. Jujutsu Kaisen fans know.",
    "Rika Yuta Cursed": "Rika the Queen of Curses following you around. Protective... kind of.",
    "Wheelchair": "Nanami's final scene... (it's just a prop, relax)",
    "Luffy Gear 5 Aura": "The Gear 5 transformation aura. Makes your avatar glow like Joyboy.",
    "Cyan Lightning Dragon Heads": "Twin dragon head accessories with lightning effects. Still being priced.",
    "Going Merry Ship": "The Going Merry as an accessory. She did her best.",
    "Luffy Plushie": "A tiny Luffy plushie you can carry around. It's adorable.",
    "Straw Hat Flag White": "Straw Hat Pirates Jolly Roger flag, white version.",
    "Straw Hat Flag Black": "Classic Straw Hat Pirates Jolly Roger flag. The original.",
    "Straw Hat Chain Necklace": "Straw Hat skull chain necklace. Subtle pirate flex.",
    "Luffy Skull Keychain": "Luffy skull keychain accessory. Attaches to your fit.",
    "Brook Skull Pendant": "Brook's skull pendant. Yohohoho! (He has no eyes to look at you)",
    "Wanted Poster Frame": "Make your avatar into a wanted poster. What's your bounty?",
    "Zoro Three Swords": "Zoro's Wado Ichimonji, Sandai Kitetsu, and Shusui. Santoryu.",
    "Marine Admiral Cloak": "Marine Admiral's coat worn on the shoulders. Navy drip.",
    "Chocobo Rider": "A Chocobo with full knight armor. Final Fantasy crossover energy.",
    "Swan Wings": "Elegant twin swan wings. Mr. 2 Bon Clay would approve.",
    "Mera Mera no Mi": "The Flame-Flame Fruit. Was Ace's, then Sabo's. Now yours (on Roblox).",
    "Ito Ito no Mi": "The String-String Fruit. Doflamingo's power. Strings not included.",
    "Hito Hito no Mi": "The Human-Human Fruit. The rarest drop in the shop. Grab it fast."
};

function openPopup(itemName, itemPrice, imgSrc, category, timer) {
    currentItem = {
        name: itemName,
        price: itemPrice,
        image: imgSrc,
        category: category,
        timer: timer
    };

    document.getElementById('popup-img').src = imgSrc;
    document.getElementById('popup-name').textContent = itemName;
    document.getElementById('popup-price').textContent = itemPrice;
    document.getElementById('popup-cat').textContent = '// ' + category.toUpperCase();
    document.getElementById('popup-type').textContent = category;

    // random item ID to look more legit
    var fakeId = '#' + (Math.floor(Math.random() * 9000000) + 1000000);
    document.getElementById('popup-item-id').textContent = fakeId;

    // random favorites count
    var favCount = (Math.floor(Math.random() * 9) + 1) + '.' + Math.floor(Math.random() * 9) + 'k';
    document.getElementById('popup-favs').textContent = '♡ ' + favCount;

    let badge = document.getElementById('popup-badge');
    badge.textContent = category.toUpperCase();
    badge.className = category === 'Limited' ? 'popup-badge limited' : 'popup-badge';

    let stockEl = document.getElementById('popup-stock');
    stockEl.textContent = category === 'Limited' ? 'FEW LEFT' : 'IN STOCK';

    let timerContainer = document.getElementById('popup-timer');
    let timerValueEl = document.getElementById('popup-timer-val');
    if (timer && timer !== '') {
        timerContainer.style.display = 'flex';
        timerValueEl.textContent = timer;
    } else {
        timerContainer.style.display = 'none';
    }

    let description = itemDescriptions[itemName] || 'A cool Roblox avatar item. Equip it to stand out.';
    document.getElementById('popup-desc').textContent = description;

    // star rating (random but consistent-ish per item name)
    var seed = itemName.length * 7;
    var stars = 3 + (seed % 3);
    var starsHtml = '★'.repeat(stars) + '☆'.repeat(5 - stars);
    document.getElementById('popup-stars').textContent = starsHtml;

    let buyBtn = document.getElementById('popup-buy-btn');
    buyBtn.textContent = 'BUY NOW';
    buyBtn.classList.remove('bought');

    let wishlistBtn = document.getElementById('popup-wishlist-btn');
    if (wishlistItems.has(itemName)) {
        wishlistBtn.classList.add('wishlisted');
        wishlistBtn.textContent = '♥';
    } else {
        wishlistBtn.classList.remove('wishlisted');
        wishlistBtn.textContent = '♡';
    }

    document.getElementById('popup-overlay').classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closePopup() {
    document.getElementById('popup-overlay').classList.remove('open');
    document.body.style.overflow = '';
}

function closePopupOnOverlay(event) {
    if (event.target === document.getElementById('popup-overlay')) {
        closePopup();
    }
}

function handleBuy() {
    let buyBtn = document.getElementById('popup-buy-btn');
    buyBtn.textContent = '✓ ADDED TO CART';
    buyBtn.classList.add('bought');

    setTimeout(function() {
        buyBtn.textContent = 'BUY NOW';
        buyBtn.classList.remove('bought');
    }, 2000);
}

function toggleWishlist() {
    if (currentItem === null) return;

    let wishlistBtn = document.getElementById('popup-wishlist-btn');
    let itemName = currentItem.name;

    if (wishlistItems.has(itemName)) {
        wishlistItems.delete(itemName);
        wishlistBtn.classList.remove('wishlisted');
        wishlistBtn.textContent = '♡';
    } else {
        wishlistItems.add(itemName);
        wishlistBtn.classList.add('wishlisted');
        wishlistBtn.textContent = '♥';
    }
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        closePopup();
    }
});

// back to top button visibility
window.addEventListener('scroll', function() {
    var btn = document.getElementById('back-to-top');
    if (!btn) return;
    if (window.scrollY > 300) {
        btn.classList.add('visible');
    } else {
        btn.classList.remove('visible');
    }
});

// sold out cards - disable and style them
document.querySelectorAll('[data-sold="true"]').forEach(function(card) {
    card.classList.add('sold-out');
    var buyBtn = card.querySelector('.buy-btn');
    if (buyBtn) {
        buyBtn.textContent = 'Sold Out';
        buyBtn.disabled = true;
        buyBtn.style.opacity = '0.5';
        buyBtn.style.cursor = 'not-allowed';
    }
});

// NEW badges on marked items
document.querySelectorAll('img.new-item').forEach(function(img) {
    var wrap = img.closest('.card');
    if (wrap) {
        var badge = document.createElement('span');
        badge.className = 'item-badge new-badge';
        badge.textContent = 'NEW';
        wrap.insertBefore(badge, wrap.firstChild);
    }
});

// HOT badges - hardcoded lol (todo: make this dynamic - Misenila)
var hotItems = ['Luffy G5 Hair Face', 'Ace Hat Full', 'Luffy Straw Hat', 'Zoro Green Hair'];
document.querySelectorAll('.card').forEach(function(card) {
    var nameEl = card.querySelector('h4');
    if (!nameEl) return;
    if (hotItems.includes(nameEl.textContent.trim())) {
        var badge = document.createElement('span');
        badge.className = 'item-badge hot-badge';
        badge.textContent = 'HOT 🔥';
        card.insertBefore(badge, card.firstChild);
    }
});

// auto year in footer
var yearEl = document.getElementById('footer-year');
if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
}

// theme toggle
function toggleTheme() {
    let isPurple = document.body.classList.toggle('purple');
    let themeIcon = document.getElementById('theme-icon');
    let themeLabel = document.getElementById('theme-label');

    if (isPurple) {
        themeIcon.textContent = '💜';
        themeLabel.textContent = 'PURPLE';
    } else {
        themeIcon.textContent = '💙';
        themeLabel.textContent = 'BLUE';
    }

    localStorage.setItem('avTheme', isPurple ? 'purple' : 'blue');
}

let savedTheme = localStorage.getItem('avTheme');
if (savedTheme === 'purple') {
    document.body.classList.add('purple');
    document.getElementById('theme-icon').textContent = '💜';
    document.getElementById('theme-label').textContent = 'PURPLE';
}

// console.log('AvatarVault v1.0 loaded');
// console.log('pages:', pages);
