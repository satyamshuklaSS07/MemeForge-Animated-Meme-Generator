# MemeForge — Animated Meme Generator

A colorful, responsive meme generator created for the Veda Technology Web Development internship task.

## Live features

- Upload or drag & drop an image
- Built-in local meme templates
- Editable top and bottom text
- Font family and size controls
- Text outline/stroke control
- Text color picker
- Text shadow toggle
- Uppercase toggle
- Live Canvas preview
- Randomize button
- Reset editor
- Download final meme as PNG
- Responsive glassmorphism UI with animated background effects

## Tech Stack

- HTML5
- CSS3
- JavaScript
- Canvas API
- FileReader API

## How it works

1. The user selects an image using the file input or drag & drop.
2. JavaScript loads the image with `FileReader`.
3. The Canvas API draws the image using a cover-style calculation.
4. Top and bottom text are wrapped so long text stays inside the canvas.
5. Styling controls update the canvas immediately.
6. `canvas.toDataURL("image/png")` creates a downloadable PNG.

## Run locally

No build tool is required.

1. Download or clone the repository.
2. Open the project folder in VS Code.
3. Open `index.html` with Live Server, or use any local static server.
4. Upload an image and start editing.

## Suggested Git commands

```bash
git init
git add .
git commit -m "Complete animated meme generator"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/Meme-Generator.git
git push -u origin main
```

## Interview Questions

### 1. How does the Canvas API draw text over an image?
The image is drawn first with `drawImage()`. Then the 2D canvas context uses `fillText()` and `strokeText()` to draw the text on top.

### 2. How is the canvas exported?
The project uses `canvas.toDataURL("image/png")` and creates a temporary download link.

### 3. How is long text handled?
The text is split into words and measured with `measureText()`. New lines are created whenever the current line would exceed the available canvas width.

### 4. Why use FileReader?
FileReader lets the browser read a locally selected image and convert it into a data URL without uploading the file to a server.

### 5. Is a backend required?
No. This version is fully client-side. The browser handles image loading, canvas rendering and PNG export.

## Project Purpose

This project practices Canvas API usage, file handling, responsive UI design, text rendering, and image export in a practical web application.

## Author

Satyam Shukla
