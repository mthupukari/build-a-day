# Used for hangman to take a list of words and find the words with 4 or more letters
with open('full_list.txt', 'r') as file:
    words = file.readlines()

with open('longer_words.txt', 'w') as new_file:
    for word in words:
        if len(word.strip()) > 4:
            new_file.write(word)