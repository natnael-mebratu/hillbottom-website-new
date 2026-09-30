Drop the Hill Bottom brand film here as:

    hillbottom-hero.mp4     (H.264, 1920x1080 or wider, no audio track needed)

The home page hero already points at this path. Until the file exists the hero
runs on the poster still (assets/img/hero-hillbottom-*.webp) with a slow drift,
which is what you are seeing now. No code change is needed when you add it --
the page detects the video and cross-fades to it automatically.

Optional, recommended:
    hillbottom-hero.webm    (VP9 -- smaller file, add a second <source> in _build/pages/home.mjs)
