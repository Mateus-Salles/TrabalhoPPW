// References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const saveBtn = document.querySelector("#save-btn");
const book = document.querySelector("#book");

const papers = document.querySelectorAll(".paper");

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);
saveBtn.addEventListener("click", verifyPages);

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
    const prevPaper =
      maxLocation != currentLocation ? papers[currentLocation] : null;
    const temp = currentLocation - 1;

    if (currentLocation === 1) openBook();

    if (prevPaper) prevPaper.style.zIndex = temp;
    setTimeout(() => (prevPaper.style.zIndex = temp - 1), 400);

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

    paper.style.zIndex = maxLocation - (currentLocation - 1);
    paper.classList.remove("flipped");

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
