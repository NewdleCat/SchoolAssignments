

def if_neutral_planet_available(state):
    return any(state.neutral_planets())


def have_largest_fleet(state):
	if len(state.my_planets()) >= 7:
		return True
	else:
		return False

    # return sum(planet.num_ships for planet in state.my_planets()) \
    #          + sum(fleet.num_ships for fleet in state.my_fleets()) \
    #        > sum(planet.num_ships for planet in state.enemy_planets()) \
    #          + sum(fleet.num_ships for fleet in state.enemy_fleets())
