# WEB103 Project 4 - DIY Delight (Bolt Bucket ) 🏎️

Submitted by: **Thuan Nguyen**

About this web app: **DIY Delight (Bolt Bucket) is a car customizer app that lets users create, customize, view, edit, and delete custom cars. Users can choose from multiple exterior colors, wheel styles, interior options, and roof types — with live price updates and validation.**

Time spent: **10** hours

## Required Features

The following **required** functionality is completed:

- [x] **The web app uses React to display data from the API.**
- [x] **The web app is connected to a PostgreSQL database, with an appropriately structured `CustomItem` table.**
  - [x] **NOTE: Your walkthrough added to the README must include a view of your Render dashboard demonstrating that your Postgres database is available**
  - [x] **NOTE: Your walkthrough must include a demonstration of your table contents. Use the psql command `SELECT * FROM tablename;` to display your table contents.**
- [x] **Users can view multiple features of the `CustomItem` (e.g. car) they can customize (e.g. wheels, exterior, etc.)**
- [x] **Each customizable feature has multiple options to choose from (e.g. exterior could be red, blue, black, etc.)**
- [x] **On selecting each option, the displayed visual icon for the `CustomItem` updates to match the option the user chose.**
- [x] **The price of the `CustomItem` (e.g. car) changes dynamically as different options are selected OR The app displays the total price of all features.**
- [x] **The visual interface changes in response to at least one customizable feature.**
- [x] **The user can submit their choices to save the item to the list of created `CustomItem`s.**
- [x] **If a user submits a feature combo that is impossible, they should receive an appropriate error message and the item should not be saved to the database.**
- [x] **Users can view a list of all submitted `CustomItem`s.**
- [x] **Users can edit a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can delete a submitted `CustomItem` from the list view of submitted `CustomItem`s.**
- [x] **Users can update or delete `CustomItem`s that have been created from the detail page.**

The following **optional** features are implemented:

- [ ] Selecting particular options prevents incompatible options from being selected even before form submission

The following **additional** features are implemented:

- [x] Real car images from Chevrolet's official CGI configurator for each option
- [x] Hover tooltip on detail page showing option name, color, and price
- [x] Separate detail page with 2x2 image grid for all customizations

## Video Walkthrough

Here's a walkthrough of implemented required features:

[Video Walkthrough](https://i.imgur.com/g4lB8TK.mp4) | Gif Images: https://imgur.com/a/qT8QfBR.gif

[ScreenToGif](https://www.screentogif.com/) for Windows

<!-- Recommended tools:
[Kap](https://getkap.co/) for macOS
[ScreenToGif](https://www.screentogif.com/) for Windows
[peek](https://github.com/phw/peek) for Linux. -->

## Notes

<!-- Describe any challenges encountered while building the app -->

- Setting up the database schema to support multiple foreign keys referencing the same `options` table
- Implementing dynamic price calculation across multiple optional features
- Ensuring layout consistency between Create and Edit pages

## License

Copyright 2025 [Your Name Here]

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

> http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
