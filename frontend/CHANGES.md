Changelog - Design merge notes

- 2025-12-16: Merged some design assets and components from `free-react-tailwind-admin-dashboard-main`:
  - Added `/public/images/logo/logo.svg` (original free-react logo).
  - Added `ThemeToggleButton`, `NotificationDropdown`, and `UserDropdown` components in `src/components/common` and integrated into `Header`.
  - Added a static fallback dataset `src/data/staticCourses.js` used when API returns no data.
  - Updated `CourseContext` to use static fallback data and expose `isFallback` state; pages show a small badge when static data is in use.

Notes:
- Static placeholder images use an external placeholder URL to avoid copying binary assets.
- Next steps: copy additional public images/icons and convert any more dashboard layout components from free-react as needed.
