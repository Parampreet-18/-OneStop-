document.addEventListener('DOMContentLoaded', () => {
  let viewMode = 'all';
  let currentBook = null;
  let favorites = [];

  const getEl = id => document.getElementById(id);

  const booksContainer = getEl('books-container');
  const searchBar = getEl('searchBar');
  const sortDropdown = getEl('sortDropdown');
  const categoryFilter = getEl('categoryFilter');
  const allBooksBtn = getEl('allBooksBtn');
  const favoritesBtn = getEl('favoritesBtn');
  const randomBookBtn = getEl('randomBookBtn');
  const modal = getEl('bookModal');
  const modalCover = getEl('modalCover');
  const modalTitle = getEl('modalTitle');
  const modalAuthor = getEl('modalAuthor');
  const modalDescription = getEl('modalDescription');
  const modalRating = getEl('modalRating');
  const ratingContainer = getEl('ratingContainer');
  const reviewsList = getEl('reviewsList');
  const reviewForm = getEl('reviewForm');
  const newReviewText = getEl('newReview');
  const closeButton = document.querySelector('.close-button');
  const submitBookForm = getEl('submitBookForm');
  const scrollTopBtn = getEl('scrollTopBtn');
  const searchSuggestions = getEl('searchSuggestions');

  const books = [
    {
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      cover: 'https://cdn.kobo.com/book-images/5addc4c9-fbc1-42d7-a79f-cec7619d4b23/1200/1200/False/the-great-gatsby-a-novel-1.jpg',
      description: 'A novel set in the Roaring Twenties...',
      rating: 4,
      reviews: []
    },
    {
      title: '1984',
      author: 'George Orwell',
      cover: 'https://cdn.ibpbooks.com/images/sdf/1985.jpg',
      description: 'A dystopian novel...',
      rating: 5,
      reviews: []
    },
    {
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      cover: 'https://cdn.penguin.co.uk/dam-assets/books/9780434020485/9780434020485-jacket-large.jpg',
      description: 'A story of racial injustice...',
      rating: 5,
      reviews: []
    },
    {
      title: 'Pride and Prejudice',
      author: 'Jane Austen',
      cover: 'https://picsum.photos/150/220?random=1',
      description: 'A classic novel...',
      rating: 4,
      reviews: []
    },
    {
      title: 'The Hobbit',
      author: 'J.R.R. Tolkien',
      cover: 'https://kitabay.com/cdn/shop/files/1_40b85980-54b8-4c8a-925d-9f00c399553f.jpg?v=1706779709',
      description: 'An epic fantasy adventure...',
      rating: 5,
      reviews: []
    },
    {
      title: "Harry Potter and the Sorcerer's Stone",
      author: 'J.K. Rowling',
      cover: 'https://rukminim3.flixcart.com/image/850/1000/xif0q/book/6/t/7/harry-potter-and-the-sorcerer-s-stone-book-1-original-imah9b3wjbvvq2wf.jpeg?q=20&crop=false',
      description: 'The first book in the Harry Potter series...',
      rating: 5,
      reviews: []
    },
    {
      title: 'The Catcher in the Rye',
      author: 'J.D. Salinger',
      cover: 'https://picsum.photos/150/220?random=2',
      description: 'A story about teenage alienation...',
      rating: 4,
      reviews: []
    },
    {
      title: 'Moby Dick',
      author: 'Herman Melville',
      cover: 'https://rukminim2.flixcart.com/image/850/1000/kgl5ua80/book/2/6/1/moby-dick-or-the-whale-original-imafwsh4gt7ffufp.jpeg?q=90&crop=false',
      description: 'Captain Ahab’s obsessive quest...',
      rating: 3,
      reviews: []
    },
    {
      title: 'The Lord of the Rings',
      author: 'J.R.R. Tolkien',
      cover: 'https://images.fathomevents.com/image/upload/w_400,dpr_2,f_auto,q_auto/v1709924664/Events/2024/1928/The_Lord_of_the_Rings_The_Fellowship_of_the_Ring_1000x1480_FE_Website.jpg.jpg',
      description: 'An epic high-fantasy trilogy...',
      rating: 5,
      reviews: []
    },
    {
      title: 'Brave New World',
      author: 'Aldous Huxley',
      cover: 'https://rukminim2.flixcart.com/image/850/1000/xif0q/book/4/g/b/brave-new-world-english-original-imagqmrstkhzgqst.jpeg?q=20&crop=false',
      description: 'A futuristic dystopia...',
      rating: 4,
      reviews: []
    },
    ...[
      { title: 'Whispers of the Forest', author: 'Lena Hart' },
      { title: 'Beyond the Stars', author: 'Kai Morgan' },
      { title: 'The Crimson Letter', author: 'Sophie Lee' },
      { title: 'Echoes of Tomorrow', author: 'Dylan Rivera' },
      { title: 'Fading Embers', author: 'Aria Blake' },
      { title: 'Clockwork City', author: 'Finn Harper' },
      { title: 'Midnight Mirage', author: 'Talia Moon' },
      { title: 'Shadows and Secrets', author: 'Reese Calder' },
      { title: 'Dreambound', author: 'Avery Stone' },
      { title: 'Twilight’s Promise', author: 'Noah Everly' },
      { title: 'The Last Horizon', author: 'Mila Quinn' },
      { title: 'Roses and Revolvers', author: 'Cleo Vance' },
      { title: 'The Oracle’s Flame', author: 'Sienna Fox' },
      { title: 'Witchglass', author: 'Corin Vale' },
      { title: 'Vault of Echoes', author: 'Rowan Keene' },
      { title: 'The Spiral Gate', author: 'Odette Ren' },
      { title: 'Glassfall', author: 'Nolan Storm' },
      { title: 'The Wraith’s Game', author: 'Demi Holt' },
      { title: 'The Last Ember', author: 'Faye Wilder' },
    ].map((book, i) => ({
      ...book,
      cover: `https://picsum.photos/150/220?random=${i + 3}`,
      description: 'A randomly generated book description...',
      rating: Math.floor(Math.random() * 5) + 1,
      reviews: []
    }))
  ];

  const bookCategories = new Map([
    ['The Great Gatsby', 'Classics'],
    ['1984', 'Classics'],
    ['To Kill a Mockingbird', 'Classics'],
    ['Pride and Prejudice', 'Classics'],
    ['Moby Dick', 'Classics'],
    ['The Catcher in the Rye', 'Classics'],
    ['Brave New World', 'Classics'],
    ['Roses and Revolvers', 'Romance'],
    ['Twilight’s Promise', 'Romance'],
    ['The Hobbit', 'Fantasy'],
    ['The Lord of the Rings', 'Fantasy'],
    ['Harry Potter and the Sorcerer\'s Stone', 'Fantasy'],
    ['Beyond the Stars', 'Sci-Fi'],
    ['Clockwork City', 'Fantasy'],
    ['The Phoenix Pact', 'Fantasy'],
    ['Vault of Echoes', 'Fantasy'],
    ['Witchglass', 'Mind, Body & Spirit'],
    ['The Oracle’s Flame', 'Mind, Body & Spirit'],
    ['The Spiral Gate', 'Fantasy'],
    ['Glassfall', 'New Releases'],
    ['The Wraith’s Game', 'New Releases'],
    ['The Last Ember', 'New Releases'],
  ]);
  books.forEach(book => {
    book.category = bookCategories.get(book.title) || 'Uncategorized';
  });

  // Dark Mode
  const darkModeToggle = getEl('darkModeToggle');
  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  });

  // Filter and Sort
  function filterAndSortBooks() {
    const query = searchBar.value.toLowerCase();
    const selectedCategory = categoryFilter.value;

    return books
      .filter(book =>
        (book.title.toLowerCase().includes(query) || book.author.toLowerCase().includes(query)) &&
        (viewMode === 'all' || favorites.includes(book.title)) &&
        (selectedCategory === 'All' || book.category === selectedCategory)
      )
      .sort((a, b) => {
        switch (sortDropdown.value) {
          case 'title-asc': return a.title.localeCompare(b.title);
          case 'title-desc': return b.title.localeCompare(a.title);
          case 'author-asc': return a.author.localeCompare(b.author);
          case 'author-desc': return b.author.localeCompare(a.author);
          case 'rating-asc': return a.rating - b.rating;
          case 'rating-desc': return b.rating - a.rating;
          default: return 0;
        }
      });
  }

  // Display Books
  function displayBooks() {
    booksContainer.innerHTML = '';
    const filteredBooks = filterAndSortBooks();

    filteredBooks.forEach(book => {
      const bookDiv = document.createElement('div');
      bookDiv.className = 'book';
      bookDiv.innerHTML = `
        <img src="${book.cover}" alt="${book.title}" />
        <h3>${book.title}</h3>
        <p>by ${book.author}</p>
        <p>Rating: ${book.rating} / 5</p>
        <button class="favorite-btn">${favorites.includes(book.title) ? 'Unfavorite' : 'Favorite'}</button>
      `;

      bookDiv.querySelector('.favorite-btn').addEventListener('click', e => {
        e.stopPropagation();
        toggleFavorite(book);
      });

      bookDiv.addEventListener('click', () => openModal(book));
      booksContainer.appendChild(bookDiv);
    });
  }

  // Toggle Favorite
  function toggleFavorite(book) {
    if (favorites.includes(book.title)) {
      favorites = favorites.filter(fav => fav !== book.title);
    } else {
      favorites.push(book.title);
    }
    displayBooks();
  }

  // Open Modal
  function openModal(book) {
    currentBook = book;
    modalCover.src = book.cover;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = `by ${book.author}`;
    modalDescription.textContent = book.description;
    modalRating.textContent = `Rating: ${book.rating} / 5`;
    updateReviewsList(book.reviews);
    modal.style.display = 'block';
  }

  // Close Modal
  closeButton.addEventListener('click', () => {
    modal.style.display = 'none';
    currentBook = null;
  });

  window.addEventListener('click', e => {
    if (e.target === modal) {
      modal.style.display = 'none';
      currentBook = null;
    }
  });

  // Update Reviews
  function updateReviewsList(reviews) {
    reviewsList.innerHTML = '';
    reviews.forEach(review => {
      const li = document.createElement('li');
      li.textContent = review;
      reviewsList.appendChild(li);
    });
  }

  reviewForm.addEventListener('submit', e => {
    e.preventDefault();
    if (currentBook && newReviewText.value.trim()) {
      currentBook.reviews.push(newReviewText.value.trim());
      updateReviewsList(currentBook.reviews);
      newReviewText.value = '';
    }
  });

  // Category Filter
  function populateCategoryFilter() {
    categoryFilter.innerHTML = `<option value="All">All Categories</option>` +
      [...new Set(books.map(b => b.category))]
        .sort()
        .map(cat => `<option value="${cat}">${cat}</option>`)
        .join('');
  }

  // Scroll to Top Button
  window.addEventListener('scroll', () => {
    scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  });

  scrollTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // Search Suggestions
  searchBar.addEventListener('input', () => {
    const query = searchBar.value.toLowerCase();
    searchSuggestions.innerHTML = '';
    if (!query) return;

    const suggestions = books
      .filter(b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query))
      .slice(0, 5);

    suggestions.forEach(s => {
      const li = document.createElement('li');
      li.textContent = s.title;
      li.addEventListener('click', () => {
        searchBar.value = s.title;
        searchSuggestions.innerHTML = '';
        displayBooks();
      });
      searchSuggestions.appendChild(li);
    });
  });

  // Sort, Filter, View Events
  [sortDropdown, categoryFilter].forEach(el => el.addEventListener('change', displayBooks));
  allBooksBtn.addEventListener('click', () => {
    viewMode = 'all';
    displayBooks();
  });
  favoritesBtn.addEventListener('click', () => {
    viewMode = 'favorites';
    displayBooks();
  });
  randomBookBtn.addEventListener('click', () => {
    const filteredBooks = filterAndSortBooks();
    if (filteredBooks.length) {
      openModal(filteredBooks[Math.floor(Math.random() * filteredBooks.length)]);
    }
  });

  // Book Submission
  submitBookForm.addEventListener('submit', e => {
    e.preventDefault();

    const newBook = {
      title: getEl('newTitle').value,
      author: getEl('newAuthor').value,
      cover: getEl('newCover').value,
      category: getEl('newCategory').value,
      description: getEl('newDescription').value,
      rating: Math.floor(Math.random() * 3) + 3, // 3–5
      reviews: []
    };

    books.push(newBook);
    populateCategoryFilter();
    displayBooks();
    submitBookForm.reset();
    alert('Book added successfully!');
  });

  // Initialize
  populateCategoryFilter();
  displayBooks();
});
