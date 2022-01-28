from mongoengine import connect, Document, StringField, ListField

connect(host="mongodb+srv://frank:e3S6j3g2zUoujt0i@cluster0.uyivi.mongodb.net/test")

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

def check_user_exists(email):
    user = User.objects(email=email).first()
    # Check if user in database
    if user:
        return True
    else:
        return False

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
