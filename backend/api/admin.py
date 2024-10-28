from django.contrib import admin

from api.models import Genre, Movie, History, Wishlist, Favorite

# Register your models here.
admin.site.register(Genre)
admin.site.register(Movie)
admin.site.register(History)
admin.site.register(Wishlist)
admin.site.register(Favorite)


