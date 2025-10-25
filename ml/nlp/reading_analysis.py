# ml/nlp/reading_analysis.py

import json
import nltk
from nltk.corpus import words as nltk_words
import sys

# Set up word lists for basic analysis
# Use a set for fast lookup
ENGLISH_WORDS = set(nltk_words.words())
# Define criteria for a "challenging" word (e.g., long words, less common words)
CHALLENGE_THRESHOLD_LENGTH = 7 

def analyze_reading_difficulty(text):
    """
    Analyzes text to identify words that might be challenging for a student.

    This is a SIMPLE heuristic: identifies words that are long or uncommon.
    """
    # Remove punctuation and split into individual words
    clean_text = ''.join(char for char in text if char.isalpha() or char.isspace()).lower()
    word_list = clean_text.split()

    challenging_words = set()

    for word in word_list:
        if not word:
            continue

        # Check 1: Long words are often challenging
        is_long = len(word) >= CHALLENGE_THRESHOLD_LENGTH

        # Check 2: Words not in a common English dictionary (could be uncommon/complex)
        is_uncommon = word not in ENGLISH_WORDS

        # If it meets either criteria, mark it as challenging
        if is_long or is_uncommon:
            challenging_words.add(word)

    # Calculate a simple difficulty score (ratio of challenging words to total words)
    if len(word_list) == 0:
        difficulty_score = 0
    else:
        difficulty_score = len(challenging_words) / len(word_list)

    return {
        "challenging_words": list(challenging_words),
        "difficulty_score": round(difficulty_score, 2)
    }

if __name__ == '__main__':
    # Check if the script received text via command-line arguments
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
    else:
        input_text = "The rhythm of the colonel's march was confusing."

    results = analyze_reading_difficulty(input_text)

    # Print the result as a JSON string so Node.js can easily read it
    print(json.dumps(results))