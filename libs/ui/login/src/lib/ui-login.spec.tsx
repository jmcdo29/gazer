import { render } from '@testing-library/react';

import UiLogin from './ui-login';

describe('UiLogin', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiLogin />);
    expect(baseElement).toBeTruthy();
  });
});
