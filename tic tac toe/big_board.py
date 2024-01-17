import pygame
from small_board import SmallBoard  

class BigBoard:
    def __init__(self):
        pygame.init()
        self.screen = pygame.display.set_mode((600, 600))
        self.screen.fill((255, 255, 255))
        self.small_boards = []

        self.big_cell_size = 200  
        self.margin = 5  
        self.small_cell_size = (self.big_cell_size - 2 * self.margin) // 3  

        for row in range(3):
            for col in range(3):
                top_left_x = self.margin + col * (self.big_cell_size + self.margin)
                top_left_y = self.margin + row * (self.big_cell_size + self.margin)
                top_left = (top_left_x, top_left_y)
                
                self.small_boards.append(SmallBoard(self.screen, top_left, self.small_cell_size))

    def run(self):
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

            pygame.display.flip()

        pygame.quit()


if __name__ == '__main__':
    big_board_game = BigBoard()
    big_board_game.run()