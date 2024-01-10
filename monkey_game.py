import random

class Card:
    def __init__(self, suit, rank):
        self.suit = suit
        self.rank = rank

    def getCard(self):
        if self.rank == "1":
            return "Ace of " + self.suit
        elif self.rank == "11":
            return "Jack of " + self.suit
        elif self.rank == "12":
            return "Queen of " + self.suit
        elif self.rank == "13":
            return "King of " + self.suit
        else:
            return self.rank + " of " + self.suit
        
    def card(self):
        return (self.suit, self.rank)
            

class Deck:
    suits = ["Diamonds", "Hearts", "Spades", "Clubs"]
    ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]
   
    def __init__(self):
        self.cards = [Card(suit, rank) for suit in Deck.suits for rank in Deck.ranks]

    def shuffle(self):
        random.shuffle(self.cards)


class Player:
    def __init__(self):
        self.flipped = []
        self.shown = []

    def total(self):
        return len(self.flipped) + len(self.shown)



class Monkey:
    def __init__(self):
        self.diamonds = []
        self.hearts = []
        self.spades = []
        self.clubs = []
        self.player1 = Player()
        self.player2 = Player()
        self.deck = Deck()
        
    def deal(self):
        self.deck.shuffle()
        self.player1.flipped = self.deck.cards[0:26]
        self.player2.flipped = self.deck.cards[26:52]
        self.draw1()
        self.draw2()


    def printBoard1(self):
        print("Player 2 top card: " + self.player2.shown[-1].getCard())
        print()
        print("Diamonds: " + self.diamonds[-1].getCard()) if len(self.diamonds) > 0 else print("Diamonds: []")
        print("Hearts: " + self.hearts[-1].getCard()) if len(self.hearts) > 0 else print("Hearts: []")
        print("Spades: " + self.spades[-1].getCard()) if len(self.spades) > 0 else print("Spades: []")
        print("Clubs: " + self.clubs[-1].getCard()) if len(self.clubs) > 0 else print("Clubs: []")
        print()
        print("Player 1 top card: " + self.player1.shown[-1].getCard())
        print()

    def printBoard2(self):
        print("Player 1 top card: " + self.player1.shown[-1].getCard())
        print()
        print("Diamonds: " + self.diamonds[-1].getCard()) if len(self.diamonds) > 0 else print("Diamonds: []")
        print("Hearts: " + self.hearts[-1].getCard()) if len(self.hearts) > 0 else print("Hearts: []")
        print("Spades: " + self.spades[-1].getCard()) if len(self.spades) > 0 else print("Spades: []")
        print("Clubs: " + self.clubs[-1].getCard()) if len(self.clubs) > 0 else print("Clubs: []")
        print()
        print("Player 2 top card: " + self.player2.shown[-1].getCard()) 
        print()

    def draw1(self):
        if len(self.player1.flipped) > 0:
            card = self.player1.flipped.pop()
            self.player1.shown.append(card)
        else:
            self.player1.flipped = self.player1.shown[::-1]
            self.player1.shown = []
            card = self.player1.flipped.pop()
            self.player1.shown.append(card)

        return card
    
    def draw2(self):
        if len(self.player2.flipped) > 0:
            card = self.player2.flipped.pop()
            self.player2.shown.append(card)
        else:
            self.player2.flipped = self.player2.shown[::-1]
            self.player2.shown = []
            card = self.player2.flipped.pop()
            self.player2.shown.append(card)

        return card

    


#Monkey Game
game = Monkey()
game.deal()

game.printBoard1()

turn = random.randint(0, 1)
ifMonkey = False

game.printBoard1()
print(game.player1.flipped[-1].getCard())
print(game.player1.shown[-1].getCard())
user_input = int(input("Select 1 to draw card, 2 to put card in middle, 3 to put card on other player"))
game.draw1()
game.printBoard1()
print(game.player1.flipped[-1].getCard())
print(game.player1.shown[-1].getCard())






    











    
