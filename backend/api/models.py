from django.contrib.auth.models import User
from django.db import models
from datetime import date
from django.core.exceptions import ValidationError
from django.core.validators import MinValueValidator, MaxValueValidator
class Genre(models.Model):
    name = models.CharField(max_length=50, unique=True)

    def __str__(self):
        return self.name

def validate_release_year(value):
    current_year = date.today().year
    if value > current_year:
        raise ValidationError('Release year cannot be in the future.')

class Movie(models.Model):
    title = models.CharField(max_length=255)
    synopsis = models.TextField()
    director = models.CharField(max_length=100)
    rating = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(10.0)]  # Ensure rating is between 0 and 10
    )
    release_year = models.IntegerField(validators=[validate_release_year])
    genres = models.ManyToManyField(Genre, related_name='movies')  # Many-to-many relationship with Genre
    image = models.ImageField(upload_to='movies/', blank=True, null=True)  # Image field
    created_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        ordering = ['-created_at'] # Orders by added_at date in descending order
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
    class Meta:
        unique_together = ('user', 'movie')
    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"

class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    movie = models.ForeignKey(Movie, on_delete=models.CASCADE)
    added_at = models.DateTimeField(auto_now_add=True)
    class Meta:
        unique_together = ('user', 'movie')
        ordering = ['-added_at']  # Orders by added_at date in descending order

    def __str__(self):
        return f"{self.user.username} - {self.movie.title}"