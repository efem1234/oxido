const objOptions = {
  root: null,
  threshold: 0,
  rootMargin: "0px",
};

fetch("http://localhost:5555/getGeneratedArticle")
  .then((response) => response.text())
  .then((text) => {
    const articleContainer = document.querySelector("#articleContainer");
    articleContainer.innerHTML = text;
  })
  .then(() => {
    const paragraphs = document.querySelectorAll("p");

    paragraphs.forEach((p) => {
      const sectionObserver = new IntersectionObserver(
        callBackFunction,
        objOptions
      );
      sectionObserver.observe(p);

      function callBackFunction(entries) {
        const [entry] = entries;
        console.log(entry);
        if (entry.intersectionRatio > 0) {
          sectionObserver.unobserve(p);
        }
        if (entry.isIntersecting) {
          p.classList.remove("hidden");
        } else {
          p.classList.add("hidden");
        }
      }
    });
  })
  .catch((error) => console.error("Error fetching the article:", error));

let clientScrollY = 0;
document.addEventListener("mousemove", (event) => {
  clientScrollY = event.clientY;

  const x = event.pageX + 10;
  const y = event.pageY + 10;

  const circle = document.querySelector("#cursorCircle");
  circle.style.left = `${x}px`;
  circle.style.top = `${y}px`;
});

document.addEventListener("scroll", (e) => {
  const totalScroll = window.scrollY + clientScrollY;

  const circle = document.querySelector("#cursorCircle");
  circle.style.top = `${totalScroll}px`;
});
