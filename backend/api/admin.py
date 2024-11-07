from django.contrib import admin

from api.models import Genre, Movie, History, Wishlist, Favorite

# Register your models here.
class MovieAdmin(admin.ModelAdmin):
    list_display = ('title', 'director', 'release_year', 'rating', 'image')
    search_fields = ('title', 'director')
admin.site.register(Genre)
admin.site.register(Movie, MovieAdmin)
admin.site.register(History)
admin.site.register(Wishlist)
admin.site.register(Favorite)


