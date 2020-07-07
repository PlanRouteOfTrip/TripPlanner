const getSets = require('./index');

let points = [
    {
      index: 0,
      minsToSpend: 40,
    },
    {
      index: 1,
      minsToSpend: 60,
    },
    {
      index: 2,
      minsToSpend: 100,
    }
  ];

  let pointsTwo = [
    {
      index: 0,
      minsToSpend: 40,
    },
    {
      index: 1,
      minsToSpend: 60,
    },
    {
      index: 2,
      minsToSpend: 1000,
    }
  ];

  //expected TravelTimes:
//   let travelTimes = [
//     [0, 10, 40],
//     [10, 0, 33],
//     [40, 33, 0]
//   ];

test('getSets returns Null if no matching sets', () => {
    expect(getSets(points, 30)).toBe([]);
});

test('getSets returns one point', () => {
    let result = getSets(points, 40)
    expect(result[0][0].index).toBe(0);
});

test('getSets does not return repeating sets w/o travel', () => {
    let result = getSets(points, 70)
    expect(result.length).toBe(2);
});

test('getSets does not return repeating sets with travel', () => {
    let result = getSets(pointsTwo, 500)
    expect(result.length).toBe(2);
});

test('getSets does not return repeating sets with travel', () => {
    let result = getSets(points, 500)
    expect(result.length).toBe(6);
});

