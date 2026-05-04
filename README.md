# Spotify Web Player Clone

A fully functional, responsive music streaming interface built with modern Vanilla JavaScript, HTML5, and CSS3. This project replicates the core user experience of the Spotify desktop application.


##  Features
- **Dynamic Content Rendering:** Automatically populates "Recently Played," "Top Artists," and "New Releases" sections using JavaScript data structures.
- **Full Player Controls:** Real-time progress bar tracking, volume adjustment, and song navigation (Next/Previous).
- **Playback Logic:** Functional Shuffle and Repeat modes (Off/All/One) that alter the play queue logic.
- **Custom Playlist Creation:** Users can dynamically add new playlists to the sidebar during their session.
- **Interactive UI:** Hover-triggered play buttons, "Heart" toggle for liking songs, and smooth CSS transitions.
- **Custom Gradient Themes:** Distinct visual identities for songs and artists using CSS linear-gradient utility classes.

##  Technical Stack
- **HTML5:** Semantic structure for accessibility and SEO.
- **CSS3:** Custom properties (CSS variables), Grid Layout, Flexbox, and backdrop-filters for the glassmorphism effect.
- **JavaScript (ES6+):** Interval-based progress tracking, Event Delegation, and Set-based state management for liked songs.
- **FontAwesome:** Scalable vector icons for the UI control set.

##  Project Structure
```text
├── index.html   # Main application structure and Sidebar/Main/Player sections
├── style.css    # Custom design system, color palettes, and responsive grid
└── script.js    # Playback logic, data arrays, and DOM manipulation functions

## How to Use
Browse: Explore the "Good evening" featured row or the cards below.

Play: Click any song card to start the player and update the "Now Playing" bar.

Control: Use the player bar at the bottom to scrub through a song, adjust volume, or toggle shuffle mode.

Interact: Click the heart icon on the player bar to save a song to your session.

## Future Roadmap
[1] Integration with a Music API (like Spotify Web API or Last.fm).

[2] Persistence of playlists and likes using localStorage.

[3] Real audio playback integration using the HTML5 <audio> tag.

## License
MIT

Created with html, css and JavaScript
