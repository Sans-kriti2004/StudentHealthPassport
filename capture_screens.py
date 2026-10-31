import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By

options = Options()
options.add_argument('--headless')
options.add_argument('--disable-gpu')
options.add_argument('--window-size=1280,950')
options.add_argument('--hide-scrollbars')

driver = webdriver.Chrome(options=options)
try:
    url = 'file:///C:/Users/HP/Desktop/StudentHealthPassport/index.html'
    driver.get(url)
    time.sleep(1.5)

    # Check for browser console errors
    logs = driver.get_log('browser')
    print(f"Browser console log count: {len(logs)}")
    for log in logs:
        if log['level'] in ['SEVERE', 'ERROR']:
            print("  Console Error:", log)

    # 1. Capture Screen 2: 1-Card Health Passport (current default tab)
    screen2_path = r'C:\Users\HP\Desktop\StudentHealthPassport\screen2_one_card.png'
    driver.execute_script("window.scrollTo(0, 0);")
    time.sleep(0.5)
    driver.save_screenshot(screen2_path)
    print("Saved Screen 2 screenshot:", screen2_path)

    # 2. Capture Screen 1: Nurse Emergency Station (Directory / Search Screen)
    driver.execute_script("window.appSwitchTab('nurse-station');")
    time.sleep(1.0)
    driver.execute_script("window.scrollTo(0, 0);")
    screen1_path = r'C:\Users\HP\Desktop\StudentHealthPassport\screen1_search_directory.png'
    driver.save_screenshot(screen1_path)
    print("Saved Screen 1 screenshot:", screen1_path)

    # 3. Capture Screen 3: Annual Nurse Update Form
    driver.execute_script("window.appSwitchTab('annual-update');")
    time.sleep(1.0)
    driver.execute_script("window.scrollTo(0, 0);")
    screen3_path = r'C:\Users\HP\Desktop\StudentHealthPassport\screen3_nurse_update_form.png'
    driver.save_screenshot(screen3_path)
    print("Saved Screen 3 screenshot:", screen3_path)

    print("ALL 3 SCREENSHOTS CAPTURED PERFECTLY!")
finally:
    driver.quit()
