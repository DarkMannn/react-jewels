import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Board from './board.js';
import Jewel from '../jewel/jewel.js'

Enzyme.configure({ adapter: new Adapter() });
const BOARD_WIDTH = 8;
const BOARD_HEIGHT = 8;

describe('Board component', () => {
    it('renders properly', async () => {
        const wrapper = shallow(<Board></Board>);
        expect(wrapper.find('div')).toBeTruthy();
        expect(wrapper.find(Jewel).length).toBe(BOARD_HEIGHT * BOARD_WIDTH);
    });
});
