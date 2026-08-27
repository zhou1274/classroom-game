from playwright.sync_api import sync_playwright
import sys
sys.stdout.reconfigure(encoding="utf-8")


base_url = "http://127.0.0.1:8765"
snake_url = f"{base_url}/games/snake-unblocked.html"
results = []
errors = []


def record(label, value):
    results.append(f"{label}={value}")


with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    home = browser.new_page(viewport={"width": 1440, "height": 1000})
    home_errors = []
    home.on("pageerror", lambda exc: home_errors.append(str(exc)))
    home.on("console", lambda msg: home_errors.append(msg.text) if msg.type == "error" else None)
    home.goto(base_url, wait_until="domcontentloaded")
    home.wait_for_selector("#game-list a", timeout=5000)
    home.wait_for_timeout(300)
    home_tabs = home.locator("#game-list a").count()
    snake_link = home.locator("#game-list a", has_text="Snake Unblocked")
    snake_href = snake_link.get_attribute("href") if snake_link.count() else ""
    record("home-tabs", home_tabs)
    record("home-snake-link", snake_href)
    home.close()

    desktop = browser.new_page(viewport={"width": 1440, "height": 1000})
    desktop.on("pageerror", lambda exc: errors.append(str(exc)))
    desktop.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    desktop.goto(snake_url, wait_until="domcontentloaded")
    desktop.wait_for_selector("#game-list a", timeout=5000)
    desktop.wait_for_timeout(500)
    desktop.locator(".game-frame").scroll_into_view_if_needed()
    desktop.frame_locator(".game-frame").locator("#game-canvas").wait_for(timeout=15000)
    desktop.wait_for_timeout(500)

    snake_frame = next(f for f in desktop.frames if "assets/games/snake/index.html" in f.url)
    inner_title = snake_frame.locator("h1").inner_text(timeout=10000)
    desktop.frame_locator(".game-frame").locator("#new-game").click()
    desktop.wait_for_timeout(300)
    desktop.keyboard.press("ArrowDown")
    desktop.wait_for_timeout(300)
    pause_label = desktop.frame_locator(".game-frame").locator("#pause-game").inner_text()
    frame_fit = snake_frame.evaluate("() => document.documentElement.scrollHeight <= window.innerHeight")
    body_overflow = desktop.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth + 1")

    tab_count = desktop.locator("#game-list a").count()
    h1_count = desktop.locator("h1").count()
    h4_count = desktop.locator("h4").count()
    iframe_count = desktop.locator(".game-frame").count()
    ad_count = desktop.locator(".ad-slot").count()
    active_count = desktop.locator("#game-list a.is-active").count()
    active_text = desktop.locator("#game-list a.is-active").inner_text() if active_count else ""
    record("desktop-tabs", tab_count)
    record("desktop-h1", h1_count)
    record("desktop-h4", h4_count)
    record("desktop-iframes", iframe_count)
    record("desktop-ad-slots", ad_count)
    record("desktop-active-tabs", active_count)
    record("desktop-active-text", active_text)
    record("desktop-inner-title", inner_title)
    record("desktop-pause-label", pause_label)
    record("desktop-frame-fit", frame_fit)
    record("desktop-body-overflow", body_overflow)

    desktop.locator(".game-shell").screenshot(path="visual-snake-desktop.png")

    desktop.evaluate("document.querySelector('.game-shell').requestFullscreen()")
    desktop.wait_for_function("document.fullscreenElement !== null", timeout=5000)
    desktop.wait_for_timeout(300)
    shell_box = desktop.locator(".game-shell").bounding_box()
    frame_box = desktop.locator(".game-frame").bounding_box()
    fullscreen_label = desktop.locator("#fullscreen-button").inner_text()
    fullscreen_fit = snake_frame.evaluate("() => document.documentElement.scrollHeight <= window.innerHeight")
    record("fullscreen-shell-height", shell_box["height"] if shell_box else 0)
    record("fullscreen-frame-height", frame_box["height"] if frame_box else 0)
    record("fullscreen-label", fullscreen_label)
    record("fullscreen-fit", fullscreen_fit)
    desktop.screenshot(path="visual-snake-fullscreen.png")
    desktop.evaluate("document.exitFullscreen()")
    desktop.wait_for_function("document.fullscreenElement === null", timeout=5000)
    desktop.close()

    viewport_fits = []
    viewport_dpad = {}
    for width, name in [(500, "500"), (768, "768"), (1024, "1024"), (1440, "1440")]:
        page = browser.new_page(viewport={"width": width, "height": 900})
        page_errors = []
        page.on("pageerror", lambda exc: page_errors.append(str(exc)))
        page.on("console", lambda msg: page_errors.append(msg.text) if msg.type == "error" else None)
        page.goto(snake_url, wait_until="domcontentloaded")
        page.wait_for_selector("#game-list a", timeout=5000)
        page.wait_for_timeout(400)
        page.locator(".game-frame").scroll_into_view_if_needed()
        page.frame_locator(".game-frame").locator("#game-canvas").wait_for(timeout=15000)
        page.wait_for_timeout(400)
        current_frame = next(f for f in page.frames if "assets/games/snake/index.html" in f.url)
        page_h1 = page.locator("h1").count()
        page_tabs = page.locator("#game-list a").count()
        page_iframe = page.locator(".game-frame").count()
        page_ads = page.locator(".ad-slot").count()
        page_fit = current_frame.evaluate("() => document.documentElement.scrollHeight <= window.innerHeight")
        page_overflows = page.evaluate("() => document.documentElement.scrollWidth <= window.innerWidth + 1")
        dpad_visible = page.frame_locator(".game-frame").locator(".dpad").is_visible()
        viewport_fits.append(page_fit)
        viewport_dpad[name] = dpad_visible
        record(f"viewport-{name}-h1", page_h1)
        record(f"viewport-{name}-tabs", page_tabs)
        record(f"viewport-{name}-iframe", page_iframe)
        record(f"viewport-{name}-ads", page_ads)
        record(f"viewport-{name}-frame-fit", page_fit)
        record(f"viewport-{name}-overflow", page_overflows)
        record(f"viewport-{name}-dpad-visible", dpad_visible)
        if page_errors:
            record(f"viewport-{name}-errors", " | ".join(page_errors))
            errors.extend(page_errors)
        page.screenshot(path=f"visual-snake-{name}.png", full_page=True)
        page.close()

    browser.close()

if errors or home_errors:
    record("errors", " | ".join(errors + home_errors))
    raise SystemExit(1)

if home_tabs != 7 or "/games/snake-unblocked.html" not in snake_href:
    raise SystemExit("home Snake navigation missing")
if tab_count != 7 or h1_count != 1 or h4_count != 0 or iframe_count != 1 or ad_count != 3:
    raise SystemExit("desktop structure check failed")
if active_count != 1 or "Snake Unblocked" not in active_text:
    raise SystemExit("Snake page active tab missing")
if "Greedy Snake" not in inner_title:
    raise SystemExit("Snake game inner title missing")
if not frame_fit:
    raise SystemExit("Snake iframe has internal vertical scrolling")
if not body_overflow:
    raise SystemExit("Snake page has horizontal overflow")
if fullscreen_label.lower() != "exit fullscreen":
    raise SystemExit("fullscreen button state missing")
if not shell_box or shell_box["height"] < 900 or not frame_box or frame_box["height"] < 700:
    raise SystemExit("fullscreen game area does not fill viewport")
if not fullscreen_fit:
    raise SystemExit("fullscreen Snake iframe has internal vertical scrolling")
if not all(viewport_fits):
    raise SystemExit("one or more Snake iframe viewports have internal vertical scrolling")
if not viewport_dpad["500"]:
    raise SystemExit("500px mobile D-pad is not visible")
if viewport_dpad["768"] or viewport_dpad["1024"] or viewport_dpad["1440"]:
    raise SystemExit("D-pad should be hidden on wider embedded layouts")

print("\n".join(results))
