import { render } from '@testing-library/react';

import UiNav from './ui-nav';

describe('UiNav', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiNav />);
    expect(baseElement).toBeTruthy();
  });
});
