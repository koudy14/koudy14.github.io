const galleryImages = [...document.querySelectorAll("main img")];
const mediaViewer = document.createElement("dialog");
const mediaViewerContent = document.createElement("div");
const mediaViewerPrevious = document.createElement("button");
const mediaViewerNext = document.createElement("button");

mediaViewer.className = "media-viewer";
mediaViewer.setAttribute("aria-label", "Zvětšený obrázek");
mediaViewerContent.className = "media-viewer__content";

mediaViewerPrevious.className = "media-viewer__navigation media-viewer__previous";
mediaViewerPrevious.type = "button";
mediaViewerPrevious.setAttribute("aria-label", "Předchozí obrázek");
mediaViewerPrevious.textContent = "‹";

mediaViewerNext.className = "media-viewer__navigation media-viewer__next";
mediaViewerNext.type = "button";
mediaViewerNext.setAttribute("aria-label", "Další obrázek");
mediaViewerNext.textContent = "›";

mediaViewer.append(mediaViewerPrevious, mediaViewerContent, mediaViewerNext);
document.body.append(mediaViewer);

let activeImage;
let activeImageIndex = 0;

function showImage(index) {
  activeImageIndex = (index + galleryImages.length) % galleryImages.length;
  activeImage = galleryImages[activeImageIndex];
  mediaViewerContent.replaceChildren(activeImage.cloneNode(true));
}

galleryImages.forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `Zvětšit obrázek: ${image.alt || "obrázek"}`);
});

document.addEventListener("click", (event) => {
  const image = event.target.closest("main img");
  if (!image) {
    return;
  }

  event.preventDefault();
  showImage(galleryImages.indexOf(image));
  mediaViewer.showModal();
  mediaViewerPrevious.focus();
});

document.addEventListener("keydown", (event) => {
  if (mediaViewer.open && event.key === "ArrowLeft") {
    event.preventDefault();
    showImage(activeImageIndex - 1);
  } else if (mediaViewer.open && event.key === "ArrowRight") {
    event.preventDefault();
    showImage(activeImageIndex + 1);
  } else if (event.target instanceof HTMLImageElement && event.target.matches("main img")
    && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    event.target.click();
  }
});

mediaViewerPrevious.addEventListener("click", () => showImage(activeImageIndex - 1));
mediaViewerNext.addEventListener("click", () => showImage(activeImageIndex + 1));
mediaViewer.addEventListener("click", (event) => {
  if (event.target === mediaViewer) {
    mediaViewer.close();
  }
});
mediaViewer.addEventListener("close", () => {
  mediaViewerContent.replaceChildren();
  activeImage?.focus();
});
