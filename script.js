"use strict";

/* =================================
   KN4GHT SECURITY
   WEBSITE JAVASCRIPT
================================= */

document.addEventListener("DOMContentLoaded", () => {
  initSmoothScroll();
  initNavbar();
  initImageHandling();
  initButtons();
});


/* =================================
   SMOOTH SCROLL
================================= */

function initSmoothScroll() {

  const links = document.querySelectorAll(
    'a[href^="#"]'
  );

  links.forEach((link) => {

    link.addEventListener("click", (event) => {

      const targetId =
        link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target =
        document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    });

  });

}


/* =================================
   NAVBAR
================================= */

function initNavbar() {

  const navbar =
    document.getElementById("navbar");

  if (!navbar) {
    return;
  }

  function updateNavbar() {

    if (window.scrollY > 25) {
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


/* =================================
   BOT IMAGE
================================= */

function initImageHandling() {

  const image =
    document.querySelector(".bot-icon img");

  if (!image) {
    return;
  }

  image.addEventListener("error", () => {

    console.warn(
      "Kn4ght Security image failed to load."
    );

    image.style.opacity = "0.5";

  });

}


/* =================================
   BUTTON EFFECTS
================================= */

function initButtons() {

  const buttons =
    document.querySelectorAll(
      ".invite-btn, .secondary-btn"
    );

  buttons.forEach((button) => {

    button.addEventListener("pointerdown", () => {

      button.style.transform =
        "scale(0.97)";

    });

    button.addEventListener("pointerup", () => {

      button.style.transform = "";

    });

    button.addEventListener("pointerleave", () => {

      button.style.transform = "";

    });

  });

}


/* =================================
   PAGE TITLE
================================= */

document.addEventListener(
  "visibilitychange",
  () => {

    if (document.hidden) {

      document.title =
        "Kn4ght Security";

    } else {

      document.title =
        "Kn4ght Security";

    }

  }
);