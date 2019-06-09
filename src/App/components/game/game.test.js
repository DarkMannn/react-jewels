import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Game from './game.js';
import Board from '../board/board.js';

Enzyme.configure({ adapter: new Adapter() });

describe('Board component', () => {
    it('renders properly', async () => {
        const wrapper = shallow(<Game></Game>);
        expect(wrapper.find('div')).toBeTruthy();
        expect(wrapper.find('p')).toBeTruthy();
        expect(wrapper.find(Board)).toBeTruthy();
    });
});
