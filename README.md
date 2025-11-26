# Camcookie DOCS
By: @camcookie876

## Info on:
- Camcookie Music (@camcookiem)
- Camcookie Books (@camcookieb)
- Camcookie Games (@camcookieg)


# **Developer Panel — Full Capability List**

## **1. DevMode Access & Security**
- Locked behind passcode **66554433221100**
- Unlock options:
  - Remember for this session
  - Remember for 24 hours
  - Don’t remember (default)
- DevMode resets when:
  - Browser/tab closes (session)
  - 24 hours pass (if chosen)
- DevTools only appear after unlocking

---

# **2. DevTools Panel UI**
- Draggable panel  
- Resizable panel  
- Position saved in **localStorage**  
- Size saved in **localStorage**  
- Active tab saved in **sessionStorage**  
- Themed UI (matches your current theme)  
- Smooth animations  
- Header with:
  - Title
  - Pin button (future behavior)
  - Close button  
- Tab bar with:
  - **Elements**
  - **Styles**
  - **Console**
  - **Network**
  - **Storage**
  - **Theme**
  - **Page**

---

# **3. Elements Tab (Inspector)**
### Inspector Mode
- Hover highlight (blue overlay)
- Click to lock selection
- Prevents selecting DevTools panel itself
- Auto‑updates info panel

### Element Information
- Tag name  
- ID  
- Classes  
- Attributes  
- Inline styles  
- Text content (first 200 chars)

### Breadcrumb Navigation
Shows full DOM path, e.g.:

```
html > body > div#main.container > p.text
```

### Copy Tools
- Copy CSS selector  
- Copy outerHTML  
- Copy innerHTML  
- Copy textContent  

---

# **4. Styles Tab (Skeleton for now)**
- Placeholder ready for:
  - Computed styles
  - Inline styles
  - Inherited styles
  - Live editing

(This is the next tab we can fully implement.)

---

# **5. Console Tab (Fully Functional)**
- Custom JavaScript console  
- Supports:
  - `log()`
  - `warn()`
  - `error()`
  - `clear()`
- Command input with:
  - Enter to run
  - Arrow‑up/down history navigation
- Console history saved in **sessionStorage**
- Output area with auto‑scroll
- Errors shown in red
- Warnings shown in gold

---

# **6. Network Tab (Lite Monitor)**
- Logs all `fetch()` calls
- Shows:
  - URL
  - Method
  - Status
  - Response time (ms)
- Updates automatically as your app loads data

---

# **7. Storage Tab (Viewer)**
- Shows **localStorage** contents  
- Shows **sessionStorage** contents  
- Scrollable viewer  
- Displays all keys and values  
- Useful for debugging:
  - Theme
  - DevMode
  - Panel position/size
  - Accessibility settings

---

# **8. Theme Tab**
- Shows current theme name  
- Lists all CSS variables for that theme  
- Displays their computed values  
- Export theme as JSON  
- Ready for:
  - Live editing
  - Color pickers
  - Import theme

---

# **9. Page Tab**
Tools for capturing or exporting the page:

- Screenshot full page (via print)
- Save HTML snapshot
- Save DOM text snapshot

---

# **10. Right‑Click Menu Integration**
The DevTools panel is launched from the right‑click menu:

- “Developer Tools” button:
  - Opens DevTools if unlocked
  - Shows passcode prompt if locked

Right‑click menu also includes:

### User Tools
- Print page  
- Copy URL  
- Copy title  
- Copy all text  
- Copy all links  
- Save page as HTML  
- Save page as Markdown  

### Media Tools
- List all image URLs  
- List all audio URLs  
- List all video URLs  
- Extract all links (file)  
- Extract all text (file)  

### Accessibility Tools
- Increase text size  
- Decrease text size  
- High‑contrast mode  
- Dyslexia‑friendly font  
- Settings saved in **localStorage**

### Info Tools
- Download info as PDF  
- Save info as .txt  
- Screenshot page  

---

# **11. Internal Architecture & Persistence**
- DevTools panel:
  - Position saved in localStorage
  - Size saved in localStorage
  - Active tab saved in sessionStorage
- DevMode:
  - Session unlock saved in sessionStorage
  - 24‑hour unlock saved in localStorage
- Console history saved in sessionStorage
- Accessibility settings saved in localStorage
- Theme saved in localStorage

---

# **12. Everything Ready for Expansion**
The panel is already structured to support:

- Full computed styles viewer  
- Live CSS editing  
- Theme variable editor with color pickers  
- Network response viewer  
- Storage editor (edit/delete keys)  
- Page screenshot to PNG (with html2canvas)  
- Console autocomplete  
- Event listener inspector  
- DOM tree viewer  

All the hooks are in place.