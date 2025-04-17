document.addEventListener("DOMContentLoaded", function () {
  displayTrendingHotels(); // Displays the trending hotels on page load

  // Dark Mode Toggle
  const darkModeToggle = document.getElementById("darkModeToggle");
  darkModeToggle?.addEventListener("click", toggleDarkMode);

  // Booking Form Submit Handler
  const bookingForm = document.getElementById("bookingForm");
  if (bookingForm) {
    loadStoredUserDetails(); // Load stored user details if available
    bookingForm.addEventListener("submit", handleBookingFormSubmit);
  }

  // Scroll to top button logic
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  window.addEventListener("scroll", function () {
    if (window.scrollY > 300) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }
  });

  scrollTopBtn?.addEventListener("click", scrollUp);

  // Scroll direction detection
  let lastScrollTop = 0;
  window.addEventListener("scroll", function () {
    const st = window.scrollY || document.documentElement.scrollTop;
    const scrollDirectionIndicator = document.getElementById("scrollDirectionIndicator");

    if (st > lastScrollTop) {
      // Scrolling down
      scrollDirectionIndicator.textContent = "🔽 Scrolling Down";
    } else {
      // Scrolling up
      scrollDirectionIndicator.textContent = "🔼 Scrolling Up";
    }

    lastScrollTop = st <= 0 ? 0 : st; // Prevent negative scroll values
  });
});

const hotels = [
  {
    name: "Taj Hotel, Mumbai",
    city: "mumbai",
    description: "5-star luxury hotel near Gateway of India",
    price: "10500",
    rating: 5,
    image: "https://images.hindustantimes.com/rf/image_size_960x540/HT/p2/2018/12/15/Pictures/_9f2b6346-ffd3-11e8-9457-b1b429387a4e.jpg",
    offer: "20% off with code TAJ20"
  },
  {
    name: "Coorg Homestay",
    city: "coorg",
    description: "Beautiful homestay in the middle of coffee plantations",
    price: "3200",
    rating: 5,
    image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/501528790.jpg?k=ab62245fd0c7a103e2cb34e587058afcddbe8981d1ada06b4c9dd968de46da47&o=&hp=1",
    offer: "10% off with code COORG10"
  },
  {
    name: "Goa Beach Resort",
    city: "goa",
    description: "Enjoy a relaxing beachside stay in Goa",
    price: "7500",
    rating: 4.5,
    image: "https://media-cdn.tripadvisor.com/media/photo-s/13/17/90/18/swimming-pool.jpg"
  },
  {
    name: "Jaipur Royal Palace",
    city: "jaipur",
    description: "Experience a luxurious royal stay in Jaipur",
    price: "8000",
    rating: 4.8,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTkq_VHxX7wBw0uXhlX6Q5-ueKgRxS2xJlb8Q&s"
  },
  {
    name: "Manali Mountain Resort",
    city: "manali",
    description: "A peaceful resort in the snowy mountains of Manali",
    price: "5500",
    rating: 4.2,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQEhGNir1Ww-yHsxjOImzMPDdgCdZwqEBeAeQ&s"
  },
  {
    name: "Kerala Backwater Villa",
    city: "kerala",
    description: "Stay in a beautiful villa near the serene backwaters of Kerala",
    price: "6800",
    rating: 5,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS03WsdHvCw5J8I7m4fLyP_dcNe8ojLaWXaGQ&s",
    offer: "15% off with code VILLA10"
  },
  {
    name: "Rajasthan Desert Camp",
    city: "rajasthan",
    description: "Luxury tent stay in the heart of the Thar Desert",
    price: "4500",
    rating: 4.6,
    image: "https://static.toiimg.com/photo/msid-115695045,width-96,height-65.cms"
  },
  {
    name: "Ooty Hilltop Cottage",
    city: "ooty",
    description: "Cozy cottage stay with breathtaking views in Ooty",
    price: "3900",
    rating: 5,
    image: "https://res.cloudinary.com/voyehomes/image/upload/w_1280,f_auto,c_scale/v1721993939/property/107/image/d5830ff7-42f7-4c92-a447-1073b7877d92.jpg"
  },
  {
    name: "Shimla Heritage Hotel",
    city: "shimla",
    description: "A heritage hotel with a colonial charm in Shimla",
    price: "6200",
    rating: 4.1,
    image: "https://media-cdn.tripadvisor.com/media/photo-s/0e/66/1f/75/hotel-facade.jpg"
  },
  {
    name: "Darjeeling Tea Estate Retreat",
    city: "darjeeling",
    description: "A peaceful retreat in the middle of Darjeeling's tea gardens",
    price: "5000",
    rating: 4.7,
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT-aeIJL8pJLAQgz_xjPTX92Wg6ffDwf2xvAA&s"
  },
  {
    name: "Rishikesh Riverside Resort",
    city: "rishikesh",
    description: "Relax by the Ganges in this beautiful riverside resort",
    price: "5200",
    rating: 4.9,
    image: "https://cf.bstatic.com/xdata/images/hotel/max1024x768/514051210.jpg?k=6dd34390e2b2de9688101408f7800eb9fc2b69ddef9a93e2087cb6b510f52379&o=&hp=1",
    offer: "5% off with code RISHIKESH10"
  },
  {
    name: "Bangalore Business Hotel",
    city: "bangalore",
    description: "Perfect stay for business and leisure in the tech city",
    price: "6500",
    rating: 4.8,
    image: "https://images.trvl-media.com/lodging/5000000/4320000/4319200/4319124/32340772.jpg?impolicy=fcrop&w=357&h=201&p=1&q=medium"
  }
];

let usedOffers = {};

function loadStoredUserDetails() {
  const storedName = localStorage.getItem("guestName");
  const storedEmail = localStorage.getItem("guestEmail");
  if (storedName) document.getElementById("guestName").value = storedName;
  if (storedEmail) document.getElementById("guestEmail").value = storedEmail;
}

function handleBookingFormSubmit(e) {
  e.preventDefault();

  const name = document.getElementById("guestName")?.value.trim();
  const email = document.getElementById("guestEmail")?.value.trim();
  const doc = document.getElementById("documentUpload")?.files[0];
  const payment = document.getElementById("paymentMethod")?.value;
  const selectedHotel = document.getElementById("selectedHotelName")?.value || "Hotel";
  const offerCode = document.getElementById("offerCode")?.value.trim();
  const confirmationDiv = document.getElementById("bookingConfirmationMessage");

  if (!name || !email || !doc || !payment) {
    alert("❗ Please fill all booking fields!");
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    alert("❗ Please enter a valid email address!");
    return;
  }

  const validFile = /\.(pdf|jpg|png)$/i.test(doc.name);
  if (!validFile) {
    alert("❗ Please upload a valid document (PDF, JPG, PNG)");
    return;
  }

  if (offerCode && !isValidOfferCode(offerCode, selectedHotel)) {
    alert("❗ Invalid or expired offer code!");
    return;
  }

  localStorage.setItem("guestName", name);
  localStorage.setItem("guestEmail", email);

  if (confirmationDiv) {
    confirmationDiv.innerHTML = "⏳ Processing your booking...";
    confirmationDiv.style.display = "block";
    confirmationDiv.style.opacity = 1;
  }

  setTimeout(() => {
    if (confirmationDiv) {
      confirmationDiv.innerHTML = `✅ Booking Confirmed for <strong>${name}</strong> at <strong>${selectedHotel}</strong>!<br>📩 Confirmation sent to <strong>${email}</strong>.<br>💳 Payment via <strong>${payment}</strong>.`;
    }

    closeModal("bookingModal");

    if (offerCode) usedOffers[selectedHotel] = "✅ Offer Applied";

    displayHotels(hotels);
  }, 800);
}

function searchHotels() {
  const query = document.getElementById("searchBox").value.toLowerCase();
  const checkin = document.getElementById("checkin").value;
  const checkout = document.getElementById("checkout").value;
  const sortBy = document.getElementById("sortBy").value;
  const ratingFilter = document.getElementById("ratingFilter").value;

  if (!query || !checkin || !checkout) {
    alert("❗ Please enter all required fields!");
    return;
  }

  let filtered = hotels.filter(hotel => hotel.city.includes(query));

  if (ratingFilter !== "all") {
    const minRating = parseFloat(ratingFilter);
    filtered = filtered.filter(h => h.rating >= minRating);
  }

  if (sortBy === "lowToHigh") {
    filtered.sort((a, b) => parseInt(a.price) - parseInt(b.price));
  } else if (sortBy === "highToLow") {
    filtered.sort((a, b) => parseInt(b.price) - parseInt(a.price));
  }

  if (filtered.length === 0) {
    document.getElementById("hotelsContainer").innerHTML = "<p>No hotels found matching your criteria.</p>";
    return;
  }

  displayHotels(filtered);
}

function displayHotels(hotelList) {
  const container = document.getElementById("hotelsContainer");
  container.innerHTML = "";

  hotelList.forEach(hotel => {
    const offerHTML = hotel.offer
      ? `<p class="offer">${usedOffers[hotel.name] || "🎉 " + hotel.offer}</p>`
      : "";

    const card = `
      <div class="hotel">
        <img src="${hotel.image}" alt="${hotel.name}" />
        <h3>${hotel.name}</h3>
        <p class="price">₹${hotel.price} / night</p>
        <p>Rating: ${hotel.rating}★</p>
        <button onclick="bookHotel('${hotel.name}')">Book Now</button>
        ${offerHTML}
      </div>
    `;

    container.innerHTML += card;
  });
}

function displayTrendingHotels() {
  displayHotels(hotels);
}

function toggleDarkMode() {
  document.body.classList.toggle("dark");
  const btn = document.getElementById("darkModeToggle");
  btn.textContent = document.body.classList.contains("dark") ? "Light Mode" : "Dark Mode";
}

function openModal(id) {
  document.getElementById(id).style.display = "block";
}

function closeModal(id) {
  document.getElementById(id).style.display = "none";
}

function bookHotel(hotelName) {
  openModal("bookingModal");

  let input = document.getElementById("selectedHotelName");
  if (!input) {
    input = document.createElement("input");
    input.type = "hidden";
    input.id = "selectedHotelName";
    document.getElementById("bookingForm").appendChild(input);
  }

  input.value = hotelName;
  loadStoredUserDetails();
}

function isValidOfferCode(code, hotelName) {
  const hotel = hotels.find(h => h.name === hotelName);
  return hotel?.offer?.includes(code);
}

function scrollUp() {
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function scrollDown() {
  window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
}

// ✅ ADDED: Step-by-step form navigation functions
function nextStep(current) {
  if (current === 'guest') {
    document.getElementById('guestSection').style.display = 'none';
    document.getElementById('staySection').style.display = 'block';
    updateStepper(1);
  } else if (current === 'stay') {
    document.getElementById('staySection').style.display = 'none';
    document.getElementById('paymentSection').style.display = 'block';
    updateStepper(2);
  }
}

function prevStep(current) {
  if (current === 'stay') {
    document.getElementById('staySection').style.display = 'none';
    document.getElementById('guestSection').style.display = 'block';
    updateStepper(0);
  } else if (current === 'payment') {
    document.getElementById('paymentSection').style.display = 'none';
    document.getElementById('staySection').style.display = 'block';
    updateStepper(1);
  }
}

function updateStepper(stepIndex) {
  const steps = document.querySelectorAll('.booking-stepper div');
  steps.forEach((step, i) => {
    step.classList.toggle('active', i === stepIndex);
  });
}
