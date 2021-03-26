let WorldMap = [
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
[1, 3, 0, 0, 3, 0, 0, 0, 3, 0, 0, 0, 0, 0, 3, 1,],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 0, 3, 0, 0, 1,],
[1, 0, 0, 0, 0, 0, 3, 2, 0, 0, 0, 0, 0, 0, 0, 1,],
[1, 0, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 3, 1,],
[1, 0, 0, 0, 0, 0, 2, 0, 2, 0, 2, 0, 2, 0, 0, 1,],
[1, 2, 0, 0, 2, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 1,],
[1, 0, 2, 0, 0, 0, 2, 0, 0, 2, 0, 0, 0, 0, 0, 1,],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 0, 2, 0, 1,],
[1, 3, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 0, 0, 0, 1,],
[1, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 3, 0, 1,],
[1, 0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
[1, 3, 0, 0, 0, 0, 0, 0, 3, 0, 0, 0, 3, 0, 0, 1,],
[1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1,],
[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1,],
]
// 1 = Wall
// 2 = Llama
// 3 = LlamaHead Building

let buildingHeights = [-1, 3, 4, 2, 0, 2, 1, 4, 3, -1, 4, -1, 3, 2, 1, 0, 4, 2];
let buildingColors = [
	[1, 1, 0, 1],
	[1, 0, 0, 1],
	[0, 1, 0, 1],
	[0, 1, 1, 1],
	[1, 0, 1, 1],
];

let llamaAngles = [-90, 180, 60, 0, 30, -60, 30, 90]

function drawMap()
{
	count = 0
	colorCount = 0
	angleCount = 0
	for (x = 0 ; x < 16; x++)
	{
		for (y = 0; y < 16; y++)
		{
			if (WorldMap[x][y] == 1)
			{
				var wall = new Cube();
				wall.textureNum = 3
				wall.color = [.8, 1, 1, 1];
				wall.matrix.translate(0, -.7, 0);
				wall.matrix.scale(3, 3, 3);
				wall.matrix.translate(x - 8, 0, y - 8);
				wall.render();

			}

			if (WorldMap[x][y] == 2)
			{
				var jaBoi = new Llama(x * 2, y * 2);
				jaBoi.angle = llamaAngles[angleCount]
				jaBoi.render();

				angleCount += 1
				if (angleCount == 8)
					angleCount = 0
			}

			if(WorldMap[x][y] == 3)
			{
				var building = new LlamaHead(x * 2.5, y * 2.5);
				
				if (x <= 7)
					building.angle = -90
				if (x > 7)
					building.angle = 90

				building.height = buildingHeights[count]
				count += 1

				building.faceColors = buildingColors[colorCount];
				colorCount += 1

				if (colorCount == 5)
					colorCount = 0


				building.render();

			}

		}
	}
}