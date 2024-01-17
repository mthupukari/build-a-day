import pygame

class SmallBoard:
    def __init__(self, surface, top_left, cell_size):
        self.board = [[' '] * 3 for _ in range(3)]
        self.surface = surface
        self.top_left = top_left
        self.cell_size = cell_size
        self.x_png = pygame.transform.scale(pygame.image.load("x.png"), (self.cell_size, self.cell_size))
        self.o_png = pygame.transform.scale(pygame.image.load("o.png"), (self.cell_size, self.cell_size))
        self.cover = ''

    def make_move(self, row, col, player):
        if self.is_valid_move(row, col):
            self.board[row][col] = player
            return True
        return False

    def is_valid_move(self, row, col):
        return self.board[row][col] == ' '  

    def check_winner(self):

        # Check if X won
        for i in range(3):
            if self.board[i][0] == 'x' and self.board[i][1] == 'x' and self.board[i][2] == 'x':
                self.cover = 'x'
                return 'x'
        for i in range(3):
            if self.board[0][i] == 'x' and self.board[1][i] == 'x' and self.board[2][i] == 'x':
                self.cover = 'x'
                return 'x'
        if self.board[0][0] == 'x' and self.board[1][1] == 'x' and self.board[2][2] == 'x':
            self.cover = 'x'
            return 'x'
        elif self.board[0][2] == 'x' and self.board[1][1] == 'x' and self.board[2][0] == 'x':
            self.cover = 'x'
            return 'x'
        
        #Check if O won
        for i in range(3):
            if self.board[i][0] == 'o' and self.board[i][1] == 'o' and self.board[i][2] == 'o':
                self.cover = 'o'
                return 'o'
        for i in range(3):
            if self.board[0][i] == 'o' and self.board[1][i] == 'o' and self.board[2][i] == 'o':
                self.cover = 'o'
                return 'o'
        if self.board[0][0] == 'o' and self.board[1][1] == 'o' and self.board[2][2] == 'o': 
            self.cover = 'o'
            return 'o'
        elif self.board[0][2] == 'o' and self.board[1][1] == 'o' and self.board[2][0] == 'o': 
            self.cover = 'o'
            return 'o'
        
        #Check if board is full
        full = True
        for i in range(3):
            if not full:
                break
            for j in range(3):
                if self.board[i][j] == ' ':
                    full = False
                    break

        return 'e' if full else None
    
    def render(self):
        if self.cover != '':
            if self.cover == 'x':
                x_png = pygame.transform.scale(self.x_png, (200, 200))
                self.surface.blit(x_png, self.top_left)
            else:
                o_png = pygame.transform.scale(self.o_png, (200, 200))
                self.surface.blit(o_png, self.top_left)
        else:
            x_start, y_start = self.top_left
            small_board_size = self.cell_size * 3  

            for col in range(1, 3):
                x = x_start + col * self.cell_size
                pygame.draw.line(self.surface, (0, 0, 0), (x, y_start), (x, y_start + small_board_size))

            for row in range(1, 3):
                y = y_start + row * self.cell_size
                pygame.draw.line(self.surface, (0, 0, 0), (x_start, y), (x_start + small_board_size, y))

            for i, row in enumerate(self.board):
                for j, cell in enumerate(row):
                    cell_center_x = x_start + j * self.cell_size + self.cell_size // 2
                    cell_center_y = y_start + i * self.cell_size + self.cell_size // 2

                    if cell == 'x':
                        self.surface.blit(self.x_png, (cell_center_x - self.x_png.get_width() // 2, cell_center_y - self.x_png.get_height() // 2))
                    elif cell == 'o':
                        self.surface.blit(self.o_png, (cell_center_x - self.o_png.get_width() // 2, cell_center_y - self.o_png.get_height() // 2))
