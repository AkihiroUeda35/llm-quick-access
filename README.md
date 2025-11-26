# Gemini/Claude Quick Search Chrome Extensions

Chrome extensions that provide direct access to Gemini and Claude from the address bar.

## Overview

This repository contains two separate Chrome extensions:

- **Gemini Quick Search** (`gemini/` directory): Search with Google Gemini using `g` keyword
- **Claude Quick Search** (`claude/` directory): Search with Anthropic Claude using `c` keyword

## Features

### Gemini Extension
Type `g` in the address bar to search with Gemini:
- `g What's the weather today?` -> Search and auto-submit to Gemini
- **Auto-submit**: Query is automatically inserted into Gemini's input field and submitted

### Claude Extension
Type `c` in the address bar to search with Claude:
- `c What's the weather today?` -> Search and auto-submit to Claude
- **Auto-submit**: Query is automatically inserted into Claude's input field and submitted

## Installation

### For Gemini Extension:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked extension"
4. Select the `gemini` folder

### For Claude Extension:
1. Open Chrome and go to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked extension"
4. Select the `claude` folder

## Usage

### Gemini Extension
1. Type `g` in the address bar
2. Press the space key
3. Enter your question and press Enter
   - Example: `g What's the weather today?`
   - Example: `g Tell me about TypeScript`
   - Example: `g Python best practices`

### Claude Extension
1. Type `c` in the address bar
2. Press the space key
3. Enter your question and press Enter
   - Example: `c What's the weather today?`
   - Example: `c Tell me about TypeScript`
   - Example: `c Python best practices`

## Notes

- These are service-specific extensions for Gemini and Claude
- May require updates if Gemini or Claude's page structure changes

## Privacy Policy

This Privacy Policy outlines how user information is handled by the Chrome extensions "Gemini Quick Access" and "Claude Quick Access" (hereinafter referred to as "these extensions"). These extensions have been developed with the highest priority on protecting user privacy.

### Information Collected and Its Purpose

These extensions collect the following information:

* **Search queries entered by the user in the address bar**: This includes queries entered after the extensions' keywords (`g` for Gemini, `c` for Claude).
* **Purpose of Use**: The collected search queries are used **solely for the purpose of being sent directly to the Gemini or Claude service based on the user's command**. This data is not collected, stored, or shared by the developer of these extensions.

### Third-Party Data Sharing and Storage

The developer of these extensions does not provide or share user data, including personal information, with **any third parties**.

Furthermore, these extensions do not send or store user data on any servers or locally. All processing is completed within the user's browser, and data is sent directly to the respective service (Gemini or Claude).

### On the Use of External Services

These extensions use:
- **Gemini service provided by Google**: The handling of data on the Gemini service is governed by Google's Privacy Policy (https://policies.google.com/privacy)
- **Claude service provided by Anthropic**: The handling of data on the Claude service is governed by Anthropic's Privacy Policy (https://www.anthropic.com/privacy)

### Disclaimer

These extensions rely on the Gemini and Claude services provided by Google and Anthropic respectively. In the event of changes to these services' specifications or related issues, the extensions may not function properly, and the developer assumes no responsibility for such occurrences.

### Contact

If you have any questions or feedback regarding this Privacy Policy, please contact us via the GitHub repository page.
