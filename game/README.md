## Asteroid Survival

This is a small browser-based asteroid survival game built with TypeScript, HTML Canvas, and React.

The game runs on a custom engine built from scratch, with a simple game loop handling updates, rendering, and collision logic. React is used only for the UI layer (HUD, overlays, and controls), while the canvas handles all real-time gameplay rendering.

---

## Features

- Start / pause / reset game flow
- Ship movement and shooting
- Asteroid spawning and splitting
- Collision detection between ship, bullets, and asteroids
- Score tracking (asteroids destroyed)
- Lives system with game over state
- React-based overlay UI on top of canvas

---

## Controls

- Enter → Start / Restart game  
- Escape → Pause / Resume game  
- R → Reset game  

---

## Architecture Overview

The project is split into the following parts:

- Engine: runs the game loop and handles updates/rendering
- Entities: ship, bullets, asteroids with individual behavior
- Handlers: game logic such as collisions and updates
- Input system: keyboard control handling
- Game store: central state for score, lives, and status
- React UI layer: overlays, HUD, menus, and controls hints

---

## Rendering

All gameplay is rendered on an HTML canvas. React is used only for UI elements layered on top of the canvas (HUD, menus, and overlays).

---

## Purpose

This project was built as a learning exercise to understand how real-time game loops, entity systems, and state management work together in a browser environment without using external game engines.