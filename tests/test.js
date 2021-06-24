import React from 'react';
import renderer from 'react-test-renderer';
import App from '../components/SheepNote.js';


it("test", () => {
    expect(1).toEqual(1)
})

 
test('Renders snapshot as expected', () => {
        const tree = renderer.create(<App />).toJSON();
        expect(tree).toMatchSnapshot();
    });