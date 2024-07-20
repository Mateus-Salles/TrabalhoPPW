// References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const saveBtn = document.querySelector("#save-btn");
const book = document.querySelector("#book");
const papers = document.querySelectorAll(".paper");
const changeRegister = document.querySelector("#change-register");
const changeLogin = document.querySelector("#change-login");

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);
saveBtn.addEventListener("click", verifyPages);

if (changeLogin && changeRegister) {
  changeRegister.addEventListener("click", goPrevPage);
  changeLogin.addEventListener("click", goNextPage);
}

papers.forEach((element, index) => {
  const zI = index === 0 ? 3 : index === 1 ? 2 : 1;
  element.style.zIndex = zI;
  const frontPage = element.querySelector(".front .front-content");
  const backPage = element.querySelector(".back .back-content");
  const pages = [frontPage, backPage];

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
let temp = 0;
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

function frontEvent(event) {
  element = event.target.parentElement;
  element.style.zIndex = 1;

  const prevPaper = papers[temp - 2];
  const nextPaper = papers[temp];
  const currentPaper = papers[temp - 1];
  const nextNextPaper = papers[temp + 1];

  if (prevPaper) prevPaper.style.zIndex = 1;
  if (currentPaper) currentPaper.style.zIndex = 2;
  if (nextPaper) nextPaper.style.zIndex = 3;
  if (nextNextPaper) nextNextPaper.style.zIndex = 2;

  temp = 0;
}

function goNextPage() {
  if (currentLocation < maxLocation - 1) {
    const paper = papers[currentLocation - 1];
    temp += currentLocation;

    if (currentLocation === 1) openBook();

    paper.querySelector(".back").addEventListener("transitionend", frontEvent);

    paper.classList.add("flipped");

    if (currentLocation === papers.length) closeBook(false);

    currentLocation++;
  }
}

function goPrevPage() {
  if (currentLocation > 1) {
    const nextPaper = papers[currentLocation - 3];
    const paper = papers[currentLocation - 2];
    const prevPaper = papers[currentLocation - 1];
    const prevPrevPaper = papers[currentLocation];

    if (currentLocation === 2) closeBook(true);
    else if (currentLocation === maxLocation) openBook();

    paper
      .querySelector(".back")
      .removeEventListener("transitionend", frontEvent);

    if (prevPrevPaper) prevPrevPaper.style.zIndex = 1;
    if (prevPaper) prevPaper.style.zIndex = 2;
    if (nextPaper) nextPaper.style.zIndex = 2;

    paper.classList.remove("flipped");
    paper.style.zIndex = 3;

    currentLocation--;
  }
}

function verifyPages() {
  const pagesData = document.querySelectorAll(".body");
  console.log(pagesData);
  const pages = Array.from(pagesData).map((pageData) => {
    const value = pageData.value;
    const id = pageData.id;

    return { body: value, id: id };
  });

  savePages(pages);
}

function savePages(pages) {
  const newPages = pages.filter((page) => !!page.body && !page.id);
  const updatePages = pages.filter((page) => !!page.body && !!page.id);

  if (newPages) {
    saveNewRecord(newPages).then();
  }

  if (updatePages) {
    saveExistingRecord(updatePages).then();
  }
}

async function saveNewRecord(pages) {
  const response = await fetch("/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pages }),
  });

  if (!response.ok) {
    alert("Deu algum erro aí. Avisa nois q nois arruma");
  } else {
    window.location.reload();
  }
}

async function saveExistingRecord(pages) {
  const response = await fetch("/records/edit", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pages }),
  });

  if (!response.ok) {
    alert("Deu algum erro aí. Avisa nois q nois arruma");
  } else {
    window.location.reload();
  }
}
