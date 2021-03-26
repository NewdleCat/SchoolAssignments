import sys
sys.path.insert(0, '../')
from planet_wars import issue_order


def attack_weakest_enemy_planet(state):
    # if len(state.my_fleets()) >= 20:
    #     return False

    start_planet = None
    target_planet = None
    my_planets = state.my_planets()
    enemy_planets = state.enemy_planets()

    for ship in state.my_fleets():
        dest_planet = state.planets[ship.destination_planet]
        if dest_planet in enemy_planets:
            enemy_planets.remove(dest_planet)


    start_planet = max(my_planets, key=lambda t: t.num_ships, default=None)

    distList = []
    for enemy_planet in enemy_planets:
        dist = state.distance(start_planet.ID, enemy_planet.ID)
        distList.append((dist, enemy_planet))

    if len(distList) == 0:
        return False

    distList.sort()
    target_planet = distList[0][1]


    # target_planet = min(enemy_planets, key=lambda t: t.num_ships, default=None)

    if start_planet and target_planet:
        attackNum = target_planet.num_ships + \
                        state.distance(start_planet.ID, target_planet.ID) * target_planet.growth_rate + 1

        if start_planet.num_ships < attackNum:
            return False

    if not start_planet or not target_planet:
        return False
    else:
        return issue_order(state, start_planet.ID, target_planet.ID, attackNum)


def spread_to_weakest_neutral_planet(state):
    # if len(state.my_fleets()) >= 20:
    #     return False

    my_planets = state.my_planets()
    neutral_planets = state.neutral_planets()
    fleets = state.my_fleets()

    attackList = []

    for currPlanet in my_planets:
        for tarPlanet in neutral_planets:
            attackPlanet = True
            for currFleet in fleets:
                if currFleet.destination_planet == tarPlanet.ID:
                    attackPlanet = False

            if attackPlanet == True:
                dist = state.distance(currPlanet.ID, tarPlanet.ID)
                attackList.append((dist, currPlanet, tarPlanet))

    if len(attackList) == 0:
        return False

    attackList.sort()

    if len(attackList) >= 2 and attackList[0][2].num_ships > attackList[1][2].num_ships:
        start_planet = attackList[1][1]
        target_planet = attackList[1][2]
    else:
        start_planet = attackList[0][1]
        target_planet = attackList[0][2]

    attackNum = 1 + target_planet.num_ships

    if not start_planet or not target_planet:
        return False
    elif target_planet.num_ships + 50 > start_planet.num_ships:
        return False
    else:
        return issue_order(state, start_planet.ID, target_planet.ID, attackNum)
