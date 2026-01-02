// @vitest-environment jsdom
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { FilterProvider } from '../context/FilterContext';
import { ComparisonProvider } from '../context/ComparisonContext';

// Mock MapComponent to avoid Leaflet DOM issues in the test environment
vi.mock('../components/MapComponent', () => ({
  MapComponent: () => {
    // return React element
    const React = require('react');
    return React.createElement('div', { 'data-testid': 'map-mock' });
  }
}));

import * as preschoolService from '../services/apiService';
import { PreschoolListPage } from './PreschoolListPage';

vi.mock('../services/apiService');

const makeResponse = (offset = 0, limit = 20) => ({
  data: {
    success: true,
    data: Array.from({ length: limit }).map((_, i) => ({
      id: offset + i + 1,
      name: `School ${offset + i + 1}`,
      address: 'Some address',
      latitude: 20.0,
      longitude: 78.0,
      images: [],
    })),
    pagination: { total: 40, limit, offset },
  },
});

describe('PreschoolListPage pagination', () => {
  beforeEach(() => {
    preschoolService.preschoolService.getAllPreschools = vi.fn((params) => {
      const offset = params?.offset || 0;
      return Promise.resolve(makeResponse(offset));
    });
  });

  it('loads first page and navigates to next page', async () => {
    render(
      <MemoryRouter>
        <FilterProvider>
          <ComparisonProvider>
            <PreschoolListPage />
          </ComparisonProvider>
        </FilterProvider>
      </MemoryRouter>
    );

    // Wait for first page to load
    await waitFor(() => expect(screen.getByText(/Found 40 preschools/)).toBeTruthy());

    // Should show first item and range 1-20
    expect(screen.getByText('School 1')).toBeTruthy();
    expect(screen.getByText(/Showing 1 to 20/)).toBeTruthy();

    // Click Next
    const nextBtn = screen.getByText(/Next/);
    await userEvent.click(nextBtn);

    // Wait for second page to load
    await waitFor(() => expect(screen.getByText('School 21')).toBeTruthy());
    expect(screen.getByText(/Showing 21 to 40 of 40/)).toBeTruthy();
  });
});