from django.contrib.auth.models import User
from django.db import models

class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

class Movie(models.Model):
    title = models.CharField(max_length=255)
    synopsis = models.TextField()
    director = models.CharField(max_length=100)
    rating = models.FloatField()
    release_year = models.IntegerField()
    genres = models.ManyToManyField(Genre, related_name='movies')  # Many-to-many relationship with Genre
    image = models.ImageField(upload_to='movies/', blank=True, null=True)  # Image field
    created_at = models.DateTimeField(auto_now_add=True) 
    def __str__(self):
        return self.title

class History(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"

class Wishlist(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"
