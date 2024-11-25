from django.contrib.auth.models import User
from rest_framework import serializers

from api.models import Genre, Movie, History, Wishlist, Favorite



class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['first_name', 'last_name','username','email','password']
        extra_kwargs = {"password": {"write_only": True}}
    
    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user
class GenreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Genre
        fields = ['id', 'name']

class MovieSerializer(serializers.ModelSerializer):
    #genres = serializers.PrimaryKeyRelatedField(queryset=Genre.objects.all(), many=True)
    genres = GenreSerializer(many=True)
    class Meta:
        model = Movie
        fields = ['id', 'title', 'synopsis', 'director', 'rating', 'release_year', 'genres','image','created_at']

class HistorySerializer(serializers.ModelSerializer):
    movie = MovieSerializer()

    class Meta:
        model = History
        fields = ['id', 'movie', 'added_at']

class WishlistSerializer(serializers.ModelSerializer):
    movie = MovieSerializer()

    class Meta:
        model = Wishlist
        fields = ['id', 'movie', 'added_at']


class FavoriteSerializer(serializers.ModelSerializer):
    movie = MovieSerializer(read_only=True)

    class Meta:
        model = Favorite
        fields = ['id', 'movie', 'added_at']