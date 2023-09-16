import { render } from '@testing-library/react';

import UiGallery from './ui-gallery';

describe('UiGallery', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<UiGallery />);
    expect(baseElement).toBeTruthy();
  });
});
