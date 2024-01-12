from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from webdriver_manager.chrome import ChromeDriverManager
from bs4 import BeautifulSoup
import time
from datetime import datetime, timedelta
import re

service = Service(ChromeDriverManager().install())
driver = webdriver.Chrome(service=service)

url = 'https://github.com/SimplifyJobs/Summer2024-Internships'
driver.get(url)
time.sleep(1)
html_content = driver.page_source
driver.quit()

soup = BeautifulSoup(html_content, 'html.parser')
table = soup.find_all('table')[1]
rows = table.find_all('tr')

current_year = datetime.now().year

# Now that we have a datetime object, we can compare it
ten_days_ago = datetime.now() - timedelta(days=10)

arr = []
for row in rows:
    a_tag = row.find('a')
    if a_tag and 'href' in a_tag.attrs:
        company_url = a_tag['href']
    else:
        company_url = ""

    a_tag = row.find('a')
    company_name = a_tag.get_text() if a_tag else ""

    first_td = row.find('td')
    second_td = first_td.find_next_sibling('td') if first_td else None
    job_title = second_td.get_text() if second_td else None

    first_td = row.find('td')
    second_td = first_td.find_next_sibling('td') if first_td else None
    third_td = second_td.find_next_sibling('td') if second_td else None
    location = third_td.get_text() if third_td else None

    td_elements = row.find_all('td')
    date_posted = td_elements[-1].get_text() if td_elements else None
    pattern = r'\b[A-Z][a-z]{2} \d+\b'

    match = re.search(pattern, date_posted) if date_posted else False
    if match: 
        if len(match.group(1)) == 4:
            break

    if date_posted:
        date_posted = datetime.strptime(f'{date_posted} {current_year}', '%b %d %Y')
        is_recent = date_posted > ten_days_ago
        if date_posted > ten_days_ago:
            arr.append(company_name + ": " + company_url + " (Location:" + location + ")")

for i in arr:
    print(i)
    print()


    

    



        


