import numpy as np
import pandas as pd
from flask import Flask, redirect, render_template, request, session, url_for
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json
import bs4 as bs
import urllib.request
import pickle
import requests
from tmdbv3api import TMDb, Movie

# TMDb setup
tmdb = TMDb()
tmdb.api_key = '6eb7d3f4e6ec2fe751d429e14d1bbd4b'
tmdb_movie = Movie()

# Load the NLP model and TF-IDF vectorizer from disk
filename = 'nlp_model.pkl'
clf = pickle.load(open(filename, 'rb'))
vectorizer = pickle.load(open('tranform.pkl', 'rb'))

app = Flask(__name__)

def create_sim():
    data = pd.read_csv('main_data.csv')
    cv = CountVectorizer()
    count_matrix = cv.fit_transform(data['comb'])
    sim = cosine_similarity(count_matrix)
    return data, sim

# Initialize data and similarity matrix outside the function for efficiency
try:
    data, sim = create_sim()
except Exception as e:
    print(f"Error loading data or similarity matrix: {e}")

def rcmd(m):
    m = m.lower()
    if m not in data['movie_title'].unique():
        return ('Sorry! The movie you searched for is not in our database. '
                'Please check the spelling or try with some other movie.')
    else:
        i = data.loc[data['movie_title'] == m].index[0]
        lst = list(enumerate(sim[i]))
        lst = sorted(lst, key=lambda x: x[1], reverse=True)
        lst = lst[1:11]
        recommended_movies = [data['movie_title'][idx[0]] for idx in lst]
        return recommended_movies

def ListOfGenres(genre_json):
    return ", ".join([genre['name'] for genre in genre_json]) if genre_json else 'N/A'

def date_convert(s):
    MONTHS = ['January', 'February', 'March', 'April', 'May', 'June',
              'July', 'August', 'September', 'October', 'November', 'December']
    y, m, d = s[:4], int(s[5:7]), s[8:]
    month_name = MONTHS[m - 1]
    return f"{month_name} {d} {y}"

def MinsToHours(duration):
    return f"{duration // 60} hours {duration % 60} minutes" if duration % 60 else f"{duration // 60} hours"

def get_suggestions():
    data = pd.read_csv('main_data.csv')
    return list(data['movie_title'].str.capitalize())

@app.route("/")
def home():
    suggestions = get_suggestions()
    return render_template('home.html', suggestions=suggestions)


@app.route("/movies")
def movies():
    try:
        # Fetch the top-rated movies from TMDb
        response = requests.get(f'https://api.themoviedb.org/3/movie/top_rated?api_key={tmdb.api_key}&language=en-US&page=1')
        response.raise_for_status()
        top_movies = response.json().get('results', [])

        # Randomly select 10 movies from the fetched data
        if len(top_movies) > 20:
            selected_movies = np.random.choice(top_movies, 20, replace=False)
        else:
            selected_movies = top_movies
        
        # Create a list of movie details
        movie_list = []
        for movie in selected_movies:
            movie_id = movie.get('id')
            title = movie.get('title', 'N/A')
            poster_path = movie.get('poster_path', '')
            img_path = f'https://image.tmdb.org/t/p/original{poster_path}' if poster_path else ''

            movie_list.append({
                'title': title,
                'img_path': img_path,
                'release_date': date_convert(movie.get('release_date', '')),
                'vote_average': movie.get('vote_average', 'N/A'),
                'overview': movie.get('overview', 'N/A')
            })

        return render_template('movie.html', movie_list=movie_list)

    except requests.exceptions.RequestException as e:
        return f"An error occurred while fetching movie data: {e}", 500

@app.route("/recommend")
def recommend():
    movie = request.args.get('movie')  # Get movie name from the URL
    r = rcmd(movie)
    movie_upper = movie.upper()
    
    if isinstance(r, str):  # No such movie found in the database
        return render_template('recommend.html', movie=movie_upper, r=r, t='s')
    
    try:
        result = tmdb_movie.search(movie)[0]
        movie_id = result.id
        
        # Make an API call to TMDb
        response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={tmdb.api_key}')
        response.raise_for_status()  # Check for HTTP request errors
        data_json = response.json()

        imdb_id = data_json.get('imdb_id', 'N/A')
        poster_path = data_json.get('poster_path', '')
        img_path = f'https://image.tmdb.org/t/p/original{poster_path}' if poster_path else ''

        genre = ListOfGenres(data_json.get('genres', []))
        
        # Web scraping user reviews from IMDb
        try:
            sauce = urllib.request.urlopen(f'https://www.imdb.com/title/{imdb_id}/reviews?ref_=tt_ov_rt').read()
            soup = bs.BeautifulSoup(sauce, 'lxml')
            soup_result = soup.find_all("div", {"class": "text show-more__control"})
            
            reviews_list = []
            reviews_status = []
            for review in soup_result[:10]:  # Limit to the first 10 reviews for performance
                if review.string:
                    reviews_list.append(review.string)
                    movie_vector = vectorizer.transform([review.string])
                    pred = clf.predict(movie_vector)
                    reviews_status.append('Good' if pred else 'Bad')

            movie_reviews = {reviews_list[i]: reviews_status[i] for i in range(len(reviews_list))}

        except urllib.error.URLError as e:
            movie_reviews = {"Error": f"Could not retrieve reviews: {e}"}

        vote_count = "{:,}".format(result.vote_count)
        release_date = date_convert(result.release_date)
        status = data_json.get('status', 'N/A')
        runtime = MinsToHours(data_json.get('runtime', 0))

        # Fetch posters for recommended movies
        posters = []
        for title in r:
            search_results = tmdb_movie.search(title)
            if search_results:
                movie_id = search_results[0].id
                response = requests.get(f'https://api.themoviedb.org/3/movie/{movie_id}?api_key={tmdb.api_key}')
                movie_data = response.json()
                poster_path = movie_data.get('poster_path', '')
                posters.append(f'https://image.tmdb.org/t/p/original{poster_path}')

        movie_cards = {posters[i]: r[i] for i in range(len(posters))}

        suggestions = get_suggestions()
        
        return render_template('recommend.html', movie=movie_upper, mtitle=r, t='l', cards=movie_cards,
                               result=result, reviews=movie_reviews, img_path=img_path, genres=genre,
                               vote_count=vote_count, release_date=release_date, status=status, runtime=runtime)
    except IndexError:
        return render_template('recommend.html', movie=movie_upper, r="Movie not found on TMDb.", t='s')
    except requests.exceptions.RequestException as e:
        return f"An error occurred while fetching movie data: {e}", 500



@app.route("/watchlist", methods=["GET"])
def watchlist():
    # Get the user's watchlist from the session
    watchlist = session.get('watchlist', [])
    
    # Fetch movie details for each movie in the watchlist
    movie_details = []
    for movie_title in watchlist:
        # Get movie details from TMDb
        response = requests.get(f'https://api.themoviedb.org/3/search/movie?api_key={tmdb.api_key}&query={movie_title}')
        movie_data = response.json().get('results', [])
        if movie_data:
            movie = movie_data[0]
            movie_details.append({
                'title': movie['title'],
                'img_path': f'https://image.tmdb.org/t/p/original{movie["poster_path"]}',
                'release_date': date_convert(movie.get('release_date', '')),
                'vote_average': movie.get('vote_average', 'N/A'),
                'overview': movie.get('overview', 'N/A')
            })
    
    return render_template('watchlist.html', watchlist=movie_details)

@app.route("/add_to_watchlist", methods=["POST"])
def add_to_watchlist():
    movie_title = request.form['movie_id']  # Get movie title from the form submission
    
    # Retrieve current watchlist from session
    watchlist = session.get('watchlist', [])
    
    # Add movie to watchlist if not already present
    if movie_title not in watchlist:
        watchlist.append(movie_title)
        session['watchlist'] = watchlist  # Save updated watchlist to session
    
    return redirect(url_for('watchlist'))  # Redirect to the Watchlist page


if __name__ == '__main__':
    app.run(debug=True)
