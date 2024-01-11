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
    # suits = ["Diamonds", "Hearts", "Spades", "Clubs"]
    # ranks = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12", "13"]

    suits = ["Diamonds", "Hearts"]
    ranks = ["1", "2"]
   
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
        size = len(self.deck.cards)
        # self.player1.flipped = self.deck.cards[0:26]
        # self.player2.flipped = self.deck.cards[26:52]
        self.player1.flipped = self.deck.cards[0:int(size/2)]
        self.player2.flipped = self.deck.cards[int(size/2):(size-1)]
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
    
    def middle1(self):
        card = self.player1.shown[-1]
        suit, rank = card.suit, card.rank
        rank = int(rank)
        if rank == 1:
            if suit == "Diamonds" and len(self.diamonds) == 0:
                self.diamonds.append(card)
                self.player1.shown.pop()
                return True
            elif suit == "Hearts" and len(self.hearts) == 0:
                self.hearts.append(card)
                self.player1.shown.pop()
                return True
            elif suit == "Spades" and len(self.spades) == 0:
                self.spades.append(card)
                self.player1.shown.pop()
                return True
            elif suit == "Clubs" and len(self.clubs) == 0:
                self.clubs.append(card)
                self.player1.shown.pop()
                return True
            else:
                return False
        else:
            if suit == "Diamonds":
                if len(self.diamonds) == 0:
                    return False
                
                r = self.diamonds[-1].rank
                if rank - 1 == r:
                    self.diamonds.append(card)
                    self.player1.shown.pop()
                    return True
                else: 
                    return False
            elif suit == "Hearts":
                if len(self.hearts) == 0:
                    return False
                
                r = self.hearts[-1].rank
                if rank - 1 == r:
                    self.hearts.append(card)
                    self.player1.shown.pop()
                    return True
                else: 
                    return False
            elif suit == "Spades":
                if len(self.spades) == 0:
                    return False
                
                r = self.spades[-1].rank
                if rank - 1 == r:
                    self.spades.append(card)
                    self.player1.shown.pop()
                    return True
                else: 
                    return False
            elif suit == "Clubs":
                if len(self.clubs) == 0:
                    return False
                
                r = self.clubs[-1].rank
                if rank - 1 == r:
                    self.clubs.append(card)
                    self.player1.shown.pop()
                    return True
                else: 
                    return False
                
    def middle2(self):
        card = self.player1.shown[-1]
        suit, rank = card.suit, card.rank
        print(suit + " " + rank)
        if rank == 1:
            if suit == "Diamonds" and len(self.diamonds) == 0:
                self.diamonds.append(card)
                self.player2.shown.pop()
                return True
            elif suit == "Hearts" and len(self.hearts) == 0:
                self.hearts.append(card)
                self.player2.shown.pop()
                return True
            elif suit == "Spades" and len(self.spades) == 0:
                self.spades.append(card)
                self.player2.shown.pop()
                return True
            elif suit == "Clubs" and len(self.clubs) == 0:
                self.clubs.append(card)
                self.player2.shown.pop()
                return True
            else:
                return False
        else:
            if suit == "Diamonds":
                if len(self.diamonds) == 0:
                    return False
                
                r = self.diamonds[-1].rank
                if rank - 1 == r:
                    self.diamonds.append(card)
                    self.player2.shown.pop()
                    return True
                else: 
                    return False
            elif suit == "Hearts":
                if len(self.hearts) == 0:
                    return False
                
                r = self.hearts[-1].rank
                if rank - 1 == r:
                    self.hearts.append(card)
                    self.player2.shown.pop()
                    return True
                else: 
                    return False
            elif suit == "Spades":
                if len(self.spades) == 0:
                    return False
                
                r = self.spades[-1].rank
                if rank - 1 == r:
                    self.spades.append(card)
                    self.player2.shown.pop()
                    return True
                else: 
                    return False
            elif suit == "Clubs":
                if len(self.clubs) == 0:
                    return False
                
                r = self.clubs[-1].rank
                if rank - 1 == r:
                    self.clubs.append(card)
                    self.player2.shown.pop()
                    return True
                else: 
                    return False


    


#Monkey Game
game = Monkey()
game.deal()
turn = random.randint(0, 1)
ifMonkey = False

while game.player1.total() > 0 and game.player2.total() > 0:
    if turn == 0:
        print("Player 1 turn:\n")
        game.printBoard1()
        user_input = int(input("Enter 1 to draw a card, 2 to put in the middle, or 3 to place on players deck:   "))
        if user_input == 99:
            break

        if user_input  == 1:
            game.draw1()
        elif user_input == 2:
            game.middle1()
        else:
            game.placeOnPlayer1()

        turn == 1
    else:
        print("Player 2 turn:\n")
        game.printBoard2()
        user_input = int(input("Enter 1 to draw a card, 2 to put in the middle, or 3 to place on players deck:   "))
        if user_input == 99:
            break

        if user_input  == 1:
            game.draw2()
        elif user_input == 2:
            game.middle2()
        else:
            game.placeOnPlayer2()
        
        turn == 0

    







    











    
