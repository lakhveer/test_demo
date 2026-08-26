import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../context/ThemeContext';
import { WalletProvider } from '../context/WalletContext';
import Navbar from '../components/layout/Navbar';
import Home from './Home';

class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}
global.IntersectionObserver = MockIntersectionObserver;

function renderApp() {
  return render(
    <MemoryRouter>
      <ThemeProvider>
        <WalletProvider>
          <Navbar />
          <Home />
        </WalletProvider>
      </ThemeProvider>
    </MemoryRouter>
  );
}

beforeEach(() => {
  localStorage.clear();
});

test('Home defaults to light mode (no dark class on its wrapper)', () => {
  const { container } = renderApp();
  const homeRoot = container.querySelector('main') || container.firstChild;
  const darkWrapper = container.querySelector('.dark');
  expect(darkWrapper).toBeNull();
});

test('clicking the navbar toggle adds the dark class to Home\'s wrapper', () => {
  const { container } = renderApp();

  expect(container.querySelector('.dark')).toBeNull();

  const toggleButton = screen.getByLabelText(/toggle dark mode/i);
  fireEvent.click(toggleButton);

  const darkWrapper = container.querySelector('.dark');
  expect(darkWrapper).not.toBeNull();

  // the element carrying the dark: utility classes must be a DESCENDANT
  // of the .dark element, not the same element (Tailwind's :is(.dark *) rule)
  const styledChild = darkWrapper.querySelector('.dark\\:bg-secondary-900');
  expect(styledChild).not.toBeNull();
  expect(styledChild).not.toBe(darkWrapper);
});

test('clicking the toggle twice returns Home to light mode', () => {
  const { container } = renderApp();
  const toggleButton = screen.getByLabelText(/toggle dark mode/i);

  fireEvent.click(toggleButton);
  expect(container.querySelector('.dark')).not.toBeNull();

  fireEvent.click(toggleButton);
  expect(container.querySelector('.dark')).toBeNull();
});

test('theme choice persists to localStorage', () => {
  renderApp();
  const toggleButton = screen.getByLabelText(/toggle dark mode/i);

  fireEvent.click(toggleButton);
  expect(localStorage.getItem('theme')).toBe('dark');

  fireEvent.click(toggleButton);
  expect(localStorage.getItem('theme')).toBe('light');
});

test('Navbar itself never receives a dark class (scoped to Home only)', () => {
  const { container } = renderApp();
  const toggleButton = screen.getByLabelText(/toggle dark mode/i);
  fireEvent.click(toggleButton);

  const nav = container.querySelector('nav');
  expect(nav.className).not.toMatch(/(^|\s)dark(\s|$)/);
  expect(nav.querySelector('.dark')).toBeNull();
});
