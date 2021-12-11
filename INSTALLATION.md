# INSTALLATION

- turn off the hotkeys
- put chromium in fullscreen (f11)
- position mouse offscreen
- turn off mouse
- set up chrome site settings for autoplay

# `~/disable_keys.sh`

```sh
xmodmap -e 'keycode 133='	# left meta
xmodmap -e 'keycode 64=' 	# left alt
xmodmap -e 'keycode 108=' 	# right alt
xmodmap -e 'keycode 37=' 	# left ctrl
xmodmap -e 'keycode 105='	# right ctrl
xmodmap -e 'keycode 66=' 	# caps
```

## long term

- disable sleep
- host on cloud
- set up session saving to local storage
