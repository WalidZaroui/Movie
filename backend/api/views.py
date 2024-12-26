from django.contrib.auth.models import User
from rest_framework import generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Movie, Genre, History, Wishlist, Favorite
from .serializers import MovieSerializer, GenreSerializer, WishlistSerializer, FavoriteSerializer, HistorySerializer, UserSerializer
import logging

from api import serializers
# View for listing and creating movies
class MovieListCreateView(generics.ListCreateAPIView):
    queryset = Movie.objects.all().order_by('-created_at')
    serializer_class = MovieSerializer
    permission_classes = [AllowAny]

# View for retrieving, updating, and deleting a single movie
class MovieDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer
    permission_classes = [IsAuthenticated]  # Change to IsAuthenticated if needed

class GenreListView(generics.ListCreateAPIView):
    queryset = Genre.objects.all()
    serializer_class = GenreSerializer
    permission_classes = [IsAuthenticated]

class WishlistListView(generics.ListAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

class FavoriteListView(generics.ListAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Favorite.objects.filter(user=self.request.user)

class HistoryListView(generics.ListAPIView):
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return History.objects.filter(user=self.request.user)

class AddToWishlistView(generics.CreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        movie_id = self.kwargs['movie_id']
        user = self.request.user
        try:
            movie = Movie.objects.get(id=movie_id)
            
            serializer.save(user=user, movie=movie)
        except Movie.DoesNotExist:
            raise serializers.ValidationError({"movie": "Movie not found."})

class RemoveFromWHistory(generics.DestroyAPIView):
    serializer_class = HistorySerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'movie_id'

    def get_queryset(self):
        user = self.request.user
        movie_id = self.kwargs['movie_id']
        logger.debug(f"Removing history item for user: {user}, movie_id: {movie_id}")
        return History.objects.filter(user=user, movie_id=movie_id)

class RemoveFromWishlistView(generics.DestroyAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'movie_id'

    def get_queryset(self):
        user = self.request.user
        movie_id = self.kwargs['movie_id']
        logger.debug(f"Removing wishlist item for user: {user}, movie_id: {movie_id}")
        return Wishlist.objects.filter(user=user, movie_id=movie_id)

logger = logging.getLogger(__name__)

class AddToFavoriteView(generics.CreateAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        movie_id = self.kwargs['movie_id']
        user = self.request.user
        try:
            movie = Movie.objects.get(id=movie_id)
            # Save the serializer instance with user and movie
            serializer.save(user=user, movie=movie)
        except Movie.DoesNotExist:
            raise serializers.ValidationError({"movie": "Movie not found."})
        
class RemoveFromFavoriteView(generics.DestroyAPIView):
    serializer_class = FavoriteSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = 'movie_id'
    def get_queryset(self):
        user = self.request.user
        movie_id = self.kwargs['movie_id']
        logger.debug(f"Removing favorite for user: {user}, movie_id: {movie_id}")
        return Favorite.objects.filter(user=user, movie_id=movie_id)

class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user
    
class AllUsersView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated] 