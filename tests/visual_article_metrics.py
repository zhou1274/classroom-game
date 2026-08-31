from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.goto("http://127.0.0.1:8765/best-unblocked-games-for-school.html", wait_until="domcontentloaded")
    page.wait_for_timeout(300)
    body_pad = page.evaluate("getComputedStyle(document.body).paddingLeft")
    header_x = page.locator(".site-header").bounding_box()["x"]
    guides_display = page.evaluate("getComputedStyle(document.querySelector('.footer-guides')).display")
    guides_ul = page.evaluate("getComputedStyle(document.querySelector('.footer-guides ul')).display")
    guides_links = page.locator(".footer-guides a").count()
    overflow = page.evaluate("document.documentElement.scrollWidth - document.documentElement.clientWidth")
    print(f"article: pad={body_pad} header_x={header_x:.0f} guides_display={guides_display} ul={guides_ul} links={guides_links} overflow={overflow}")
    browser.close()
    if body_pad != "0px" or header_x != 0 or guides_display != "flex" or guides_ul != "contents" or guides_links != 5 or overflow > 2:
        raise SystemExit("article/footer UI metrics failed")
print("PASS: article and footer guides layout")
