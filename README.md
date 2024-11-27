# Placeholder Service

Placeholder Service is a service used for ***fast*** placeholder image generation.

## Usage

Run the server with ``node .\index.mjs``, then head to ``http://127.0.0.1/[width]x[height]`` in order to generate a basic placeholder.
  
### Parameters

- ``bg`` - Sets the background color, 
    - accepts any valid CSS-style colors,
- ``fg`` - Sets the text color,
    - accepts any valid CSS-style colors,
- ``t`` - Sets the text
    - Default is `[width]x[height]`
- ``s`` - Sets the text scale,
    - Defaults to `1` if not provided

### Examples
You can combine all and any parameters in whatever ways you please.
- ``http://127.0.0.1/1920x1080``  
    - Will generate a 1920 x 1080 default placeholder,
- ``http://127.0.0.1/1920``
    - Will generate a 1920 x 1920 default placeholder,
- ``http://127.0.0.1/1920?bg=639``
    - Will generate a placeholder with a `#663399` (purple-ish) background,
- ``http://127.0.0.1/1920?fg=ff0``
    - Will generate a placeholder with text colored `#ffff00`(yellow),
- ``http://127.0.0.1/1920?t=Hello!``
    - Will generate a placeholder with "Hello" written on it,
- ``http://127.0.0.1/1920?t=Hello!&s=1.4``
    - Will generate a placeholder with a bigger "Hello" written on it,
- ``http://127.0.0.1/3840?bg=639&fg=ff0&t=Hello!&s=2``
    - Will generate a 3840 x 3840 placeholder with a big "Hello" written on it, with background color set to ``#663399`` and text colored ``#ffff00``,

### Limits
You can configure the limits by changing a few constants at the top of the ``index.mjs`` file.
- Max width is 15360 (px),
- Max height is equal to max width,
- Min width is 1 (px),
- Min height is equal to min height,