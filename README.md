# XSlides2

XSlides2 is a new version of XSlides that works without offline-XSLT.
The advantage is that it becomes easier to use.
Users will no longer have to run make in order to create the viewable version of their slides.

# Features

## Implemented
- Pluggable layouts
  Currently provides layouts: alien, alienTV, comic, oldschool, original, sansserif, seventies and terminal.
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
- Automatic choice of font size using a smart formula.
  The formula assumes perfect presentation `font-size` at 640x480 and calculates the necessary that at a resolution of 640x480, the default font size would be perfect for presentation.
- Sticky table of contents (checkbox)
- Style override for individual slides (class)
- Help
  Press '?' or 'F1' for displaying a help how to use XSlides.
- Footer
  - Support for copyright meta
  - 'F' key for toggling the visibility of the footer
  - Button to display help in footer.

## Planned
- Better layout of footer.
- Remember whether footer was visible, and hide it accordingly.
- Keys +/- and </> to increase / decrease font size.
- Configure whether h is vi key or help key. Default should be help key, but selection of vi key should be remembered permanently.
- Auto-align slides based on content. Left-aligned in case the slide contains `ul`, `ol`, `dl` or `pre` elements. Center-aligend otherwise.
- Style override for individual slides (style)
- Close button for sticky table of contents
- Configuration dialog
- Menu for selecting the style
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
- Slide-types:
  - with and without headline
  - default 1 column
  - 2 columns
  - 2 rows
  - 2x2 columns/rows, optionally with joined left or right column, joined top or bottom row
- 'A' key for toggling between current slide and all slides / view as vertical
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
- style parameter currently broken. ?style=alien in the URL is currently ignored.

# Links
- http://www.w3.org/Talks/Tools/Slidy2/ Slidy / Slidy2 by Dave Raggett
