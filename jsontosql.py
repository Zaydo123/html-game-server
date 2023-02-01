import json

with open('public/games.json') as f:
    games = json.load(f)

print('---------------')
#convert json to sql insert statement. Include name, id, image, visits, ranking, and description, and games gamedistribution if not undefined and needsConstantFocus if not undefined
for game in games['games']:
    if 'gamedistribution' in game:
        gamedistribution = game['gamedistribution']
    else:
        gamedistribution = 'NULL'
    if 'needsConstantFocus' in game:
        needsConstantFocus = game['needsConstantFocus']
    else:
        needsConstantFocus = 0
    if 'description' in game:
        description = game['description']
    else:
        description = 'NULL'

    print("INSERT INTO games (name, id, image, visits, ranking, description, gamedistribution, needsConstantFocus) VALUES ('{}', '{}', '{}', {}, {}, '{}', '{}', {});".format(game['name'], game['id'], game['image'], game['visits'], game['ranking'], description, gamedistribution, needsConstantFocus))
