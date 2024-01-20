import pygame
import random

pygame.init()
screen = pygame.display.set_mode((800, 800))
pygame.display.set_caption("Hangman Game")
font = pygame.font.Font(None, 36)

word = ""
alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

face_png = pygame.transform.scale(pygame.image.load("hangman_face.png"), (100, 100))
body_png = pygame.transform.scale(pygame.image.load("hangman.png"), (100, 200))
left_arm_png =  pygame.transform.rotate(pygame.transform.scale(pygame.image.load("hangman.png"), (100, 200)), 45)
right_arm_png =  pygame.transform.rotate(pygame.transform.scale(pygame.image.load("hangman.png"), (100, 200)), 315)
left_leg_png =  pygame.transform.rotate(pygame.transform.scale(pygame.image.load("hangman.png"), (100, 200)), 135)
right_leg_png =  pygame.transform.rotate(pygame.transform.scale(pygame.image.load("hangman.png"), (100, 200)), 225)


def render(word_display, used_letters, mistakes, win, word):
    screen.fill((232, 220, 202))

    if win == None:
        screen.blit(font.render("TYPE A LETTER", True, (0,0,0)), (300, 50))
    elif win:
        screen.blit(font.render("YOU WIN", True, (0,0,0)), (300, 50))
    else:
        screen.blit(font.render("YOU LOSE.", True, (0,0,0)), (300, 50))
        screen.blit(font.render("The word was " + word, True, (0,0,0)), (300, 75))


    #display mistakes
    if mistakes == 1:
        screen.blit(face_png, (200, 300))
    elif mistakes == 2:
        screen.blit(body_png, (200, 350))
        screen.blit(face_png, (200, 300))
    elif mistakes == 3:
        screen.blit(right_arm_png, (180, 260))
        screen.blit(body_png, (200, 350))
        screen.blit(face_png, (200, 300))
    elif mistakes == 4:
        screen.blit(right_arm_png, (180, 260))
        screen.blit(left_arm_png, (105, 260))
        screen.blit(body_png, (200, 350))
        screen.blit(face_png, (200, 300))
    elif mistakes == 5:
        screen.blit(right_arm_png, (180, 260))
        screen.blit(left_arm_png, (105, 260))
        screen.blit(right_leg_png, (180, 430))
        screen.blit(body_png, (200, 350))
        screen.blit(face_png, (200, 300))
    elif mistakes >= 6:
        screen.blit(right_arm_png, (180, 260))
        screen.blit(left_arm_png, (105, 260))
        screen.blit(right_leg_png, (180, 430))
        screen.blit(left_leg_png, (105, 430))
        screen.blit(body_png, (200, 350))
        screen.blit(face_png, (200, 300))
        
    #display lines
    for i, c in enumerate(word_display):
        screen.blit(font.render(c, True, (0,0,0)), (300 + (i * 25), 700))

    y = 0
    x = 0
    for i, c in enumerate(used_letters):
        if i % 3 == 0:
            y += 50
            x = 0
        screen.blit(font.render(c, True, (0,0,0)), (600 + x, 200 + y))
        x += 25


    pygame.display.flip() 
        
def run(word):
    word_display = ["_" for i in range(len(word))]
    used_letters = []
    mistakes = 0
    running = True
    win = None
    while running:
        if "_" not in word_display:
            win = True
        
        if mistakes >= 6:
            win = False

        for event in pygame.event.get():  
            if event.type == pygame.QUIT: 
                running = False
            elif event.type == pygame.KEYDOWN and not win and mistakes < 6:
                key = str(event.unicode)
                if key in alphabet:
                    if key in used_letters:
                        continue
                    elif key in word and key not in word_display:
                        for i, c in enumerate(word):
                            if key == c:
                                word_display[i] = c

                            

                        used_letters.append(key)
                    else:
                        used_letters.append(key)
                        mistakes += 1
                        


                

        render(word_display, used_letters, mistakes, win, word)  

    pygame.quit()  

def word_picker():
    words = []
    file = open("longer_words.txt", 'r')
    while True:
        line = file.readline()
        if not line: 
            break
        words.append(line.strip())
    
    index = random.randint(0, len(words)-1)
    return words[index]



if __name__ == '__main__':
    word = word_picker()
    run(word)
