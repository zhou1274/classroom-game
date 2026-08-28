from playwright.sync_api import sync_playwright

results = []

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)

    errors = []
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
    page.goto("http://127.0.0.1:8765/", wait_until="domcontentloaded")
    page.wait_for_selector("#game-list a", timeout=5000)
    page.wait_for_timeout(500)

    h1_count = page.locator("h1").count()
    h4_count = page.locator("h4").count()
    tab_count = page.locator("#game-list a").count()
    iframe_count = page.locator(".game-frame").count()
    page.locator(".game-frame").wait_for(state="visible", timeout=10000)
    game_frame_src = page.locator(".game-frame").get_attribute("src")
    game_frame_title = page.frame_locator(".game-frame").locator("h1").inner_text(timeout=10000)
    game_frame = page.frame_locator(".game-frame")
    game_frame.locator(".tile-container .tile").first.wait_for(timeout=10000)
    game_frame_obj = next(f for f in page.frames if "/assets/games/2048/index.html" in f.url)
    game_scroll_fit = game_frame_obj.evaluate("() => document.documentElement.scrollHeight <= window.innerHeight")
    results.append(f"game-scroll-fit={game_scroll_fit}")
    game_tiles_before = game_frame.locator(".tile-container .tile").count()
    game_frame.locator(".container").click()
    page.keyboard.press("ArrowLeft")
    page.keyboard.press("ArrowRight")
    page.wait_for_timeout(300)
    game_tiles_after = game_frame.locator(".tile-container .tile").count()
    results.append(f"game-tiles-before={game_tiles_before} game-tiles-after={game_tiles_after}")
    results.append(f"game-src={game_frame_src} game-inner-title={game_frame_title!r}")
    ad_count = page.locator(".ad-slot").count()

    results.append(f"desktop h1={h1_count} h4={h4_count} tabs={tab_count} iframes={iframe_count} ad-slots={ad_count}")

    coming = page.get_by_text("Coming Soon", exact=False).first
    # The first matching text may be inside a tab; click the Minecraft tab by link text.
    page.locator("#game-list a", has_text="Minecraft Unblocked").click(force=True)
    page.wait_for_timeout(300)
    toast = page.locator(".toast")
    toast_text = toast.inner_text() if toast.count() else ""
    results.append(f"coming-soon-toast={toast_text!r}")

    page.evaluate("document.querySelector(\".toast\")?.remove()")
    page.screenshot(path="visual-desktop.png", full_page=True)
    page.evaluate("document.querySelector('.game-shell').requestFullscreen()")
    page.wait_for_function("document.fullscreenElement !== null", timeout=5000)
    page.wait_for_timeout(300)
    fullscreen_shell = page.locator(".game-shell").bounding_box()
    fullscreen_frame = page.locator(".game-frame").bounding_box()
    fullscreen_label = page.locator("#fullscreen-button").inner_text()
    fullscreen_fit = game_frame_obj.evaluate("() => document.documentElement.scrollHeight <= window.innerHeight")
    results.append(f"fullscreen-shell={fullscreen_shell} fullscreen-frame={fullscreen_frame} label={fullscreen_label!r} fit={fullscreen_fit}")
    page.screenshot(path="visual-fullscreen.png", full_page=False)
    page.evaluate("document.exitFullscreen()")
    page.wait_for_function("document.fullscreenElement === null", timeout=5000)

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.goto("http://127.0.0.1:8765/", wait_until="domcontentloaded")
    mobile.wait_for_selector("#game-list a", timeout=5000)
    mobile.wait_for_timeout(500)
    mobile.locator(".game-frame").wait_for(state="visible", timeout=10000)
    mobile_src = mobile.locator(".game-frame").get_attribute("src")
    results.append(f"mobile-game-src={mobile_src}")
    mobile_h1 = mobile.locator("h1").count()
    mobile_tabs = mobile.locator("#game-list a").count()
    results.append(f"mobile h1={mobile_h1} tabs={mobile_tabs}")
    mobile.screenshot(path="visual-mobile.png", full_page=True)

    browser.close()

    print("\n".join(results))
    if errors:
        print("CONSOLE_ERRORS=" + " | ".join(errors))
        raise SystemExit(1)

    if h1_count != 1 or h4_count != 0 or tab_count != 10 or iframe_count != 1 or ad_count != 3:
        raise SystemExit("desktop structural check failed")
    if "assets/games/2048/index.html" not in game_frame_src:
        raise SystemExit("local game iframe missing")
    if "2048" not in game_frame_title.lower():
        raise SystemExit("local game title missing")
    if game_tiles_after < game_tiles_before:
        raise SystemExit("2048 interaction did not produce a new tile state")
    if not game_scroll_fit:
        raise SystemExit("2048 iframe has internal vertical scrolling")
    if not fullscreen_shell or fullscreen_shell["height"] < 900 or not fullscreen_frame or fullscreen_frame["height"] < 700:
        raise SystemExit("fullscreen game area does not fill the viewport")
    if fullscreen_label.lower() != "exit fullscreen":
        raise SystemExit("fullscreen button state is not updated")
    if not fullscreen_fit:
        raise SystemExit("fullscreen game iframe has internal vertical scrolling")
    if mobile_h1 != 1 or mobile_tabs != 10:
        raise SystemExit("mobile structural check failed")
    if "coming soon" not in toast_text.lower():
        raise SystemExit("coming soon feedback missing")
