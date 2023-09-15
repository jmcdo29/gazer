import { render } from '@testing-library/react';

import UiRouter from './ui-router';

describe('UiRouter', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiRouter />);
    expect(baseElement).toBeTruthy();
  });
});
