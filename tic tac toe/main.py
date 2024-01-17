import pygame

pygame.init()

screen_width = 800
screen_height = 600
screen = pygame.display.set_mode((screen_width, screen_height))
screen.fill((255, 255, 255))

x_png = pygame.image.load("x.png")
x_png = pygame.transform.scale(x_png, (100,100))
o_png = pygame.image.load("o.png")
o_png = pygame.transform.scale(o_png, (100,100))


global box_1
global box_2
global box_3
global box_4
global box_5
global box_6
global box_7
global box_8
global box_9

box_1 = pygame.draw.rect(screen, (0,0,0), (250, 150, 100, 100), 1)
box_2 = pygame.draw.rect(screen, (0,0,0), (250, 150, 100, 100), 1)
box_3 = pygame.draw.rect(screen, (0,0,0), (250, 150, 100, 100), 1)
box_4 = pygame.draw.rect(screen, (0,0,0), (250, 150, 100, 100), 1)
box_5 = pygame.draw.rect(screen, (0,0,0), (250, 150, 100, 100), 1)
box_6 = pygame.draw.rect(screen, (0,0,0), (250, 150, 100, 100), 1)
box_7 = pygame.draw.rect(screen, (0,0,0), (250, 150, 100, 100), 1)
box_8 = pygame.draw.rect(screen, (0,0,0), (250, 150, 100, 100), 1)
box_9 = pygame.draw.rect(screen, (0,0,0), (250, 150, 100, 100), 1)

pygame.display.flip()


board = [[" ", " ", " "] * 3 for i in range(3)]

def printBoard():
    for i in range(0, 3):
        print(" " + board[i][0] + " | " + board[i][1] + " | " + board[i][2] + " ")
        if i != 2:
            print("-----------")

    print()

def checkX():
    #check rows
    for i in range(3):
        if board[i][0] == 'x' and board[i][1] == 'x' and board[i][2] == 'x':
            print("x wins")
            return True
    #check cols
    for i in range(3):
        if board[0][i] == 'x' and board[1][i] == 'x' and board[2][i] == 'x':
            print("x wins")
            return True
        
    #check diag
    if board[0][0] == 'x' and board[1][1] == 'x' and board[2][2] == 'x': 
        print("x wins")
        return True
    elif board[0][2] == 'x' and board[1][1] == 'x' and board[2][0] == 'x': 
        print("x wins")
        return True
    
    return False

def checkO():
    #check rows
    for i in range(3):
        if board[i][0] == 'o' and board[i][1] == 'o' and board[i][2] == 'o':
            print("o wins")
            return True
    #check cols
    for i in range(3):
        if board[0][i] == 'o' and board[1][i] == 'o' and board[2][i] == 'o':
            print("o wins")
            return True
        
    #check diag
    if board[0][0] == 'o' and board[1][1] == 'o' and board[2][2] == 'o': 
        print("o wins")
        return True
    elif board[0][2] == 'o' and board[1][1] == 'o' and board[2][0] == 'o': 
        print("o wins")
        return True
    
    return False

def checkEnd():
    for i in range(3):
        for j in range(3):
            if board[i][j] == " ":
                return False


    return True
        
    
def game():
    turn = True

    while True:
        if checkEnd():
            print("Game Over. Tie.")
            break

        printBoard()

        if turn:
            coord = (input("X Turn: Enter a coordinate: ")).strip()
            Sx_coord, Sy_coord = coord.split(",")

            x_coord = int(Sx_coord)
            y_coord = int(Sy_coord)

            while board[x_coord][y_coord] != " " and x_coord < 3 and x_coord > 0 and y_coord < 3 and y_coord > 0:
                coord = (input("coordinate taken or out of bounds, enter new one: ")).strip()
                Sx_coord, Sy_coord = coord.split(",")

                x_coord = int(Sx_coord)
                y_coord = int(Sy_coord)
            
            board[x_coord][y_coord] = 'x'

            if checkX():
                break
        else:

            coord = (input("O Turn: Enter a coordinate: ")).strip()
            Sx_coord, Sy_coord = coord.split(",")

            x_coord = int(Sx_coord)
            y_coord = int(Sy_coord)

            while board[x_coord][y_coord] != " " and x_coord < 3 and x_coord > 0 and y_coord < 3 and y_coord > 0:
                coord = (input("coordinate taken or out of bounds, enter new one: ")).strip()
                Sx_coord, Sy_coord = coord.split(",")

                x_coord = int(Sx_coord)
                y_coord = int(Sy_coord)
            

            board[x_coord][y_coord] = 'o'
            
            if checkO():
                break



game()


running = True
while running:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            running = False

        if event.type == pygame.MOUSEBUTTONDOWN:
            pos = pygame.mouse.get_pos()

        # Game logic and drawing code goes here

    pygame.display.flip()  # Update the full display

pygame.quit()

print("hi")