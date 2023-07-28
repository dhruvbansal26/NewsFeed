import requests
from bs4 import BeautifulSoup
import json

def scrape_news():
    yahoo_results = []
    yahoo_url = "https://finance.yahoo.com/topic/stock-market-news/"
    yahoo_page = requests.get(yahoo_url).text
    yahoo_doc = BeautifulSoup(yahoo_page, 'html.parser')
    yahoo_parent_elements = yahoo_doc.find_all("ul", class_="My(0) P(0) Wow(bw) Ov(h)")
    id_counter = 1  # Initialize ID counter

    for parent in yahoo_parent_elements:
        children = parent.find_all("li", class_='js-stream-content')
        for child in children:
            heading = child.find("h3")
            description_elements = child.find_all("p")
            description = "..".join([i.text for i in description_elements])

            url = "https://finance.yahoo.com/" + heading.find("a")['href']
            title = heading.text
            stock_link = child.find('a')['href']

            entry = {
                'ID': id_counter,
                'Title': title,
                'URL': url,
                'Description': description + "..",
            }
            if '?' in stock_link:
                stock_parts = stock_link.split('?')
                entry['Stock'] = stock_parts[0]  # Use the first part of the stock link
            yahoo_results.append(entry)
            id_counter += 1

    market_watch_results = []
    market_watch_url = "https://www.marketwatch.com/latest-news"
    market_watch_page = requests.get(market_watch_url).text
    market_watch_doc = BeautifulSoup(market_watch_page, 'html.parser')
    existing_titles = set()
    primary_parent = market_watch_doc.find("div", class_="column column--primary")
    primary_headlines = primary_parent.find_all(class_='article__headline')
    for headline in primary_headlines:
        title = headline.text.strip()
        if title in existing_titles:
            entry = {
                'ID': id_counter,
                'Title': title,
                'URL': headline.find("a")["href"],
            }
        else:
            existing_titles.add(title)
            newline_index = title.find('\n')
            if newline_index != -1:
                title = title[newline_index+1:].strip()
            entry = {
                'ID': id_counter,
                'Title': title,
                'URL': headline.find("a")["href"],
            }
        market_watch_results.append(entry)
        id_counter += 1  # Increment ID counter

    aside_parent = market_watch_doc.find("div", class_="column column--aside")
    aside_headlines = aside_parent.find_all(class_='article__headline')
    for headline in aside_headlines:
        title = headline.text.strip()
        if title in existing_titles:
            entry = {
                'ID': id_counter,
                'Title': title,
                'URL': headline.find("a")["href"],
            }
        else:
            existing_titles.add(title)
            newline_index = title.find('\n')
            if newline_index != -1:
                title = title[newline_index+1:].strip()
            entry = {
                'ID': id_counter,
                'Title': title,
                'URL': headline.find("a")["href"],
            }
        market_watch_results.append(entry)
        id_counter += 1  # Increment ID counter

    collection_elements = market_watch_doc.find("div", class_="collection__elements")
    collection_headlines = collection_elements.find_all(class_='article__headline')
    for headline in collection_headlines:
        title = headline.text.strip()
        if title in existing_titles:
            entry = {
                'ID': id_counter,
                'Title': title,
                'URL': headline.find("a")["href"],
            }
        else:
            existing_titles.add(title)
            newline_index = title.find('\n')
            if newline_index != -1:
                title = title[newline_index+1:].strip()
            entry = {
                'ID': id_counter,
                'Title': title,
                'URL': headline.find("a")["href"],
            }
        market_watch_results.append(entry)
        id_counter += 1  # Increment ID counter

    all_results = yahoo_results + market_watch_results
    results = json.dumps(all_results, indent=4)
    return results

final_data = scrape_news()
print(final_data)
