from fastapi import FastAPI, HTTPException
import pandas as pd
import mysql.connector
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

app = FastAPI()

def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="4312",
        database="shopping_platform"
    )

@app.get("/recommend/{product_id}")
def recommend(product_id: int):
    conn = get_db_connection()
    # 1. Fetch data from MySQL
    df = pd.read_sql("SELECT product_id, name, category FROM products", conn)
    conn.close()

    if product_id not in df['product_id'].values:
        raise HTTPException(status_code=404, detail="Product not found")

    # 2. Vectorize Name + Category
    df['metadata'] = df['name'] + " " + df['category']
    tfidf = TfidfVectorizer(stop_words='english')
    tfidf_matrix = tfidf.fit_transform(df['metadata'])

    # 3. Calculate Cosine Similarity
    cosine_sim = cosine_similarity(tfidf_matrix, tfidf_matrix)
    
    # 4. Get Top 5 similar items
    idx = df.index[df['product_id'] == product_id][0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    
    # Skip the first one (itself) and take next 5
    top_indices = [i[0] for i in sim_scores[1:6]]
    recommended_ids = df['product_id'].iloc[top_indices].tolist()

    return {"recommended_product_ids": recommended_ids}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)