import { render } from '@testing-library/react';
import { describe, test } from 'vitest';
import App from "./App";

describe('first', () => { 
    test('should render without crashing', () => {
        render(<App />);
    });
})
