(() => {
  const games = window.CLASSROOM_GAMES || [];
  const list = document.getElementById("game-list");
  if (!games.length || !list) {
    return;
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

  function createBadge(status) {
    const badge = document.createElement("span");
    badge.className = "badge";
    badge.setAttribute("aria-hidden", "true");
    if (status === "active") {
      badge.textContent = "This Page";
    } else if (status === "live") {
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

      if (game.status === "active") {
        link.href = game.url;
        link.classList.add("is-active");
        link.setAttribute("aria-current", "page");
      } else if (game.status === "live") {
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
      link.appendChild(createBadge(game.status));
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
    });
  }

  const placeholder = document.getElementById("game-placeholder");
  const gameFrame = document.querySelector(".game-frame");
  if (placeholder && gameFrame) {
    gameFrame.addEventListener("load", () => {
      if (gameFrame.src) {
        placeholder.hidden = true;
      }
    });
  }

  renderGameList();
  initFullscreen();
})();
