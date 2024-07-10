// References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const book = document.querySelector("#book");

const papers = document.querySelectorAll(".paper");

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);

papers.forEach((element, index, list) => {
  element.style.zIndex = list.length - index;
  const frontPage = element.querySelector(".front .front-content");
  const backPage = element.querySelector(".back .back-content");
  const pages = [frontPage, backPage];
  console.log(pages);

  pages.forEach((item) => {
    const lines = item.querySelectorAll(".line");

    lines.forEach((value, key) => {
      value.style.top = `${
        (484 / (lines.length + 1) / 484) * 100 * (key + 1)
      }%`;
    });
  });
});

// Business Logic
let currentLocation = 1;
const numOfPapers = papers.length;
const maxLocation = numOfPapers + 1;

function openBook() {
  book.style.transform = "translateX(50%)";
  prevBtn.style.transform = "translateX(-180px)";
  nextBtn.style.transform = "translateX(180px)";
}

function closeBook(isAtBeginning) {
  if (isAtBeginning) {
    book.style.transform = "translateX(0%)";
  } else {
    book.style.transform = "translateX(100%)";
  }

  prevBtn.style.transform = "translateX(0px)";
  nextBtn.style.transform = "translateX(0px)";
}

function goNextPage() {
  if (currentLocation < maxLocation) {
    const paper = papers[currentLocation - 1];

    if (currentLocation === 1) openBook();

    paper.classList.add("flipped");
    paper.style.zIndex = currentLocation;

    if (currentLocation === papers.length) closeBook(false);

    currentLocation++;
  }
}

function goPrevPage() {
  let paper;

  if (currentLocation > 1) {
    paper = papers[currentLocation - 2];

    if (currentLocation === 2) closeBook(true);
    else if (currentLocation === maxLocation) openBook();

    paper.classList.remove("flipped");
    paper.style.zIndex = maxLocation - (currentLocation - 1);

    currentLocation--;
  }
}
