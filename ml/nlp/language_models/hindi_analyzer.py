"""
Hindi text analysis module
"""
import re

def analyze_hindi_text(text):
    """
    Analyze Hindi text for reading difficulty
    
    Args:
        text: Hindi text to analyze
    
    Returns:
        dict: Analysis results
    """
    try:
        # Remove extra whitespace
        text = re.sub(r'\s+', ' ', text.strip())
        
        # Basic statistics
        words = text.split()
        word_count = len(words)
        char_count = len(text.replace(' ', ''))
        
        # Identify challenging words (words with conjuncts)
        challenging_words = []
        for word in words:
            # Words with conjuncts or long words
            if len(word) > 8 or has_conjunct(word):
                challenging_words.append(word)
        
        # Calculate difficulty score (0-1 scale)
        avg_word_length = char_count / word_count if word_count > 0 else 0
        difficulty_score = min(1.0, (avg_word_length / 10) + (len(challenging_words) / word_count if word_count > 0 else 0))
        
        # Determine reading level
        if difficulty_score < 0.3:
            reading_level = "Easy (Grade 1-3)"
        elif difficulty_score < 0.6:
            reading_level = "Medium (Grade 4-6)"
        else:
            reading_level = "Hard (Grade 7+)"
        
        return {
            'success': True,
            'language': 'hi',
            'script': 'Devanagari',
            'challenging_words': list(set(challenging_words))[:10],  # Top 10 unique
            'difficulty_score': round(difficulty_score, 2),
            'reading_level': reading_level,
            'statistics': {
                'total_words': word_count,
                'unique_words': len(set(words)),
                'average_word_length': round(avg_word_length, 2),
                'total_characters': char_count
            }
        }
        
    except Exception as e:
        return {
            'success': False,
            'error': str(e)
        }

def has_conjunct(word):
    """Check if word contains Devanagari conjuncts"""
    # Halant (virama) indicates conjunct formation
    return '\u094D' in word

def get_syllable_count(word):
    """Estimate syllable count for Hindi word"""
    # Count vowel signs and independent vowels
    vowels = 'अआइईउऊऋएऐओऔ'
    matras = '\u093E\u093F\u0940\u0941\u0942\u0943\u0947\u0948\u094B\u094C'
    
    count = 0
    for char in word:
        if char in vowels or char in matras:
            count += 1
    
    return max(1, count)  # Minimum 1 syllable