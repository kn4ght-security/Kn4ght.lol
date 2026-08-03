"use strict";

/* =========================
   KN4GHT SECURITY
   JAVASCRIPT
========================= */

document.addEventListener("DOMContentLoaded", () => {

  setupSmoothScroll();

  setupNavbar();

  setupImage();

  setupInviteButtons();

});


/* =========================
   SMOOTH SCROLL
========================= */

function setupSmoothScroll() {

  const links =
    document.querySelectorAll(
      'a[href^="#"]'
    );

  links.forEach((link) => {

    link.addEventListener(
      "click",
      (event) => {

        const id =
          link.getAttribute("href");

        if (!id || id === "#") {
          return;
        }

        const target =
          document.querySelector(id);

        if (!target) {
          return;
        }

        event.preventDefault();

        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });

      }
    );

  });

}


/* =========================
   NAVBAR
========================= */

function setupNavbar() {

  const navbar =
    document.getElementById("navbar");

  if (!navbar) {
    return;
  }

  function updateNavbar() {

    if (window.scrollY > 20) {

      navbar.classList.add("scrolled");

    } else {

      navbar.classList.remove("scrolled");

    }

  }

  updateNavbar();

  window.addEventListener(
    "scroll",
    updateNavbar,
    {
      passive: true
    }
  );

}


/* =========================
   IMAGE
========================= */

function setupImage() {

  const image =
    document.querySelector(
      ".bot-icon img"
    );

  if (!image) {
    return;
  }

  image.addEventListener(
    "error",
    () => {

      const fallback =
        "https://raw.githubusercontent.com/supporterlock-source/Kn4ght-security-image/refs/heads/main/file_000000006eec71f8a82abf3b0a2fa7ee.png";

      if (
        image.src !== fallback
      ) {

        image.src = fallback;

      }

    }
  );

}


/* =========================
   INVITE BUTTON
========================= */

function setupInviteButtons() {

  const buttons =
    document.querySelectorAll(
      ".invite-btn, .secondary-btn"
    );

  buttons.forEach((button) => {

    button.addEventListener(
      "click",
      () => {

        button.style.transform =
          "scale(0.98)";

        setTimeout(() => {

          button.style.transform = "";

        }, 150);

      }
    );

  });

}


/* =========================
   PAGE TITLE
========================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (document.hidden) {

      document.title =
        "Come back • Kn4ght Security";

    } else {

      document.title =
        "Kn4ght Security";

    }

  }
);