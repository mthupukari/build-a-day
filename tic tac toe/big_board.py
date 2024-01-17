import pygame
from small_board import SmallBoard  

class BigBoard:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((600, 600))
        self.screen.fill((255, 255, 255))
        self.small_boards = []
        self.game_board = [[' '] * 3 for _ in range(3)]

        self.big_cell_size = 200  
        self.margin = 5  
        self.small_cell_size = (self.big_cell_size - 2 * self.margin) // 3 

        self.current_player = 'x'

        self.index_map = {0 : (0,0), 1 : (0, 1), 2 : (0, 2),
                          3 : (1,0), 4 : (1, 1), 5 : (1, 2),
                          6 : (2,0), 7 : (2, 1), 8 : (2, 2)}

        for row in range(3):
            for col in range(3):
                top_left_x = self.margin + col * (self.big_cell_size + self.margin)
                top_left_y = self.margin + row * (self.big_cell_size + self.margin)
                top_left = (top_left_x, top_left_y)
                
                self.small_boards.append(SmallBoard(self.screen, top_left, self.small_cell_size))

    def handle_mouse_click(self, pos):
        x, y = pos

        board_col = x // (self.big_cell_size + self.margin)
        board_row = y // (self.big_cell_size + self.margin)
        small_board_index = board_row * 3 + board_col
        small_board = self.small_boards[small_board_index]

        cell_x = x % (self.big_cell_size + self.margin)  
        cell_y = y % (self.big_cell_size + self.margin)  
        cell_col = cell_x // self.small_cell_size
        cell_row = cell_y // self.small_cell_size

        if small_board.is_valid_move(cell_row, cell_col):
            if small_board.make_move(cell_row, cell_col, self.current_player):
                self.switch_player()

        verdict = small_board.check_winner()

        x, y = self.index_map[small_board_index]

        if verdict == 'x':
            self.game_board[x][y] = 'x'
        elif verdict == 'o':
            self.game_board[x][y] = 'o'
        elif verdict == 'e':
            self.game_board[x][y] = 'e'

        print(self.game_board)

    def switch_player(self):
        self.current_player = 'x' if self.current_player == 'o' else 'o'

    def check_big_board_winner(self):
        # Check if X won
        for i in range(3):
            if self.game_board[i][0] == 'x' and self.game_board[i][1] == 'x' and self.game_board[i][2] == 'x':
                return 'x'
        for i in range(3):
            if self.game_board[0][i] == 'x' and self.game_board[1][i] == 'x' and self.game_board[2][i] == 'x':
                return 'x'
        if self.game_board[0][0] == 'x' and self.game_board[1][1] == 'x' and self.game_board[2][2] == 'x':
            return 'x'
        elif self.game_board[0][2] == 'x' and self.game_board[1][1] == 'x' and self.game_board[2][0] == 'x':
            return 'x'
        
        #Check if O won
        for i in range(3):
            if self.game_board[i][0] == 'o' and self.game_board[i][1] == 'o' and self.game_board[i][2] == 'o':
                return 'o'
        for i in range(3):
            if self.game_board[0][i] == 'o' and self.game_board[1][i] == 'o' and self.game_board[2][i] == 'o':
                return 'o'
        if self.game_board[0][0] == 'o' and self.game_board[1][1] == 'o' and self.game_board[2][2] == 'o': 
            return 'o'
        elif self.game_board[0][2] == 'o' and self.game_board[1][1] == 'o' and self.game_board[2][0] == 'o': 
            return 'o'
        
        #check end
        end = True
        for i in range(3):
            if not end:
                break
            for j in range(3):
                if self.game_board[i][j] != 'e':
                    end = False
                    break
        if end:
            return 'e'
        #Check if board is full
        full = True
        for i in range(3):
            if not full:
                break
            for j in range(3):
                if self.game_board[i][j] == ' ':
                    full = False
                    break
        if full:
            return 'f'
        
        return None

    def run(self):
        turn = True
        running = True
        while running:
            self.screen.fill((255, 255, 255))  # Clear the screen for redrawing
            
            for small_board in self.small_boards:
                small_board.render()
            
            line_color = (0, 0, 0) 
            line_width = 5  
            
            for col in range(1, 3):
                x = col * (self.big_cell_size + self.margin)
                pygame.draw.line(self.screen, line_color, (x, 0), (x, self.screen.get_height()), line_width)
            
            for row in range(1, 3):
                y = row * (self.big_cell_size + self.margin)
                pygame.draw.line(self.screen, line_color, (0, y), (self.screen.get_width(), y), line_width)

            for event in pygame.event.get():
                if event.type == pygame.QUIT:
                    running = False

            if event.type == pygame.MOUSEBUTTONDOWN:
                self.handle_mouse_click(pos = pygame.mouse.get_pos())
                check = self.check_big_board_winner()
                if check != None:
                    print(check)
                    running = False
                    

            pygame.display.flip()

        pygame.quit()


if __name__ == '__main__':
    big_board_game = BigBoard()
    big_board_game.run()