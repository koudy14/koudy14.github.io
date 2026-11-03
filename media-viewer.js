const mediaViewer = document.createElement("dialog");
mediaViewer.className = "media-viewer";
mediaViewer.setAttribute("aria-label", "Zvětšený obrázek nebo video");

const mediaViewerContent = document.createElement("div");
mediaViewerContent.className = "media-viewer__content";

const mediaViewerClose = document.createElement("button");
mediaViewerClose.className = "media-viewer__close";
mediaViewerClose.type = "button";
mediaViewerClose.setAttribute("aria-label", "Zavřít zvětšený obsah");
mediaViewerClose.textContent = "×";

mediaViewer.append(mediaViewerClose, mediaViewerContent);
document.body.append(mediaViewer);

let activeMedia;
let originalMediaWasPlaying = false;

function closeMediaViewer() {
  mediaViewer.close();
}

function openMediaViewer(media) {
  activeMedia = media;
  const enlargedMedia = media.cloneNode(true);
  enlargedMedia.removeAttribute("id");

  if (media instanceof HTMLImageElement) {
    enlargedMedia.alt = media.alt;
  } else {
    originalMediaWasPlaying = !media.paused && !media.ended;
    media.pause();
    enlargedMedia.controls = true;
    enlargedMedia.addEventListener("loadedmetadata", () => {
      enlargedMedia.currentTime = media.currentTime;
      if (originalMediaWasPlaying) {
        enlargedMedia.play();
      }
    }, { once: true });
  }

  mediaViewerContent.replaceChildren(enlargedMedia);
  mediaViewer.showModal();
  mediaViewerClose.focus();
}

document.querySelectorAll("main img").forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `Zvětšit obrázek: ${image.alt || "obrázek"}`);
});

document.addEventListener("click", (event) => {
  const media = event.target.closest("main img, main video");
  if (!media) {
    return;
  }

  event.preventDefault();
  openMediaViewer(media);
});

document.addEventListener("keydown", (event) => {
  if (event.target instanceof HTMLImageElement && event.target.matches("main img")
    && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    openMediaViewer(event.target);
  }
});

mediaViewerClose.addEventListener("click", closeMediaViewer);
mediaViewer.addEventListener("click", (event) => {
  if (event.target === mediaViewer) {
    closeMediaViewer();
  }
});
mediaViewer.addEventListener("close", () => {
  const enlargedMedia = mediaViewerContent.firstElementChild;
  if (activeMedia instanceof HTMLVideoElement && enlargedMedia instanceof HTMLVideoElement) {
    if (activeMedia.readyState > 0 && enlargedMedia.readyState > 0) {
      activeMedia.currentTime = enlargedMedia.currentTime;
    }

    if (enlargedMedia.paused) {
      activeMedia.pause();
    } else {
      activeMedia.play().catch((error) => {
        console.error("Video se po zavření zvětšeného zobrazení nepodařilo obnovit.", error);
      });
    }
  }

  mediaViewerContent.replaceChildren();
  activeMedia?.focus();
  activeMedia = null;
});
