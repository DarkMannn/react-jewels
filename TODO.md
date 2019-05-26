# React-Jewels Game

## To do:
- [ ] game engine
- [x] react app folder structure
- [ ] react view
- [ ] react animation
- [ ] draw jewels
- [ ] terminal view (different repository)
- [ ] make README.MD

### Game Engine:
- mappings for jewels/colors
- 8x8 field
- combos:
  - 3 in line - ordinary
  - 4 in line, 4 in square - fire square
  - 5 in line, 5 in T or L - lightning square
  - 6 combo - destroyer square
- algorithm for checking validity
- algorithm for dropping down new squares
- algorithm for the order of combo execution

const comboHash = {
    x1: x5: 1,
    x1y1: x5y1: 1,
    y0: {
        from: x1,
        to: x4,
        value: 1,
        active: x2
    },
    x3: {
        from: y0,
        to: y2,
        value: 1,
        active: y0
    },

};

const rowColArr = {
    x: [
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
    ],
    y: [
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null],
        [null, null, null, null, null, null, null, null]
    ]
};

const hash = {
    x: [
        [[1, 3], [5, 8]]
    ],
    y: [
        [1, 2, 3, 5, 6, 7, 8]
    ]
};
