# XSlides2

XSlides2 is a new version of XSlides that works without offline-XSLT.
The advantage is that it becomes easier to use.
Users will no longer have to run make in order to create the viewable version of their slides.

# Features

## Implemented
- Pluggable layouts
  Currently provides layouts: alien, alienTV, comic, oldschool and original.
- Input document is simple HTML
- Navigation between slides works with presenters
- Navigation between slides works with cursor keys
- Navigation between slides works with vi(m) shortcuts and commands
- Nativation between slides works with mouse wheel
- Main engine is JavaScript instead of XSLT
- Linking to individual slides is possible
  - via slide number
  - via id of an element on that slide (preferably the id of the h1)
  - If the current slide has elements with ids, the id of the first such element is shown in the URL
- Changing the hash in the URL jumps to the corresponding slide
- Slides can be linked to each other using the hashes
- Works nicely with other JavaScripts.
  Tested with google-code-prettify.
- `include` feature to include source code / document fragments
  use a `src` attribute on a `pre` element
- Utilizes google-code-prettify if available.
  Calls prettyPrint() if defined.
  If you want to prettify, use `https://google-code-prettify.googlecode.com/svn/loader/prettify.js` (not `run_prettify.js`)
  Manually include the skin like this: `https://google-code-prettify.googlecode.com/svn/loader/skins/desert.css`
  Or make the skin part of your style.
- Outline
  Press 'C' key for displaying a table of contents outline generated from the h1 elements
- Special hashes `#next()`, `#prev()`, `#previous()`, `#first()`, `#last()`, `#+(n)`, `#-(n)`

## Planned
- Automatic choice of font size
- Sticky table of contents (checkbox)
- Menu for selecting the style
- Style override for individual slides (stylesheet and inline)
- Inclusion of slides from other presentations
- Cursor navigation through table of contents
- Mouse click
- Swipe right, swipe left (tablet / mobile / touch screen)
- Font size control
- Notes and wrapping document can be created using HTML with special div elements
- Markdown to XSlides converter, Markdown interpreter
- Black slide
- Blank slide
- White slide
- FOP Stylesheet to create PDF
- Footer
  - Support for copyright meta
- Slide-types:
  - with and without headline
  - default 1 column
  - 2 columns
  - 2 rows
  - 2x2 columns/rows, optionally with joined left or right column, joined top or bottom row
- 'A' key for toggling between current slide and all slides / view as vertical
- 'F' key for toggling the visibility of the footer
- Presentation timer
- Incremental display
- Expand / Collapse
- Slide numbers
- ':' key for a vi-style command line
- Good support for HTML5 videos
- Good support for SVG
- Source-compabitility with Slidy2 - a simple replacement of XSlides with Slidy2 and vice versa should allow swapping between the two of them.
- Auto-hiding navigation bar
- Fullscreen control
- Drawing, Highlight

# Supported Browsers

## Tested, no known limitations
- Firefox
- Konqueror
- QupZilla
- Rekonq

## Tested, known limitations
These browsers have issues with `<pre src=""/>` when using the `file:` URI scheme:
- Chromium
- Epiphany
- Google Chrome
- Midori
For Chromium and Google Chrome, the workaround is to start the browser program with option `--disable-web-security`.
**WARNING** the option `--disable-web-security` does what it says, it disables web security, you should not use it!

## Support planned
- Android
- Chrome for Android
- Seamonkey
- Opera

## Support not planned
- Internet Explorer
- Safari

# Known Bugs / Issues
- google-code-prettify doesn't work well with the XML version.

# Links
- http://www.w3.org/Talks/Tools/Slidy2/ Slidy / Slidy2 by Dave Raggett
