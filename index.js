const modalEl = document.getElementById('modal');
const showModalBtnEl = document.getElementById('show-modal-btn');
const modalCloseIconEl = document.getElementById('close-modal-icon');
const bookmarkFormEl = document.getElementById('bookmark-form');
const websiteNameEl = document.getElementById('website-name');
const websiteUrlEl = document.getElementById('website-url');
const bookmarksContainerEl = document.getElementById('bookmarks');

let bookmarks = [];

function showModalEl() {
  modalEl.classList.remove('modal--is-hidden');
  websiteNameEl.focus();
}

function hideModalEl() {
  modalEl.classList.add('modal--is-hidden');
}

function validateInput(nameValue, urlValue) {
  const expressionToValidateWebAddress = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/;
  const regex = new RegExp(expressionToValidateWebAddress);
  if (!nameValue || !urlValue) {
    alert('Please submit values for both fields');
    return false;
  } else if (!urlValue.match(regex)) {
    alert('Please provide a valid web address');
    return false;
  }
  return true;
}

function fetchBookmarks() {
  if (localStorage.getItem('bookmarks')) {
    bookmarks = JSON.parse(localStorage.getItem('bookmarks'));
  } else {
    bookmarks = [
      {
        name: 'google',
        url: 'https://google.com'
      },
      {
        name: 'pixabay',
        url: 'https://pixabay.com'
      },
      {
        name: 'facebook',
        url: 'https://facebook.com'
      }
    ];
    localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  }
}

function buildBookmarksDOM() {
  bookmarksContainerEl.textContent = '';
  bookmarks.forEach((bookmark) => {
    const { name, url } = bookmark;
    // bookmarks__item
    const bookmarksItemEl = document.createElement('div');
    bookmarksItemEl.classList.add('bookmarks__item');
    // bookmarks__delete-item-icon
    const bookmarksDeleteItemIconEl = document.createElement('i');
    bookmarksDeleteItemIconEl.classList.add('fas', 'fa-times', 'bookmarks__delete-item-icon');
    bookmarksDeleteItemIconEl.setAttribute('title', 'Delete Bookmark');
    // bookmarks__information
    const bookmarksInformationEl = document.createElement('div');
    bookmarksInformationEl.classList.add('bookmarks__information');
    // bookmarks__item-icon
    const bookmarksItemIconEl = document.createElement('img');
    bookmarksItemIconEl.classList.add('bookmarks__item-icon');
    bookmarksItemIconEl.setAttribute('src', `https://s2.googleusercontent.com/s2/favicons?domain=${url}`);
    bookmarksItemIconEl.setAttribute('alt', 'Favicon');
    // bookmarks__item-title
    const bookmarksItemTitleEl = document.createElement('a');
    bookmarksItemTitleEl.classList.add('bookmarks__item-title');
    bookmarksItemTitleEl.setAttribute('href', `${url}`);
    bookmarksItemTitleEl.setAttribute('target', '_blank');
    bookmarksItemTitleEl.textContent = name;
    // organize DOM
    bookmarksInformationEl.append(bookmarksItemIconEl, bookmarksItemTitleEl);
    bookmarksItemEl.append(bookmarksDeleteItemIconEl, bookmarksInformationEl);
    bookmarksContainerEl.appendChild(bookmarksItemEl);
  });
}

function fetchBookmarksAndBuildDOM() {
  fetchBookmarks();
  buildBookmarksDOM();
}

function deleteBookmark(url) {
  bookmarks.forEach((bookmark, i) => {
    if (bookmark.url === url) {
      bookmarks.splice(i, 1);
    }
  });
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
}

function deleteBookmarkAndBuildDOM(url) {
  deleteBookmark(url);
  fetchBookmarksAndBuildDOM();
}

function storeBookmark() {
  const nameValue = websiteNameEl.value;
  let urlValue = websiteUrlEl.value;
  if (!urlValue.includes('http://') && !urlValue.includes('https://')) {
    urlValue = `https://${urlValue}`;
  }
  if (!validateInput(nameValue, urlValue)) {
    return false;
  }
  const bookmark = {
    name: nameValue,
    url: urlValue,
  };
  bookmarks.push(bookmark);
  localStorage.setItem('bookmarks', JSON.stringify(bookmarks));
  bookmarkFormEl.reset();
  websiteNameEl.focus();
}

function storeBookmarkAndBuildDOM() {
  storeBookmark();
  fetchBookmarksAndBuildDOM();
}

// Handler Functions

function showModalBtnElClickHandler() {
  showModalEl();
}

function bookmarkFormElSubmitHandler(e) {
  e.preventDefault();
  storeBookmarkAndBuildDOM();
}

function modalCloseIconElClickHandler() {
  hideModalEl();
}

function bookmarksDeleteItemIconElClickHandler(e) {
  const bookmarksItemEl = e.target.closest('.bookmarks__item');
  const bookmarksItemTitleEl = bookmarksItemEl.querySelector('.bookmarks__item-title');
  const url = bookmarksItemTitleEl.getAttribute('href');
  deleteBookmarkAndBuildDOM(url);
}

function windowObjClickHandler(e) {
  const isModalEl = e.target === modalEl;
  if (isModalEl) {
    hideModalEl();
  }
  const isDeleteItemIconEl = e.target.classList.contains('bookmarks__delete-item-icon');
  if (isDeleteItemIconEl) {
    bookmarksDeleteItemIconElClickHandler(e);
  }
}

// Event Listener
showModalBtnEl.addEventListener('click', showModalBtnElClickHandler);
bookmarkFormEl.addEventListener('submit', bookmarkFormElSubmitHandler);
modalCloseIconEl.addEventListener('click', modalCloseIconElClickHandler);
window.addEventListener('click', windowObjClickHandler);

// On load
fetchBookmarksAndBuildDOM();
