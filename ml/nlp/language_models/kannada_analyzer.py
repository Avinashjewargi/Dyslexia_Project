"""
Kannada text analysis module
"""
import re

def analyze_kannada_text(text):
    """
    Analyze Kannada text for reading difficulty
    
    Args:
        text: Kannada text to analyze
    
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
        
        # Identify challenging words
        challenging_words = []
        for word in words:
            # Long words or words with complex characters
            if len(word) > 8 or has_complex_characters(word):
                challenging_words.append(word)
        
        # Calculate difficulty score
        avg_word_length = char_count / word_count if word_count > 0 else 0
        difficulty_score = min(1.0, (avg_word_length / 12) + (len(challenging_words) / word_count if word_count > 0 else 0))
        
        # Determine reading level
        if difficulty_score < 0.3:
            reading_level = "Easy (Grade 1-3)"
        elif difficulty_score < 0.6:
            reading_level = "Medium (Grade 4-6)"
        else:
            reading_level = "Hard (Grade 7+)"
        
        return {
            'success': True,
            'language': 'kn',
            'script': 'Kannada',
            'challenging_words': list(set(challenging_words))[:10],
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

def has_complex_characters(word):
    """Check if word has complex character combinations"""
    # Virama in Kannada
    return '\u0CCD' in word

def get_syllable_count(word):
    """Estimate syllable count for Kannada word"""
    # Count vowel signs
    vowels = 'ಅಆಇಈಉಊಋಎಏಐಒಓಔ'
    matras = '\u0CBE\u0CBF\u0CC0\u0CC1\u0CC2\u0CC3\u0CC6\u0CC7\u0CC8\u0CCA\u0CCB\u0CCC'
    
    count = 0
    for char in word:
        if char in vowels or char in matras:
            count += 1
    
    return max(1, count)