// Function to add the "navbarDark" class to the navbar on scroll
function handleNavbarScroll() {
    const header = document.querySelector(".navbar");
    window.onscroll = function () {
        const top = window.scrollY;
        if (top >= 100) {
            header.classList.add("navbarDark");
        } else {
            header.classList.remove("navbarDark");
        }
    };
}

// Function to handle navbar collapse on small devices after a click
function handleNavbarCollapse() {
    const navLinks = document.querySelectorAll(".nav-item");
    const menuToggle = document.getElementById("navbarSupportedContent");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            new bootstrap.Collapse(menuToggle).toggle();
        });
    });
}


//Carrouselle des compétences 
let position = 0;
let slides = [];

const bannerImage = document.querySelector(".skills-banner-img");
const tagTitle = document.querySelector(".skills-title");
const tagText = document.querySelector(".skills-text");
const arrowLeft = document.querySelector("#skills-banner .arrow_left");
const arrowRight = document.querySelector("#skills-banner .arrow_right");
const dotsContainer = document.querySelector("#skills-banner .dots");

function updateSlide(position) {
    bannerImage.src = `./images/${slides[position].image}`;
    bannerImage.alt = slides[position].title;
    tagTitle.textContent = slides[position].title;
    tagText.textContent = slides[position].text;

    const dots = document.querySelectorAll("#skills-banner .dot");

    dots.forEach((dot, i) => {
        dot.classList.toggle("dot_selected", i === position);
    });
}

function initSkillsSlider() {
    fetch("data/skills.json")
        .then((response) => response.json())
        .then((data) => {
            slides = data;

            dotsContainer.innerHTML = "";

            slides.forEach((_, i) => {
                const dot = document.createElement("button");
                dot.classList.add("dot");
                dot.type = "button";
                dot.setAttribute("aria-label", `Aller à la compétence ${i + 1}`);

                if (i === 0) {
                    dot.classList.add("dot_selected");
                }

                dot.addEventListener("click", function () {
                    position = i;
                    updateSlide(position);
                });

                dotsContainer.appendChild(dot);
            });

            updateSlide(position);

            arrowRight.addEventListener("click", function () {
                position = (position + 1) % slides.length;
                updateSlide(position);
            });

            arrowLeft.addEventListener("click", function () {
                position = (position - 1 + slides.length) % slides.length;
                updateSlide(position);
            });
        })
        .catch((error) => {
            console.error("Erreur lors du chargement des compétences :", error);
        });
}


//filtre boutons 
function setActiveButton(activeButton) {
    const buttons = document.querySelectorAll(".filter-btn");

    buttons.forEach((btn) => {
        btn.classList.remove("active");
    });

    activeButton.classList.add("active");
}

function filterPortfolio(category) {
    const cards = document.querySelectorAll(".portfolio-item");

    cards.forEach((card) => {
        if (category === null || card.dataset.category === category) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
}

function createFilterButton(label, category) {
    const button = document.createElement("button");
    button.textContent = label;
    button.classList.add("btn", "m-2", "filter-btn");
    button.type = "button";

    button.addEventListener("click", () => {
        setActiveButton(button);
        filterPortfolio(category);
    });

    return button;
}

function renderFilters(categories) {
    const filtersContainer = document.getElementById("portfolioFilters");
    filtersContainer.innerHTML = "";

    const allButton = createFilterButton("Tous", null);
    allButton.classList.add("active");
    filtersContainer.appendChild(allButton);

    categories.forEach((category) => {
        const button = createFilterButton(category, category);
        filtersContainer.appendChild(button);
    });
}

// Function to dynamically create HTML elements from the JSON file
function createPortfolioFromJSON() {
    const container = document.getElementById("portfolioGallery");
    container.innerHTML = "";

    let row = document.createElement("div");
    row.classList.add("row");

    fetch("data/portfolio.json")
        .then((response) => response.json())
        .then((data) => {
            const categories = [...new Set(data.map((item) => item.category))];
            renderFilters(categories);

            data.forEach((item) => {
                const card = document.createElement("div");
                card.classList.add("col-lg-4", "mt-4", "portfolio-item");
                card.setAttribute("data-category", item.category);

                card.innerHTML = `
                    <div class="card portfolioContent h-100">
                        <img class="card-img-top" src="images/${item.image}" alt="${item.title}" style="width:100%">
                        <div class="card-body">
                            <h3 class="card-title">${item.title}</h3>
                            <p class="card-text">${item.text}</p>
                            <div class="text-center">
                                <a href="${item.link}" class="btn btn-success">Lien</a>
                            </div>
                        </div>
                    </div>
                `;

                row.appendChild(card);
            });

            container.appendChild(row);
        });
}

// Call the functions to execute the code
handleNavbarScroll();
handleNavbarCollapse();
createPortfolioFromJSON();
initSkillsSlider();
