from playwright.sync_api import sync_playwright

results = []
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    errors = []
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.on("pageerror", lambda exc: errors.append(str(exc)))
    page.goto("http://127.0.0.1:8765/", wait_until="domcontentloaded")
    page.wait_for_selector("#game-list a", timeout=5000)
    page.wait_for_timeout(500)
    page.locator(".game-frame").scroll_into_view_if_needed()
    page.wait_for_timeout(4500)

    h1_count = page.locator("h1").count()
    h4_count = page.locator("h4").count()
    tab_count = page.locator("#game-list a").count()
    iframe_count = page.locator(".game-frame").count()
    ad_count = page.locator(".ad-slot").count()
    overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
    game_frame_src = page.locator(".game-frame").get_attribute("src") or ""

    results.append(f"desktop h1={h1_count} h4={h4_count} tabs={tab_count} iframes={iframe_count} ads={ad_count} overflow={overflow}")
    results.append(f"game-src={game_frame_src}")

    page.locator(".fullscreen-button").click()
    page.wait_for_timeout(300)
    fullscreen_label = page.locator("#fullscreen-button").inner_text()
    results.append(f"fullscreen-label={fullscreen_label!r}")
    page.locator(".fullscreen-button").click()

    mobile = browser.new_page(viewport={"width": 390, "height": 844})
    mobile.goto("http://127.0.0.1:8765/", wait_until="domcontentloaded")
    mobile.wait_for_selector("#game-list a", timeout=5000)
    mobile.wait_for_timeout(500)
    mobile_h1 = mobile.locator("h1").count()
    mobile_tabs = mobile.locator("#game-list a").count()
    results.append(f"mobile h1={mobile_h1} tabs={mobile_tabs}")
    browser.close()

    print("\n".join(results))
    if errors:
        print("PAGE_ERRORS=" + " | ".join(errors))
        raise SystemExit(1)
    if h1_count != 1 or h4_count != 0 or tab_count != 422 or iframe_count != 1 or ad_count != 3 or overflow > 2:
        raise SystemExit("desktop structural check failed")
    if "minecraft-free-online.github.io" not in game_frame_src:
        raise SystemExit("home Minecraft iframe missing")
    if fullscreen_label.lower() != "exit fullscreen":
        raise SystemExit("fullscreen state not updated")
    if mobile_h1 != 1 or mobile_tabs != 422:
        raise SystemExit("mobile structural check failed")
