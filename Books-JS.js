document.addEventListener('DOMContentLoaded', () => {
  let viewMode = 'all';
  let currentBook = null;
  let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
  let isSpeaking = false;
  let speechSynthesis = window.speechSynthesis;
  let speechUtterance = null;

  // DOM Elements
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
  const darkModeToggle = getEl('darkModeToggle');
  const voiceNarrationBtn = getEl('voiceNarrationBtn');
  const voiceSpeedControl = getEl('voiceSpeedControl');
  const voiceStatus = getEl('voiceStatus');

  // Chatbot elements
  const chatToggle = getEl('chatToggle');
  const chatBot = getEl('chatBot');
  const chatBody = getEl('chatBody');
  const chatInput = getEl('chatInput');
  const sendChat = getEl('sendChat');

  // Book data
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


  // Initialize the application
  function init() {
    setupEventListeners();
    populateCategoryFilter();
    displayBooks();
    initChatbot();
    initVoiceNarration();
  }

  // Set up all event listeners
  function setupEventListeners() {
    // Dark mode toggle
    darkModeToggle.addEventListener('click', toggleDarkMode);

    // Book filtering and sorting
    searchBar.addEventListener('input', () => {
      displayBooks();
      updateSearchSuggestions();
    });
    
    [sortDropdown, categoryFilter].forEach(el => {
      el.addEventListener('change', displayBooks);
    });

    // View mode toggles
    allBooksBtn.addEventListener('click', () => {
      viewMode = 'all';
      displayBooks();
    });
    
    favoritesBtn.addEventListener('click', () => {
      viewMode = 'favorites';
      displayBooks();
    });

    // Random book button
    randomBookBtn.addEventListener('click', showRandomBook);

    // Modal interactions
    closeButton.addEventListener('click', closeModal);
    window.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });

    // Review form submission
    reviewForm.addEventListener('submit', e => {
      e.preventDefault();
      addReview();
    });

    // Submit new book form
    submitBookForm.addEventListener('submit', e => {
      e.preventDefault();
      addNewBook();
    });

    // Scroll to top button
    window.addEventListener('scroll', toggleScrollTopButton);
    scrollTopBtn.addEventListener('click', scrollToTop);
  }

  // Chatbot functionality
  function initChatbot() {
    // Toggle chatbot visibility
    chatToggle.addEventListener('click', () => {
      chatBot.classList.toggle('collapsed');
      chatToggle.textContent = chatBot.classList.contains('collapsed') ? '+' : '_';
    });

    // Send message function
    function sendMessage() {
      const message = chatInput.value.trim();
      if (message) {
        addChatMessage(message, 'user');
        chatInput.value = '';
        respondToMessage(message);
      }
    }

    // Add message to chat
    function addChatMessage(text, sender) {
      const messageDiv = document.createElement('div');
      messageDiv.className = `chat-message ${sender}`;
      messageDiv.textContent = text;
      chatBody.appendChild(messageDiv);
      chatBody.scrollTop = chatBody.scrollHeight;
    }

    // Bot response logic
    function respondToMessage(message) {
      const lowerMsg = message.toLowerCase();
      let response;

      if (lowerMsg.includes('hello') || lowerMsg.includes('hi')) {
        response = "Hello! How can I help you with your reading journey today?";
      } 
      else if (lowerMsg.includes('recommend') || lowerMsg.includes('suggest')) {
        response = getBookRecommendation();
      }
      else if (lowerMsg.includes('favorite') || lowerMsg.includes('favourite')) {
        response = getFavoritesResponse();
      }
      else if (lowerMsg.includes('progress')) {
        response = getReadingProgress();
      }
      else if (lowerMsg.includes('trending')) {
        response = getTrendingBooksResponse();
      }
      else if (lowerMsg.includes('help')) {
        response = getHelpResponse();
      }
      else {
        response = "I'm not sure I understand. Try asking about:\n- Book recommendations\n- Your reading progress\n- Favorite books\nOr say 'help' for more options.";
      }

      // Simulate typing delay
      setTimeout(() => {
        addChatMessage(response, 'bot');
      }, 500);
    }

    // Get book recommendation based on context
    function getBookRecommendation() {
      if (favorites.length > 0) {
        const favCategory = books.find(b => b.title === favorites[0])?.category;
        const recommendation = books.find(b => b.category === favCategory && !favorites.includes(b.title));
        return recommendation 
          ? `Since you like ${favorites[0]}, you might enjoy "${recommendation.title}" by ${recommendation.author}.`
          : "I recommend checking out 'The Midnight Library' by Matt Haig. It's a fantastic read!";
      } else {
        const topRated = books.filter(b => b.rating >= 4);
        const randomBook = topRated[Math.floor(Math.random() * topRated.length)];
        return `I recommend "${randomBook.title}" by ${randomBook.author}. It has a ${randomBook.rating}-star rating!`;
      }
    }

    // Get response about favorites
    function getFavoritesResponse() {
      return favorites.length 
        ? `Your favorite books: ${favorites.join(', ')}`
        : "You haven't added any favorites yet. Click the heart icon on books to add them!";
    }

    // Get reading progress response
    function getReadingProgress() {
      const readingBooks = books.filter(b => b.progress > 0 && b.progress < 100);
      if (readingBooks.length) {
        const progressList = readingBooks.map(b => 
          `${b.title} (${b.progress}%)`).join('\n');
        return `Your reading progress:\n${progressList}`;
      }
      return "You haven't started reading any books yet. Click 'Read Now' to begin!";
    }

    // Get trending books response
    function getTrendingBooksResponse() {
      const trending = getTrendingBooks();
      return trending.length 
        ? `Trending books:\n${trending.map(b => b.title).join('\n')}`
        : "No trending books yet. Be the first to review a book!";
    }

    // Get help response
    function getHelpResponse() {
      return "I can help with:\n- Book recommendations\n- Your reading progress\n- Favorite books\n- Trending books\nTry asking me anything about books!";
    }

    // Event listeners for chat
    sendChat.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', e => {
      if (e.key === 'Enter') sendMessage();
    });

    // Initial greeting
    setTimeout(() => {
      addChatMessage("Hi there! I'm your book assistant. Ask me for recommendations, your reading progress, or anything book-related!", 'bot');
    }, 1000);
  }

  // Voice narration functionality
  function initVoiceNarration() {
    if (!speechSynthesis) {
      voiceNarrationBtn.disabled = true;
      voiceStatus.textContent = "Voice narration not supported in your browser";
      return;
    }

    voiceNarrationBtn.addEventListener('click', toggleVoiceNarration);
    voiceSpeedControl.addEventListener('change', updateVoiceSpeed);
  }

  function toggleVoiceNarration() {
    if (isSpeaking) {
      stopNarration();
    } else {
      startNarration();
    }
  }

  function startNarration() {
    const mainContent = document.querySelector('main').textContent;
    const cleanText = mainContent.replace(/\s+/g, ' ').trim();
    
    speechUtterance = new SpeechSynthesisUtterance(cleanText);
    speechUtterance.rate = parseFloat(voiceSpeedControl.value);
    
    voiceNarrationBtn.classList.add('voice-active');
    voiceNarrationBtn.innerHTML = '<i class="fas fa-microphone-slash"></i> Stop';
    voiceStatus.textContent = "Reading content...";
    isSpeaking = true;
    
    speechUtterance.onend = () => {
      stopNarration();
      voiceStatus.textContent = "Narration completed";
    };
    
    speechUtterance.onerror = (event) => {
      console.error("SpeechSynthesis error:", event);
      voiceStatus.textContent = "Error: " + event.error;
      isSpeaking = false;
    };
    
    speechSynthesis.speak(speechUtterance);
  }

  function stopNarration() {
    if (speechSynthesis.speaking) {
      speechSynthesis.cancel();
    }
    voiceNarrationBtn.classList.remove('voice-active');
    voiceNarrationBtn.innerHTML = '<i class="fas fa-microphone"></i> Listen';
    voiceStatus.textContent = "Voice narration stopped";
    isSpeaking = false;
  }

  function updateVoiceSpeed() {
    if (isSpeaking) {
      stopNarration();
      startNarration();
    }
  }

  // Book display and filtering
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
        <p>Category: ${book.category}</p>
        <div class="book-progress">
          <span class="progress-label">Progress: ${book.progress}%</span>
          <div class="progress-container">
            <div class="progress-bar" style="width: ${book.progress}%;"></div>
          </div>
        </div>
        <div class="book-actions">
          <button class="favorite-btn">
            <i class="fas fa-heart"></i> ${favorites.includes(book.title) ? 'Unfavorite' : 'Favorite'}
          </button>
          <button class="read-now-btn">
            <i class="fas fa-book-open"></i> Read Now
          </button>
        </div>
      `;

      bookDiv.querySelector('.favorite-btn').addEventListener('click', e => {
        e.stopPropagation();
        toggleFavorite(book);
      });

      bookDiv.querySelector('.read-now-btn').addEventListener('click', e => {
        e.stopPropagation();
        openBookReader(book);
      });

      bookDiv.addEventListener('click', () => openModal(book));
      booksContainer.appendChild(bookDiv);
    });
  }

  function toggleFavorite(book) {
    const index = favorites.indexOf(book.title);
    if (index > -1) {
      favorites.splice(index, 1);
    } else {
      favorites.push(book.title);
    }
    localStorage.setItem('favorites', JSON.stringify(favorites));
    displayBooks();
  }

  function openBookReader(book) {
    alert(`Opening "${book.title}" for reading...`);
    // In a real app, you would redirect to a reader page:
    // window.location.href = `/reader?title=${encodeURIComponent(book.title)}`;
  }

  // Modal functions
  function openModal(book) {
    currentBook = book;
    modalCover.src = book.cover;
    modalCover.alt = book.title;
    modalTitle.textContent = book.title;
    modalAuthor.textContent = `by ${book.author}`;
    modalDescription.textContent = book.description;
    modalRating.textContent = `Rating: ${'★'.repeat(book.rating)}${'☆'.repeat(5 - book.rating)}`;
    updateReviewsList(book.reviews);
    modal.style.display = 'block';
  }

  function closeModal() {
    modal.style.display = 'none';
    currentBook = null;
  }

  function updateReviewsList(reviews) {
    reviewsList.innerHTML = '';
    reviews.forEach(review => {
      const li = document.createElement('li');
      li.textContent = review;
      reviewsList.appendChild(li);
    });
  }

  function addReview() {
    const reviewText = newReviewText.value.trim();
    if (currentBook && reviewText) {
      currentBook.reviews.push(reviewText);
      updateReviewsList(currentBook.reviews);
      newReviewText.value = '';
      saveBookData(currentBook);
    }
  }

  function saveBookData(book) {
    localStorage.setItem(`book-${book.title}`, JSON.stringify({
      reviews: book.reviews,
      progress: book.progress
    }));
  }

  // Form handling
  function addNewBook() {
    const newBook = {
      title: getEl('newTitle').value,
      author: getEl('newAuthor').value,
      cover: getEl('newCover').value,
      category: getEl('newCategory').value,
      description: getEl('newDescription').value,
      rating: Math.floor(Math.random() * 3) + 3,
      reviews: [],
      progress: 0
    };

    books.push(newBook);
    populateCategoryFilter();
    displayBooks();
    submitBookForm.reset();
    alert('Book added successfully!');
  }

  // UI helper functions
  function populateCategoryFilter() {
    const categories = ['All', ...new Set(books.map(b => b.category))].sort();
    categoryFilter.innerHTML = categories.map(cat =>
      `<option value="${cat}">${cat}</option>`
    ).join('');
  }

  function updateSearchSuggestions() {
    const query = searchBar.value.toLowerCase();
    searchSuggestions.innerHTML = '';
    
    if (!query) return;

    const suggestions = books
      .filter(b => b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query))
      .slice(0, 5);

    suggestions.forEach(book => {
      const li = document.createElement('li');
      li.textContent = `${book.title} by ${book.author}`;
      li.addEventListener('click', () => {
        searchBar.value = book.title;
        searchSuggestions.innerHTML = '';
        displayBooks();
      });
      searchSuggestions.appendChild(li);
    });
  }

  function showRandomBook() {
    const filteredBooks = filterAndSortBooks();
    if (filteredBooks.length) {
      const randomIndex = Math.floor(Math.random() * filteredBooks.length);
      openModal(filteredBooks[randomIndex]);
    }
  }

  function getTrendingBooks() {
    return books
      .filter(b => b.reviews.length > 0)
      .sort((a, b) => b.reviews.length - a.reviews.length)
      .slice(0, 3);
  }

  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
  }

  function toggleScrollTopButton() {
    scrollTopBtn.style.display = window.scrollY > 300 ? 'block' : 'none';
  }

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  // Initialize the application
  init();
});
