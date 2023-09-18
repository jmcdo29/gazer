import { render } from '@testing-library/react';

import UiStore from './ui-store';

describe('UiStore', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiStore />);
    expect(baseElement).toBeTruthy();
  });
});
