import os
from playwright.sync_api import sync_playwright

def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={'width': 1280, 'height': 800})
        page.goto('http://127.0.0.1:5000')
        page.wait_for_timeout(1000)
        page.screenshot(path='homepage_store.png')
        print("Saved screenshot to homepage_store.png")
        browser.close()

if __name__ == '__main__':
    run()
