"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.conf import settings
from django.conf.urls.static import static
from django.contrib import admin
from django.urls import path,include
from api.views import  (
    GenreListView, WishlistListView, FavoriteListView, HistoryListView,
    AddToWishlistView, AddToFavoriteView,
      RemoveFromFavoriteView, CreateUserView,UserProfileView,AllUsersView,
      MovieDetailView,MovieListCreateView,RemoveFromWishlistView
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path('api/users/', AllUsersView.as_view(), name='all-users'),
    path('api/user-profile/', UserProfileView.as_view(), name='user-profile'),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path('api/movies/', MovieListCreateView.as_view(), name='movie-list-create'),
    path('api/movies/<int:pk>/', MovieDetailView.as_view(), name='movie-detail'),
    path('api/genres/', GenreListView.as_view(), name='genre-list'),
    path('api/wishlist/', WishlistListView.as_view(), name='wishlist-list'),
    path('api/favorites/', FavoriteListView.as_view(), name='favorite-list'),
    path('api/history/', HistoryListView.as_view(), name='history-list'),
    path('api/wishlist/<int:movie_id>/add/', AddToWishlistView.as_view(), name='add-to-wishlist'),
    path('api/wishlist/<int:movie_id>/remove/', RemoveFromWishlistView.as_view(), name='remove-from-wishlist'),  # New path
    path('api/favorites/<int:movie_id>/add/', AddToFavoriteView.as_view(), name='add-to-favorites'),
    path('api/favorites/<int:movie_id>/remove/', RemoveFromFavoriteView.as_view(), name='remove-from-favorites'),
]

# Serve media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)