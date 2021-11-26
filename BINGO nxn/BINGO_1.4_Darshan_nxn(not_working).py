import random
# Copyright (C) 2012, Hariharan Srinath, Robbie Matthews
#from androidhelper import Android
#Android = Android()

#Initialising setup of grid by taking user input
def user_inp(string):
    try:
        size = int(input(string))
        if size > 0:
            return size
        else:
            return user_inp(string)
    except ValueError:
        print('Try again! Put an integral value. ')
        return user_inp(string)

def conv_str(string, gridn):
    if len(str(string)) == gridn:
        return str(string)
    else:
        return ('0'*(gridn-len(str(string)))+str(string))

#Making grid main rows with ugly brakets and inverted commas
def make_grid(size, grid, gridn, temp1):
    #Step 1: All the elements
    temp2 = [conv_str(i, gridn) for i in range (1, grid+1)]
    random.shuffle(temp2)
    #Step 2: Element in different sets
    count = 0
    for i in range(size):
        for j in range(count*size, (count+1)*size):
            temp1[i].append(temp2[j])
        count += 1
    return temp1

#For showing the grid without ugly brackets and inverted commas
def show_rows(k, message = None):
    if message:
        print(str(message))
    for i in range(size):
        for j in range(size):
            print(players[k].temp1[i][j], end = '  ')
        print()

#For checking column
def cond_equal_col(num1, num2, l):
    if (num1 > 1 and (players[l].temp1[num1][num2] == players[l].temp1[num1-1][num2])):
        return cond_equal_col(num1-1, num2, l)
    elif ((num1 == 1 and players[l].temp1[1][num2] == players[l].temp1[0][num2]) or num1 == 0):
        return True
    else:
        return False

#For checking main diagonal
def cond_equal_diar(i, l):
    if i < size-1:
        if players[l].temp1[i][i] == players[l].temp1[i+1][i+1]:
            return cond_equal_diar(i+1, l)
        else:
            return False
    elif i == size-1:
        return True

#For cheecking the other diagonal
def cond_equal_dial(i, l):
    if i > 0:
        if players[l].temp1[(size-1)-i][i] == players[l].temp1[(size-1)-(i-1)][i-1]:
            return cond_equal_dial(i-1, l)
        else:
            return False
    elif i == 0:
        return True

def user_inp_cut(grid, gridn, inputs):
        temp = user_inp('The number to cut: ')
        if (temp > grid) or (temp <= 0):#Bracket is necessary around each condition otherwise noerror will incur, but code will not work(took me hours to figure this one out)
            print('Enter a number from the grid')
            return user_inp_cut(grid, gridn, inputs)
        else:
            temp = str(temp)
            inputs.append(temp)
            temp = conv_str(temp, gridn)
            return temp


# To not give score to the one already given
class Player:
    def __init__(self, name, temp1=[], horz=[], vert=[], md=0, od=0, score=0):
        self.temp1 = temp1
        self.name = name
        self.horz = horz
        self.vert = vert
        self.md = md
        self.od = od
        self.score = score
#Taking grid size
print('Enter the size of the grid : ', end = '')
#Android.ttsSpeak('Enter the size of the grid')
size = user_inp('')

grid = size ** 2
gridn = len(str(grid))

player_num = user_inp('Enter the number of players : ')
players = [Player(input('Enter the name of player : ')) for k in range(player_num)]
for k in range(player_num):
    players[k].temp1 = [[] for i in range (size)]
    players[k].temp1 = make_grid(size, grid, gridn, players[k].temp1)

inputs = []
game_over = False
print('\nPlay\n')
while(game_over == False):
    for k in range(player_num):
        #For showing kth player
        print('\n',players[k].name,"'s turn\nNo need to put 0 before numbers ;) ")
        show_rows(k, 'Grid of '+players[k].name+"'s right now : ")
        temp = user_inp_cut(grid, gridn, inputs)
        #Replacing the given number
        for l in range(player_num):
            for i in range(size):
                if temp in players[l].temp1[i]:
                    temp3 = players[l].temp1[i].index(temp)
                    players[l].temp1[i][temp3] = '0'*gridn
                    
                    if i not in players[l].horz:
                        cond1 = set(players[l].temp1[i])
                        if cond1 == 1:
                            players[l].score += 1
                            players[l].horz.append(i)
                            print(players[l].name, i, cond1)                               #Main problem is here in this horz and 
                                                                                                    #vert giving always 1 and horz both elements
                    if temp3 not in players[l].vert:
                        cond2 = cond_equal_col(size-1, temp3, l)
                        if cond2 == True:
                            players[l].score += 1
                            players[l].vert.append(temp3)
                            print(players[l].name, i, temp3)
                                  
                    if players[l].md == 0:
                        cond3 = cond_equal_diar(0, l)
                        if cond3 == True:
                            players[l].score += 1
                            players[l].md += 1
                                  
                    if players[l].od == 0:
                        cond4 = cond_equal_dial(size-1, l)
                        if cond4 == True:
                            players[l].score += 1
                            players[l].od += 1
                    
            print('The score of', players[l].name, 'is', players[l].score)
            if players[l].score >= size:
                game_over = True
                
        show_rows(k, '\nAfter cutting the input, '+players[k].name+"'s grid : ")
        if game_over == True:
            break
                
#Android.ttsSpeak('You won')
print('These were the values cut during the whole session : ', inputs)
        
'''inputs.insert(0, 'These were the values cut during the whole session')
for i in range(len(inputs)):
    Android.ttsSpeak(inputs[i])'''

    
'''Version 1.2 changes:
1. Some aesthetic changes.
2. Changed things to definitions as much as possible for impoving readability.'''
'''Version 1.3 changes:
1. Added voice assistance supported in android versions of python(QPython3L).'''
