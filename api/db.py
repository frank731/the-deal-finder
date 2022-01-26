from mongoengine import connect, Document, StringField, ListField
from bcrypt import checkpw

connect(host="mongodb+srv://frank:e3S6j3g2zUoujt0i@cluster0.uyivi.mongodb.net/test")


# sudo service mongod status

# [[option name,  price, vendor name, link, image link], [option name,  price, vendor name, link, image link]]


class User(Document):
    email = StringField()
    password = StringField()
    wishlist = ListField(StringField())


def add_user(email, password):
    # Check if email already exists in database
    if User.objects(email=email).first():
        return 'email already used'

    # Create user object in database with given email and password
    User(email=email, password=password).save()
    return 'success'

def login_user(email, password):
    user = User.objects(email=email).first()
    # Check if user in database
    if user:
        if checkpw(password.encode('utf8'), user.password.encode('utf8')):
            return "work"
        else:
            return "wrong"
    else:
        return "no email"

def remove_user(email):
    if not User.objects(email=email).first():
        return 'user not exist'

    User.objects(email=email).first().delete()
    return 'success'

def get_pw_hash(email):
    user = User.objects(email=email).first()
    # Check if user in database
    if user:
        return user.password
    else:
        return "no email"

def update_wishlist(email, wishlist):
    user = User.objects(email=email).first()
    # Check if user in database
    if user:
        # Set and save the wishlist
        user.wishlist = wishlist
        user.save()
        return "wishlist updated"
    else:
        return "no email"

def get_wishlist(email):
    user = User.objects(email=email).first()
    # Check if user in database
    if user:
        return user.wishlist
    else:
        return []

if __name__ == "__main__":
    update_wishlist("test1@gmail.com", ['New itesdfsm', 'New item s', 'New item', 'New items', 'dffgd ds', 'New itemsddsss'])

# [[option name,  price, vendor name, link, image link], [option name,  price, vendor name, link, image link]]
'''
def addItem(email, item_name, allOptions):
    user = User.objects(email=email).first()
    if not user:
        return 'user not exist'
    watchList = user.watchList
    for item in watchList:
        if item.item_name == item_name:
            # replace all options for existing items
            for i in range(len(item.options)):
                item.options.pop(0)
            for opt in allOptions:
                temp = Option(optionName=opt[0], price=opt[1], supplier=opt[2], link=opt[3], imageLink=opt[4])
                item.options.append(temp)
            item.cheapest_option = item.options[0]
            user.save()

            return 'item options renewed'

    item = Item(item_name=item_name)

    for opt in allOptions:
        temp = Option(optionName=opt[0], price=opt[1], supplier=opt[2], link=opt[3], imageLink=opt[4])
        item.options.append(temp)
    item.cheapest_option = item.options[0]
    watchList.append(item)
    user.save()
    return 'item added into watch list'


def removeItem(email, item_name):
    user = User.objects(email=email).first()
    if not user:
        return 'user does not exist'

    watchList = user.watchList
    for i in range(len(watchList)):
        if watchList[i].item_name == item_name:
            watchList.pop(i)
            user.save()
            return 'item removed from watch list'

    return 'item not found in watch list'


# [[option name,  price, vendor name, link, image link], [option name,  price, vendor name, link, image link]]

def getWatchList(email):
    user = User.objects(email=email).first()
    if not user:
        return 'user not found'

    temp_watchlist = []
    for item in user.watchList:
        temp_item = {}
        temp_item['item_name'] = item.item_name
        temp_item['options'] = []
        for option in item.options:
            temp_option = {}
            temp_option['option_name'] = option.optionName
            temp_option['price'] = option.price
            temp_option['supplier'] = option.supplier
            temp_option['link'] = option.link
            temp_option['image_link'] = option.imageLink

            temp_item['options'].append(temp_option)

        temp_watchlist.append(temp_item)

    return temp_watchlist


def updateWatchList():
    allUser = []
    for user in User.objects():
        temp_user = {}
        temp_user['email'] = user.email
        temp_watch = []
        for item in user.watchList:
            temp_item = {}
            temp_item['item_name'] = item.item_name
            temp_item['option_count'] = len(item.options)
            temp_watch.append(temp_item)
            # temp_watch.append(item.item_name)
        temp_user['items'] = temp_watch
        allUser.append(temp_user)
    return allUser


def getCheapestOption(email, item_name):
    user = User.objects(email=email).first()
    if not user:
        return 'user not exist'
    watch_list = user.watchList
    for item in watch_list:
        if item.item_name == item_name:
            return item.cheapest_option
    return None

'''