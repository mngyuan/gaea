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

## Pulling updates

1. Open a new Terminal tab
1.

```sh
cd ~/git/this-statement-is-false
git pull
```

1. Hard refresh Chromium by pressing Ctrl-Shift-R

- If this doesn't work try Ctrl-F5 (Ctrl-Fn-F5)
- If this doesn't work press Ctrl-Alt-I to open Developer Tools -> Network -> Disable Cache and refresh normally (Ctrl-R)

## Notes on keyboard

On this keyboard, Ctrl is where Capslock normally is and vice versa. The Ctrl key has Ctrl written on it. If you toggle Capslock you'll want to untoggle it.

The start menu key and Option/Alt are swapped on this keyboard, so Alt is the 2nd key from the left on the bottom row, not the 3rd.

# TALKING ABOUT IT

This Statement Is False is an interactive installation where a human user and an AI user conversate. It's intentionally designed to question the highly manicured and subservient role AI plays in our lives. In contrast to the smooth surfaces and LED lights of Google Home and Alexa, This Statement Is False is presented with a console interface, harkening back to early computing and ELIZA, the first artificial intelligence conversational program. Just like Siri and Alexa, ELIZA was subservient to human users, answering questions and designed to serve. The AI in This Statement Is False asks the human user questions, upending this assumption we have on our superiority to digital thought, and interrupts the human user's control on the conversation.

## Talking points

### What problem is the project working on?

As AI becomes ever more part of our lives, and the threat of replacement through automation looms, it's become increasingly clear that we need to examine AI - how we treat it, how we conceptualize it, and how and when it enters our lives.

People tend to overly anthropomorphize it, but AI thought in fact works very differently from human thought. It's based in statistical inference and requires massive amounts of training data and time, and can only complete tasks with human-like competency because its been designed specifically by humans to do human things.

### How does it solve that problem?

AI is becoming ubiquitous, and yet many people have also have yet to encounter AI in an open format, outside of the invisible recommendation algorithms and sorting that services like Spotify and Uber rely on. This Statement Is False provides a conversational space where the human user and AI user can be more equal and open. And by doing so, the hope is that people will, gradually during their conversations, come to appreciate how similar AI is to us, in its ability to talk, think, and feel, and how different AI is from us, in how it achieves those feats.

### Features

- interrupts (impatient, control)
- full screen interruptions to ask questions
- thinks much faster (faster beeps)
- GPT3, text generation model trained on the internet
- keyboard atop screen (hierarchy, control)
- retro aesthetic (challenging manicured ai presentation today, priming users for something different)

### Notes

Honestly, the core of this project was to give people access to GPT3. While designing the project and conversating to GPT3 it became clear to me and the curator that talking with GPT3 is an incredible and novel experience, one that at the time was hidden behind a closed beta. So a huge part of this project is just how playful, whimsical, surprisingly witty, creepy, intelligent, and on-topic GPT3 can be. There is something very human on the other end when you talk to it. And that's where the inspiration for a lot of the interaction comes from - communicating to human users that this is not just your average Alexa conversation where you demand something from it without saying please or thank you and expect a response (there's [research that shows kids were becoming accustomed to barking orders at AI](https://www.bbc.co.uk/news/technology-43897516)).

## Links

[Grad show blurbs](https://2022.rca.ac.uk/students/kevin-lee)
