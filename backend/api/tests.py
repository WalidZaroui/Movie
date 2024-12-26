from django.test import TestCase
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from .models import Genre, Movie, History, Wishlist, Favorite
from datetime import date
from django.db import IntegrityError  # Import IntegrityError
from time import sleep
class GenreModelTest(TestCase):
    # Test creating a genre
    # Teste la création d'un genre
    def test_create_genre(self):
        genre = Genre.objects.create(name="Action")
        self.assertEqual(str(genre), "Action")
        self.assertEqual(Genre.objects.count(), 1)

    # Test unique constraint on genre name
    # Teste la contrainte d'unicité sur le nom des genres
    def test_unique_genre_name(self):
        Genre.objects.create(name="Action")
        with self.assertRaises(Exception):  # Unique constraint violation
            Genre.objects.create(name="Action")

class MovieModelTest(TestCase):
    def setUp(self):
        self.genre = Genre.objects.create(name="Drama")
    
    # Test creating a movie with valid data
    # Teste la création d'un film avec des données valides
    def test_create_movie_valid_data(self):
        movie = Movie.objects.create(
            title="Test Movie",
            synopsis="A test synopsis",
            director="Test Director",
            rating=8.5,
            release_year=date.today().year
        )
        movie.genres.add(self.genre)
        self.assertEqual(str(movie), "Test Movie")
        self.assertEqual(movie.rating, 8.5)
        self.assertEqual(movie.release_year, date.today().year)
        self.assertIn(self.genre, movie.genres.all())

    # Test validation for rating being out of bounds
    # Teste la validation d'une note en dehors des limites
    def test_movie_rating_out_of_bounds(self):
        with self.assertRaises(ValidationError):
            movie = Movie(
                title="Invalid Rating Movie",
                synopsis="A test synopsis",
                director="Test Director",
                rating=11.0,  # Invalid
                release_year=date.today().year
            )
            movie.full_clean()  # Trigger validation

        with self.assertRaises(ValidationError):
            movie = Movie(
                title="Invalid Rating Movie",
                synopsis="A test synopsis",
                director="Test Director",
                rating=-1.0,  # Invalid
                release_year=date.today().year
            )
            movie.full_clean()  # Trigger validation

    # Test validation for release year being in the future
    # Teste la validation d'une année de sortie dans le futur
    def test_movie_release_year_in_future(self):
        future_year = date.today().year + 1
        with self.assertRaises(ValidationError):
            movie = Movie(
                title="Future Movie",
                synopsis="A test synopsis",
                director="Test Director",
                rating=8.0,
                release_year=future_year  # Invalid
            )
            movie.full_clean()  # Trigger validation

class HistoryModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser")
        self.movie = Movie.objects.create(
            title="History Test Movie",
            synopsis="A test synopsis",
            director="Test Director",
            rating=8.0,
            release_year=date.today().year
        )

    # Test creating a history entry
    # Teste la création d'une entrée dans l'historique
    def test_create_history(self):
        history = History.objects.create(user=self.user, movie=self.movie)
        self.assertEqual(str(history), f"{self.user.username} - {self.movie.title}")
        self.assertEqual(History.objects.count(), 1)

class WishlistModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser")
        self.movie = Movie.objects.create(
            title="Wishlist Test Movie",
            synopsis="A test synopsis",
            director="Test Director",
            rating=7.5,
            release_year=date.today().year
        )

    # Test unique constraint for wishlist
    # Teste la contrainte d'unicité pour la liste de souhaits
    def test_unique_wishlist_constraint(self):
        Wishlist.objects.create(user=self.user, movie=self.movie)

        # Savepoint to isolate the error
        from django.db import transaction
        with transaction.atomic():
            with self.assertRaises(IntegrityError):
                Wishlist.objects.create(user=self.user, movie=self.movie)


class FavoriteModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser")
        self.movie1 = Movie.objects.create(
            title="Favorite Test Movie",
            synopsis="A test synopsis",
            director="Test Director",
            rating=8.5,
            release_year=date.today().year
        )
        self.movie2 = Movie.objects.create(
            title="Second Favorite Movie",
            synopsis="Another test synopsis",
            director="Second Director",
            rating=9.0,
            release_year=date.today().year
        )

    # Test ordering of favorites by -added_at
    # Tester l'ordre des favoris par -added_at
    def test_favorite_ordering(self):
        favorite1 = Favorite.objects.create(user=self.user, movie=self.movie1)
        favorite2 = Favorite.objects.create(user=self.user, movie=self.movie2)

        # Force ordering in query
        favorites = Favorite.objects.order_by('-added_at')
        self.assertEqual(list(favorites), [favorite2, favorite1])


class FavoriteModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create(username="testuser")
        self.movie1 = Movie.objects.create(
            title="Favorite Test Movie",
            synopsis="A test synopsis",
            director="Test Director",
            rating=8.5,
            release_year=date.today().year
        )
        self.movie2 = Movie.objects.create(
            title="Second Favorite Movie",
            synopsis="Another test synopsis",
            director="Second Director",
            rating=9.0,
            release_year=date.today().year
        )

    # Test ordering of favorites by -added_at
    # Tester l'ordre des favoris par -added_at
    def test_favorite_ordering(self):
        # Introduce a slight delay to ensure distinct timestamps
        favorite1 = Favorite.objects.create(user=self.user, movie=self.movie1)
        sleep(0.1)
        favorite2 = Favorite.objects.create(user=self.user, movie=self.movie2)

        # Verify ordering explicitly
        favorites = Favorite.objects.all()
        self.assertQuerySetEqual(
            favorites, 
            [favorite2, favorite1],  # Most recent should come first
            transform=lambda x: x  # Compare objects directly
        )