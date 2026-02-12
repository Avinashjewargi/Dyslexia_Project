import sys
import os
import json
import nltk
import pyphen
from nltk.tokenize import word_tokenize, sent_tokenize

# ---------------- PATH SETUP ----------------
PROJECT_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
sys.path.append(PROJECT_ROOT)

from config.languageConfig import (
    is_valid_language,
    DEFAULT_LANGUAGE
)

# Language-specific analyzers
from nlp.language_models.hindi_analyzer import analyze_hindi_text
from nlp.language_models.kannada_analyzer import analyze_kannada_text

# ---------------- NLTK SETUP ----------------
try:
    nltk.data.find("tokenizers/punkt")
except LookupError:
    nltk.download("punkt", quiet=True)

# ---------------- ENGLISH NLP SETUP ----------------
dic = pyphen.Pyphen(lang="en")

EASY_WORDS = {
    "everything", "everyone", "information", "understanding",
    "available", "experience", "something", "different",
    "important", "the", "and", "that", "have", "for"
}

DIFFICULT_PATTERNS = ["tion", "sion", "ough", "augh", "eigh", "ph", "gh"]

# ---------------- UTILITY FUNCTIONS ----------------
def count_syllables(word):
    """Count syllables using Pyphen"""
    return len(dic.inserted(word).split("-"))

def has_difficult_pattern(word):
    return any(p in word for p in DIFFICULT_PATTERNS)

# ---------------- MAIN ROUTER ----------------
def analyze_text(text, language="en"):
    """
    Unified reading difficulty analysis with language support
    """
    try:
        if not is_valid_language(language):
            language = DEFAULT_LANGUAGE

        if language == "hi":
            return analyze_hindi_text(text)
        elif language == "kn":
            return analyze_kannada_text(text)
        else:
            return analyze_english_text(text)

    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

# ---------------- ENGLISH ANALYZER ----------------
def analyze_english_text(text):
    """
    Advanced English dyslexia-friendly analysis
    """
    if not text:
        return {
            "success": True,
            "language": "en",
            "challenging_words": [],
            "difficulty_score": 0.0
        }

    words = word_tokenize(text.lower())
    sentences = sent_tokenize(text)

    # Keep only alphabetic words
    words = [w for w in words if w.isalpha()]
    total_words = len(words)
    unique_words = len(set(words))
    sentence_count = len(sentences)

    total_syllables = 0
    difficult_words = []

    for word in words:
        syllables = count_syllables(word)
        total_syllables += syllables

        if (
            (syllables > 2 or len(word) > 7 or has_difficult_pattern(word))
            and word not in EASY_WORDS
        ):
            difficult_words.append(word)

    # Unique + limit
    challenging_words = list(set(difficult_words))[:15]

    avg_word_length = sum(len(w) for w in words) / total_words if total_words else 0
    avg_sentence_length = total_words / sentence_count if sentence_count else 0

    # -------- Flesch Reading Ease --------
    if total_words > 0:
        flesch_score = (
            206.835
            - 1.015 * avg_sentence_length
            - 84.6 * (total_syllables / total_words)
        )
        difficulty_score = max(0.0, min(1.0, (100 - flesch_score) / 100))
    else:
        difficulty_score = 0.0

    # Reading level
    if difficulty_score < 0.3:
        reading_level = "Easy (Grade 1–3)"
    elif difficulty_score < 0.6:
        reading_level = "Medium (Grade 4–6)"
    else:
        reading_level = "Hard (Grade 7+)"

    return {
        "success": True,
        "language": "en",
        "script": "Latin",
        "reading_level": reading_level,
        "difficulty_score": round(difficulty_score, 2),
        "challenging_words": challenging_words,
        "statistics": {
            "total_words": total_words,
            "unique_words": unique_words,
            "sentence_count": sentence_count,
            "average_word_length": round(avg_word_length, 2),
            "average_sentence_length": round(avg_sentence_length, 2),
            "syllable_count": total_syllables
        }
    }

# ---------------- CLI SUPPORT ----------------
if __name__ == "__main__":
    """
    CLI Usage:
    python reading_analysis.py "Some text here" en
    """

    if len(sys.argv) > 1:
        input_text = sys.argv[1]
        language = sys.argv[2] if len(sys.argv) > 2 else "en"
        result = analyze_text(input_text, language)
        print(json.dumps(result))
    else:
        print(json.dumps(
            analyze_text("The physiological mechanisms of dyslexia are complex.")
        ))
