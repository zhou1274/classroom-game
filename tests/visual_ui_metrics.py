from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})

    page.goto("http://127.0.0.1:8765/privacy-policy.html", wait_until="domcontentloaded")
    page.wait_for_timeout(300)
    privacy_padding = page.evaluate("getComputedStyle(document.body).paddingLeft")
    header_box = page.locator(".site-header").bounding_box()
    card_box = page.locator(".legal-card").bounding_box()
    privacy_links = page.locator('a[href="privacy-policy.html"]').count()
    cookie_links = page.locator(".cookie-note a").count()
    footer_links = page.locator(".site-footer nav a").count()
    print(f"privacy: padding={privacy_padding} header_x={header_box['x']:.0f} card_x={card_box['x']:.0f} privacy_links={privacy_links} cookie_links={cookie_links} footer_links={footer_links}")

    page.goto("http://127.0.0.1:8765/", wait_until="domcontentloaded")
    page.wait_for_timeout(300)
    home_padding = page.evaluate("getComputedStyle(document.body).paddingLeft")
    home_privacy_links = page.locator('a[href="privacy-policy.html"]').count()
    home_cookie_links = page.locator(".cookie-note a").count()
    home_footer_links = page.locator(".site-footer nav a").count()
    print(f"home: padding={home_padding} privacy_links={home_privacy_links} cookie_links={home_cookie_links} footer_links={home_footer_links}")

    browser.close()

    if privacy_padding != "0px" or privacy_links != 1 or cookie_links != 0 or footer_links != 5:
        raise SystemExit("compliance/footer UI metric check failed")
    if home_privacy_links != 1 or home_cookie_links != 0 or home_footer_links != 5:
        raise SystemExit("home footer UI metric check failed")

print("PASS: UI layout metrics")
