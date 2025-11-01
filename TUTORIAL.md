# Memory Fitness - Quick Tutorial

## 📱 What is This?

**Memory Fitness** (also called "Number Recall Trainer") is a Progressive Web App (PWA) that helps you train your working memory by practicing number recall.

### How It Works:
1. **Generate** → App creates a random sequence of digits (e.g., "3, 7, 2, 9")
2. **Speak** → The app reads the numbers aloud using text-to-speech
3. **Remember** → You try to memorize the sequence
4. **Reveal** → Click "Reveal" to check the answer and see your elapsed time

---

## 🚀 Quick Start

### Option 1: Use the Simple HTML Version
```bash
# Open index.html directly in your browser
open index.html
# Or on Linux/Windows:
# xdg-open index.html  # Linux
# start index.html     # Windows
```

### Option 2: Use the PWA Version (Recommended)
The PWA version (`pwa/`) includes:
- Service worker for offline support
- Better mobile experience
- Installable as an app

```bash
# Serve locally (requires a web server)
cd pwa

# Using Python 3:
python3 -m http.server 8000

# Or using Node.js (if you have npx):
npx serve .

# Then open: http://localhost:8000
```

---

## 🎯 Using the App

### Basic Workflow:

1. **Configure Settings:**
   - **Language**: Choose English (en-US) or Chinese (zh-CN/zh-TW)
   - **Voice**: Select a specific TTS voice, or use "Auto"
   - **Number of digits**: Set how many digits to remember (1-24)
   - **Voice speed**: Adjust playback rate (0.5x - 1.8x)
   - **Options**:
     - ✓ Speak digits one-by-one (adds pauses: "1, 2, 3")
     - ✓ Allow leading zeros (e.g., "00753")

2. **Start Training:**
   - Click **"Start (Speak)"**
   - Listen carefully as the numbers are read
   - Try to remember the sequence

3. **Check Your Memory:**
   - Click **"Reveal"** when ready
   - See the correct answer and elapsed time
   - Start a new round to continue practicing

### Tips:
- Start with 4-6 digits and gradually increase
- Use "Speak digits one-by-one" for easier recall
- Practice regularly to improve working memory
- The app saves your settings automatically

---

## 📂 Project Structure

```
memory_fitness/
├── index.html          # Simple standalone version (no PWA features)
├── pwa/                # PWA version (recommended)
│   ├── index.html      # Main HTML file
│   ├── app.js          # Core application logic
│   ├── styles.css      # Styling
│   ├── manifest.webmanifest  # PWA manifest
│   ├── service-worker.js    # Offline caching
│   └── icons/          # App icons
├── pwa2/               # Alternative PWA version (similar to pwa/)
├── hello.py            # Simple Python demo script
└── README.md           # Project description
```

---

## 🔧 Development

### Key Features to Understand:

1. **Text-to-Speech (TTS)**
   - Uses browser's `speechSynthesis` API
   - Supports multiple languages and voices
   - Customizable rate/speed

2. **Settings Persistence**
   - Uses `localStorage` to save preferences
   - Key: `nr_settings_v1`
   - Includes: language, voice, digits count, speed, session counter

3. **Number Generation**
   - `randomNDigitString()` creates random sequences
   - Can exclude leading zeros
   - Avoids consecutive identical digits (in simple version)

4. **Timing**
   - Uses `performance.now()` for precise timing
   - Starts when speech ends
   - Shows elapsed time when revealing

### Making Changes:

**To modify the number of digits range:**
- Edit `min="1" max="24"` in the digits input field

**To add a new language:**
- Add language option to `<select id="langSelect">`
- Add translation strings to `I18N_STRINGS` object (in `index.html`)

**To customize styling:**
- Edit `styles.css` (for PWA) or the `<style>` tag in `index.html`

---

## 📱 Installing as a PWA

1. Open the PWA version in a supported browser (Chrome, Edge, Safari)
2. Look for the install prompt or:
   - **Chrome/Edge**: Click the install icon in address bar
   - **Safari (iOS)**: Tap Share → Add to Home Screen
3. The app will work offline after first load (thanks to service worker)

---

## 🐍 Python Component

The `hello.py` script is a simple demo:
```bash
# Activate virtual environment (if using)
source venv/bin/activate  # On Mac/Linux
# venv\Scripts\activate   # On Windows

# Run the script
python3 hello.py
```

This currently just prints a greeting - it's not connected to the web app.

---

## 🎓 Training Tips

- **Start small**: Begin with 4-5 digits
- **Consistency**: Practice daily for best results
- **Progressive difficulty**: Increase digits gradually
- **Use timing**: Try to improve your recall speed
- **Different languages**: Practice in multiple languages to vary difficulty

---

## 💡 Next Steps

- Try increasing the digit count as you improve
- Experiment with different voice speeds
- Test your memory with and without "one-by-one" mode
- Install as PWA for easy access on mobile devices

Happy training! 🧠💪

