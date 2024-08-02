// References to DOM Elements
const prevBtn = document.querySelector("#prev-btn");
const nextBtn = document.querySelector("#next-btn");
const saveBtn = document.querySelector("#save-btn");
const book = document.querySelector("#book");
const changeRegister = document.querySelector("#change-register");
const changeLogin = document.querySelector("#change-login");
var papers = document.querySelectorAll(".paper");

// Event Listener
prevBtn.addEventListener("click", goPrevPage);
nextBtn.addEventListener("click", goNextPage);
saveBtn.addEventListener("click", verifyPages);

papers.forEach(arrangePapers);

if (changeLogin && changeRegister) {
  changeRegister.addEventListener("click", goPrevPage);
  changeLogin.addEventListener("click", goNextPage);
}

// Business Logic
let currentLocation = 1;
let temp = 0;
let numOfPapers = papers.length;
let maxLocation = numOfPapers + 1;
let transition = true;

function logout() {
  fetch("/auth/logout", { method: "POST" })
    .then(() => (window.location.href = "/"))
    .catch((err) => console.error(err));
}

function arrangePapers(paper, index) {
  const zI = index === 0 ? 3 : index === 1 ? 2 : 1;
  paper.style.zIndex = zI;
  const frontPage = paper.querySelector(".front .front-content");
  const backPage = paper.querySelector(".back .back-content");
  const pages = [frontPage, backPage];

  pages.forEach((item, pageIndex) => {
    if (pageIndex === 0 && index === papers.length - 1) {
      const textarea = item.querySelector("textarea");
      if (textarea) {
        textarea.addEventListener("change", addNewPaper);
      }
    }

    addPageLines(item);
  });
}

function addPageLines(page) {
  const lines = page.querySelectorAll(".line");

  lines.forEach((value, key) => {
    value.style.top = `${(484 / (lines.length + 1) / 484) * 100 * (key + 1)}%`;
  });
}

async function getFrontPage() {
  const response = await fetch("/pages?side=front");

  if (response.ok) {
    const frontPage = await response.text();

    return frontPage;
  }
}

async function getBackPage() {
  const response = await fetch("/pages?side=back");

  if (response.ok) {
    const backPage = await response.text();

    return backPage;
  }
}

function addNewPaper(event) {
  const target = event.target;

  if (target.value) {
    Promise.all([getFrontPage(), getBackPage()])
      .then((response) => {
        const frontPage = response[0];
        const backPage = response[1];

        console.log({ frontPage, backPage });

        const paper = document.createElement("div");
        paper.classList.add("paper");

        const front = new DOMParser().parseFromString(frontPage, "text/html")
          .body.firstChild;
        const back = new DOMParser().parseFromString(backPage, "text/html").body
          .firstChild;

        if (!front || !back) {
          return;
        }

        const frontTextarea = front.querySelector("textarea");

        if (!frontTextarea) {
          return;
        }

        addPageLines(front);
        addPageLines(back);

        paper.appendChild(front);
        paper.appendChild(back);

        frontTextarea.addEventListener("change", addNewPaper);
        target.removeEventListener("change", addNewPaper);

        paper.style.zIndex = 2;

        book.appendChild(paper);

        papers = document.querySelectorAll(".paper");

        numOfPapers += 1;
        maxLocation += 1;

        console.log({ numOfPapers, maxLocation });
      })
      .catch((err) => console.log(err));
  }
}

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

  console.log(temp);

  const prevPaper = papers[temp - 2];
  const nextPaper = papers[temp];
  const currentPaper = papers[temp - 1];
  const nextNextPaper = papers[temp + 1];

  if (prevPaper) prevPaper.style.zIndex = 1;
  if (currentPaper) currentPaper.style.zIndex = 2;
  if (nextPaper) nextPaper.style.zIndex = 3;
  if (nextNextPaper) nextNextPaper.style.zIndex = 2;

  console.log(papers[0].style.zIndex);

  temp = 0;

  transition = true;
}

function goNextPage() {
  if (currentLocation < maxLocation - 1 && transition) {
    transition = false;

    const paper = papers[currentLocation - 1];
    temp = currentLocation;

    if (currentLocation === 1) openBook();

    paper.querySelector(".back").addEventListener("transitionend", frontEvent);

    paper.classList.add("flipped");

    if (currentLocation === papers.length) closeBook(false);

    currentLocation++;
  }
}

function goPrevPage() {
  if (currentLocation > 1 && transition) {
    transition = false;

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

    transition = true;
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
  const deletedPages = pages.filter((page) => !page.body && !!page.id);

  Promise.all([
    saveNewRecord(newPages),
    saveExistingRecord(updatePages),
    deleteRecord(deletedPages),
  ])
    .then(() => {
      window.location.href = "/";
    })
    .catch((err) => console.log(err));
}

async function saveNewRecord(pages) {
  if (!pages) return;

  const response = await fetch("/records", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pages }),
  });

  if (!response.ok) alert("Deu algum erro aí. Avisa nois q nois arruma");
  else papers[papers.length - 1].querySelector(".front textarea").value = "";
}

async function saveExistingRecord(pages) {
  if (!pages) return;

  const response = await fetch("/records/edit", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pages }),
  });

  if (!response.ok) alert("Deu algum erro aí. Avisa nois q nois arruma");
  else papers[papers.length - 1].querySelector(".front textarea").value = "";
}

async function deleteRecord(pages) {
  if (!pages) return;

  const response = await fetch("/records/delete", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ pages }),
  });

  if (!response.ok) alert("Deu algum erro aí. Avisa nois q nois arruma");
  else papers[papers.length - 1].querySelector(".front textarea").value = "";
}
