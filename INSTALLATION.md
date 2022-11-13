# INSTALLATION

1. Boot the Raspberry Pi by plugging in the USB C power supply cable

<img width="200" alt="Screen Shot 2022-11-13 at 9 47 41 AM" src="https://user-images.githubusercontent.com/3166481/201515724-b388cac3-fa72-4503-8eb6-b26fd038e68c.png">

2. Open the Terminal app by clicking on the menu bar shortcut or pressing Ctrl-Alt-T

<img width="200" alt="Screen Shot 2022-11-13 at 9 49 33 AM" src="https://user-images.githubusercontent.com/3166481/201515818-be9ac2f4-3191-4e2d-9ac1-d0cbd26a26a5.png">

3. Change directories to the project directory in the terminal and run the python server on port 8000

```sh
cd ~/git/this-statement-is-false
python3 -m http.server 8000
```

<img width="300" alt="Screen Shot 2022-11-13 at 9 51 27 AM" src="https://user-images.githubusercontent.com/3166481/201515878-01faaf3a-b430-4941-a9a2-2c60ad3a662c.png">

4. Open Chromium by clicking on the menu bar shortcut

<img width="200" alt="Screen Shot 2022-11-13 at 9 49 33 AM" src="https://user-images.githubusercontent.com/3166481/201515818-be9ac2f4-3191-4e2d-9ac1-d0cbd26a26a5.png">

5. Go to `localhost:8000`

<img width="200" alt="Screen Shot 2022-11-13 at 9 54 12 AM" src="https://user-images.githubusercontent.com/3166481/201516023-1ef495b9-bd22-432f-b906-6d077f12d099.png">

6. Put Chromium in fullscreen (F11 or `...` Menu -> `[]` Icon)
7. Place mouse offscreen and turn off
8. Open a new Terminal tab and run the following, which will disable the Meta (start menu) and capslock keys

```sh
cd ~/git/this-statement-is-false
chmod +x disable_keys.sh
./disable_keys.sh
```

# Pulling updates

1. Open a new Terminal tab
1.

```sh
cd ~/git/this-statement-is-false
git pull
```

1. Hard refresh Chromium by pressing Ctrl-Shift-R

- If this doesn't work try Ctrl-F5 (Ctrl-Fn-F5)
- If this doesn't work press Ctrl-Alt-I to open Developer Tools -> Network -> Disable Cache and refresh normally (Ctrl-R)

# Notes on keyboard

On this keyboard, Ctrl is where Capslock normally is and vice versa. The Ctrl key has Ctrl written on it. If you toggle Capslock you'll want to untoggle it.

The start menu key and Option/Alt are swapped on this keyboard, so Alt is the 2nd key from the left on the bottom row, not the 3rd.
