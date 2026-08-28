from playwright.sync_api import sync_playwright

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={"width": 1440, "height": 1000})
    page.goto("http://127.0.0.1:8765/", wait_until="domcontentloaded")
    page.wait_for_selector("#game-list a", timeout=5000)
    page.wait_for_timeout(300)

    empty_boxes = [page.locator(".ad-slot").nth(i).bounding_box() for i in range(3)]
    empty_heights = [box["height"] for box in empty_boxes]
    empty_margins = page.evaluate(
        "Array.from(document.querySelectorAll('.ad-slot')).map(el => getComputedStyle(el).marginTop)"
    )

    page.evaluate("""
        const slot = document.querySelector('.ad-slot');
        const ins = document.createElement('ins');
        ins.className = 'adsbygoogle';
        slot.append(ins);
    """)
    filled_box = page.locator(".ad-slot").first.bounding_box()
    filled_margin = page.evaluate(
        "getComputedStyle(document.querySelector('.ad-slot')).marginTop"
    )

    print(f"empty_heights={empty_heights} empty_margins={empty_margins}")
    print(f"filled_height={filled_box['height']} filled_margin={filled_margin}")

    browser.close()

    if any(height > 1 for height in empty_heights):
        raise SystemExit("empty ad slots still occupy layout height")
    if filled_box["height"] < 90 or filled_margin != "16px":
        raise SystemExit("ad slot does not restore reserved space after ad unit insertion")

print("PASS: empty ad slots do not affect layout")
