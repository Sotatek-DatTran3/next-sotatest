# Setup Instructions

## Auto-formatting is now configured! 

### What's been set up:

1. **Prettier** for code formatting with import sorting
2. **ESLint** with unused imports removal
3. **VS Code settings** for format on save and organize imports

### To complete the setup:

1. **Install the Prettier extension** in VS Code:
   - Press `Ctrl+Shift+X` to open extensions
   - Search for "Prettier - Code formatter"
   - Install it

2. **Replace your current VS Code settings**:
   ```bash
   mv .vscode/settings-prettier.json .vscode/settings.json
   ```

### Features you now have:

- ✅ **Auto-format on save** (once Prettier extension is installed)
- ✅ **Auto-remove unused imports** on save
- ✅ **Auto-organize imports** with these rules:
  - React imports first
  - Next.js imports second  
  - Other npm packages third
  - Local imports last
- ✅ **ESLint integration** for code quality

### Available scripts:

- `npm run format` - Format all files
- `npm run format:check` - Check if files need formatting
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically

### Import ordering example:

```typescript
import React from "react";

import { NextPage } from "next";
import Link from "next/link";

import axios from "axios";
import { Button } from "@mui/material";

import { MyComponent } from "../components/MyComponent";
import "./styles.css";
```
