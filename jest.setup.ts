// This file is used to set up the Jest testing environment

// Mock the window.matchMedia function which is not available in the test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(), // deprecated
    removeListener: jest.fn(), // deprecated
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock the ResizeObserver which is not available in the test environment
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock the IntersectionObserver which is not available in the test environment
global.IntersectionObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}));

// Mock the window.scrollTo function
window.scrollTo = jest.fn();

// Mock the window.alert function
window.alert = jest.fn();

// Mock the window.confirm function
window.confirm = jest.fn();

// Mock the window.prompt function
window.prompt = jest.fn();

// Mock the window.open function
window.open = jest.fn();

// Mock the window.print function
window.print = jest.fn();

// Mock the window.requestAnimationFrame function
window.requestAnimationFrame = jest.fn(callback => setTimeout(callback, 0));

// Mock the window.cancelAnimationFrame function
window.cancelAnimationFrame = jest.fn();

// Mock the window.fetch function
window.fetch = jest.fn();

// Mock the window.localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

// Mock the window.sessionStorage
const sessionStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
  length: 0,
  key: jest.fn(),
};
Object.defineProperty(window, 'sessionStorage', { value: sessionStorageMock }); 