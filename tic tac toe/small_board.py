import pygame

class SmallBoard:
    def __init__(self, surface, top_left, cell_size):
        self.board = [[' '] * 3 for _ in range(3)]
        self.surface = surface
        self.top_left = top_left
        self.cell_size = cell_size
        self.x_png = pygame.transform.scale(pygame.image.load("x.png"), (self.cell_size, self.cell_size))
        self.o_png = pygame.transform.scale(pygame.image.load("o.png"), (self.cell_size, self.cell_size))

    def render(self):
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

                if cell == 'X':
                    self.surface.blit(self.x_png, (cell_center_x - self.x_png.get_width() // 2, cell_center_y - self.x_png.get_height() // 2))
                elif cell == 'O':
                    self.surface.blit(self.o_png, (cell_center_x - self.o_png.get_width() // 2, cell_center_y - self.o_png.get_height() // 2))
