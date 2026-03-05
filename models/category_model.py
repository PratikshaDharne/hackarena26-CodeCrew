from sklearn.feature_extraction.text import CountVectorizer
from sklearn.naive_bayes import MultinomialNB

stores = [
"dominos",
"pizza hut",
"uber",
"ola",
"amazon",
"flipkart",
"starbucks"
]

categories = [
"Food",
"Food",
"Travel",
"Travel",
"Shopping",
"Shopping",
"Food"
]

vectorizer = CountVectorizer()
X = vectorizer.fit_transform(stores)

model = MultinomialNB()
model.fit(X, categories)

def predict_category(store_name):

    store_vec = vectorizer.transform([store_name])

    return model.predict(store_vec)[0]