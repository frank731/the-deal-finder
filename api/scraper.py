import re
from msedge.selenium_tools import Edge
from msedge.selenium_tools import EdgeOptions
from bs4 import BeautifulSoup
import time
from webdriver_manager.microsoft import EdgeChromiumDriverManager
import logging

PRICE_INDEX = 1
RATING_INDEX = 2

rating_multiplier = 100

options = EdgeOptions()
options.use_chromium = True
options.add_argument('headless')
options.add_argument('disable-gpu')
driver = Edge(EdgeChromiumDriverManager(log_level=logging.ERROR).install(), options=options)

def fetch_site_source(url):
    """
    Returns source code for specified url
    """
    # Load the given page using the specified url
    driver.get(url)
    # Give time for elements to load
    time.sleep(1)
    # Scroll down to bottom of page to load every element for pages that load on scroll
    for scroll in range(100):
        driver.execute_script("window.scrollBy(0, 150);")
        # Give time for elements to load
        time.sleep(0.01)
    # Return page source
    return driver.page_source


# Sourced from https://stackoverflow.com/questions/1007481/how-to-replace-whitespaces-with-underscore
def urlify(s):
    """
    Converts the product name into the suitable format for a url.
    """

    # Remove all non-word characters (everything except numbers and letters)
    s = re.sub(r"[^\w\s]", '', s)

    # Replace all runs of whitespace with a +
    s = re.sub(r"\s+", '+', s)

    return s


def get_better_product(cur_best, new_item):
    """
    Determines which of the two items is better according to an equation.
    cur_best should be the original best item as the function will check if it is equal to the flag value, which is empty
    """

    # If the current best element is not set 
    if len(cur_best) == 0:
        return new_item
    else:
        try:
            return new_item if (cur_best[RATING_INDEX] * rating_multiplier - cur_best[PRICE_INDEX]
             < new_item[RATING_INDEX] * rating_multiplier - new_item[PRICE_INDEX]) else cur_best
        except IndexError:
            return cur_best

def get_soup(product, address, urlend=""):
    """
    Returns the BeautifulSoup object for given product and site
    """
    # Convert search to url formatted string
    product = urlify(product)

    # Create searchable url
    address += product

    # Converts page info into a BeautifulSoup object that can be scraped
    return BeautifulSoup(fetch_site_source(address + urlend), "html.parser")


def get_amazon_results(product):
    """
    Returns the best product from Best Buy with the inputted product to search for
    """
    # Get soup object from site source
    soup = get_soup(product, "https://www.amazon.ca/s?k=", "&s=relevance")

    best_item = []
    # Get first 10 items, most relevant
    for poss_item in soup.find_all("div", {"data-component-type": "s-search-result"})[:10]:
        try:
            # Get the image url, name, link, and price
            item_img = poss_item.find("img", class_="s-image")["src"]
            item_name = poss_item.find("span", class_="a-size-base-plus a-color-base a-text-normal").text
            # Link is relative so need to add beginning manually
            item_link = "https://www.amazon.ca/" + poss_item.find("a", class_=["a-link-normal"])["href"]
            # Convert price from string to float
            item_price = float(re.sub(r'[^\d.]', '', poss_item.find("span", class_="a-offscreen").text))
            # Rating in format "x out of 5 stars", split by whitespace and get first element to get rating
            item_rating = float(poss_item.find("span", class_="a-icon-alt").text.split()[0])
            best_item = get_better_product(best_item, [item_name, item_price, item_rating, item_img, item_link])
            
        except (AttributeError, TypeError):
            print("Skipped non item")

    return best_item


def get_best_buy_results(product):
    """
    Returns the best product from Best Buy with the inputted product to search for
    """
    soup = get_soup(product, "https://www.bestbuy.ca/en-ca/search?search=")

    best_item = []

    # Gets first 10 items under their container with the specified class name
    for poss_item in soup.find_all("div", class_=["x-productListItem"])[:10]:
        try:
            # Get the image url, name, link, and price
            item_img = poss_item.find("img", class_="productItemImage_1en8J", itemprop="image")["src"]
            item_name = poss_item.find("div", class_="productItemName_3IZ3c", itemprop="name").text
            # Link is relative so need to add beginning manually
            item_link = "https://www.bestbuy.ca/" + poss_item.find("a", class_="link_3hcyN", itemprop="url")["href"]
            # Remove $ from beginning
            item_price = float(re.sub(r'[^\d.]', '', poss_item.find("span", class_="screenReaderOnly_3anTj large_3aP7Z").text))
            item_rating = float(poss_item.find("meta", itemprop="ratingValue")["content"])
            best_item = get_better_product(best_item, [item_name, item_price, item_rating, item_img, item_link])
        except (AttributeError, TypeError):
            print("Skipped non item")
    return best_item

def get_google_shopping_results(product):
    """
    Returns the best product from Google Shopping with the inputted product to search for
    """
    soup = get_soup(product, "https://www.google.com/search?q=", "&tbm=shop")

    best_item = []
    # Check for grid layout instead of column
    use_grid = False
    if soup.find("div", class_=["sh-pr__product-results-grid"]) != None:
        use_grid = True

    # Gets first 10 items under their container with the specified class name
    for poss_item in soup.find_all("div", class_=["sh-dlr__content"])[:10]:
        try:
            # Get the image url, name, link, and price
            # Image has no specified class so need to find its parent
            item_img = poss_item.find("div", class_="ArOc1c").find("img", recursive=False)["src"] if use_grid else poss_item.find("img", class_="TL92Hc")["src"]
            item_name = poss_item.find("h4", class_="Xjkr3b").text if use_grid else poss_item.find("h3", class_="OzIAJc").text
            # Link is relative so need to add beginning manually
            item_link = "https://www.google.com/" + poss_item.find("a", class_=["Lq5OHe", "eaGTj"])["href"] if use_grid else poss_item.find("a", class_=["VZTCjd"])["href"]
            # Remove $ from beginning
            item_price = float(re.sub(r'[^\d.]', '', poss_item.find("span", class_=["a8Pemb", "OFFNJ"]).text))
            item_rating = poss_item.find("span", class_="Rsc7Yb").text
            # Check if item has no rating
            if item_rating == None:
                item_rating = 0
            else:
                item_rating = float(item_rating)
            best_item = get_better_product(best_item, [item_name, item_price, item_rating, item_img, item_link])
        except (AttributeError, TypeError):
            print("Skipped non item")

    return best_item

def get_best_result(product):
    """
    Returns the best product from Best Buy, Amazon, and Google Shopping
    """

    global rating_multiplier, driver
    # Reset rating multiplier
    rating_multiplier = 100
    best_item = []
    best_item = get_better_product(best_item, get_amazon_results(product))
    # Base rating constant on amazon price, since amazon most broad. Prevents buying accessories that are much cheaper but usually have no rating
    try:
        rating_multiplier = max(rating_multiplier, best_item[PRICE_INDEX])
    except IndexError:
        print("No amazon results")
    best_item = get_better_product(best_item, get_best_buy_results(product))
    best_item = get_better_product(best_item, get_google_shopping_results(product))
    return best_item

if __name__ == "__main__":
    wanted = "ideapad l340"#input("What product do you want?")
    print(get_best_result(wanted))