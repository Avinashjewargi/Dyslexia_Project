# ml/nlp/reading_analysis.py
import json
import sys
import nltk
import pyphen

# Ensure nltk data is present
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

# Initialize Pyphen for syllable counting (English)
dic = pyphen.Pyphen(lang='en')

# Common easy words to ignore even if they have syllables
EASY_WORDS = set([
    'everything', 'everyone', 'information', 'understanding', 'available', 
    'experience', 'something', 'different', 'important', 'the', 'and', 'that', 'have', 'for'
])

def count_syllables(word):
    """Count syllables in a word using Pyphen."""
    return len(dic.inserted(word).split('-'))

def analyze_reading_content(text):
    """
    Advanced NLP analysis for Dyslexia assistance.
    Identifies words based on syllable count (3+) and rarity.
    """
    if not text:
        return {"challenging_words": [], "difficulty_score": 0.0}
    
    words = nltk.word_tokenize(text)
    # Filter for actual alphabetic words
    words = [w for w in words if w.isalpha()]
    total_words = len(words)
    
    difficult_candidates = []
    total_syllables = 0

    for word in words:
        clean_word = word.lower()
        syllables = count_syllables(clean_word)
        total_syllables += syllables
        
        # Logic: Words with > 2 syllables that aren't in the common list
        # OR words that are long (> 7 chars)
        if (syllables > 2 or len(clean_word) > 7) and clean_word not in EASY_WORDS:
            difficult_candidates.append(word) 

    # Get unique difficult words, limited to top 15
    unique_difficult_words = list(set(difficult_candidates))[:15]

    # --- Calculate Flesch-Kincaid Readability Score ---
    if total_words > 0:
        score = 206.835 - 1.015 * (total_words) - 84.6 * (total_syllables / total_words)
        normalized_difficulty = max(0.0, min(1.0, (100 - score) / 100))
    else:
        normalized_difficulty = 0.0

    return {
        "challenging_words": unique_difficult_words,
        "difficulty_score": round(normalized_difficulty, 2),
        "stats": {
            "total_words": total_words,
            "syllable_count": total_syllables
        }
    }

if __name__ == '__main__':
    # CLI Mode
    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        results = analyze_reading_content(input_text)
        print(json.dumps(results))
    else:
        # Test default
        print(json.dumps(analyze_reading_content("The physiological mechanisms of dyslexia are complex.")))