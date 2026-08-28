(() => {
  const games = window.CLASSROOM_GAMES || [];
  const list = document.getElementById("game-list");
  if (!games.length || !list) {
    return;
  }

  const currentPage = document.body.dataset.page || "home";

  const gameFrame = document.querySelector(".game-frame");

  function focusGameFrame() {
    if (!gameFrame) return;
    gameFrame.setAttribute("tabindex", "0");
    gameFrame.focus();
  }

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  document.body.appendChild(toast);

  let toastTimer = null;

  function showToast(message) {
    toast.textContent = message;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => {
      toast.classList.remove("is-visible");
    }, 2000);
  }

  function createBadge(status, isCurrent) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.setAttribute("aria-hidden", "true");
    if (isCurrent) {
      badge.textContent = "This Page";
    } else if (status === "active" || status === "live") {
      badge.textContent = "Live";
    } else {
      badge.textContent = "Soon";
    }
    return badge;
  }

  function renderGameList() {
    list.innerHTML = "";

    games.forEach((game) => {
      const item = document.createElement("li");
      const link = document.createElement("a");
      const isCurrent = game.page === currentPage;

      if (isCurrent) {
        link.href = game.url;
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      } else if (game.status === "active" || game.status === "live") {
        link.href = game.url;
        link.classList.add("is-live");
      } else {
        link.href = "#";
        link.classList.add("is-coming-soon");
        link.setAttribute("aria-label", game.name + " is coming soon");
        link.addEventListener("click", (event) => {
          event.preventDefault();
          showToast(`${game.name} is coming soon.`);
        });
      }

      link.textContent = game.name + " ";
      link.appendChild(createBadge(game.status, isCurrent));
      item.appendChild(link);
      list.appendChild(item);
    });

    const activeItem = list.querySelector(".is-active");
    if (activeItem) {
      requestAnimationFrame(() => {
        activeItem.scrollIntoView({ block: "nearest", inline: "center" });
      });
    }
  }

  function initFullscreen() {
    const button = document.getElementById("fullscreen-button");
    const shell = document.querySelector(".game-shell");
    if (!button || !shell) {
      return;
    }

    function updateFullscreenState() {
      const active = document.fullscreenElement === shell;
      button.textContent = active ? "Exit Fullscreen" : "Fullscreen";
      shell.classList.toggle("is-fullscreen", active);
    }

    document.addEventListener("fullscreenchange", updateFullscreenState);

    button.addEventListener("click", () => {
      if (document.fullscreenElement) {
        document.exitFullscreen?.();
      } else {
        shell.requestFullscreen?.();
      }
      focusGameFrame();
    });
  }

  const placeholder = document.getElementById("game-placeholder");
  if (placeholder && gameFrame) {
    function hidePlaceholder() {
      if (gameFrame.getAttribute("src")) {
        placeholder.hidden = true;
      }
    }
    gameFrame.addEventListener("load", hidePlaceholder, { once: true });
    gameFrame.addEventListener("load", focusGameFrame);
    const localDoc = gameFrame.contentDocument;
    if (localDoc && localDoc.readyState === "complete") {
      hidePlaceholder();
      focusGameFrame();
    }
    setTimeout(() => { hidePlaceholder(); focusGameFrame(); }, 5000);
  }

  renderGameList();
  initFullscreen();
})();
