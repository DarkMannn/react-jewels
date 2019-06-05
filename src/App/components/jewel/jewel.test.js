import React from 'react';
import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Jewel from './jewel.js';

Enzyme.configure({ adapter: new Adapter() });

describe('Jewel component', () => {
    it('renders properly', async () => {
        const wrapper = shallow(<Jewel backgroundColor='green'></Jewel>);
        expect(wrapper.find('div')).toBeTruthy();
    });
});
