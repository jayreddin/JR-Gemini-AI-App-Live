📦JR-Gemini-AI-App-Live
 ┣ 📂.git
 ┃ ┣ 📂hooks
 ┃ ┃ ┣ 📜applypatch-msg.sample
 ┃ ┃ ┣ 📜commit-msg.sample
 ┃ ┃ ┣ 📜fsmonitor-watchman.sample
 ┃ ┃ ┣ 📜post-update.sample
 ┃ ┃ ┣ 📜pre-applypatch.sample
 ┃ ┃ ┣ 📜pre-commit.sample
 ┃ ┃ ┣ 📜pre-merge-commit.sample
 ┃ ┃ ┣ 📜pre-push.sample
 ┃ ┃ ┣ 📜pre-rebase.sample
 ┃ ┃ ┣ 📜pre-receive.sample
 ┃ ┃ ┣ 📜prepare-commit-msg.sample
 ┃ ┃ ┣ 📜push-to-checkout.sample
 ┃ ┃ ┣ 📜sendemail-validate.sample
 ┃ ┃ ┗ 📜update.sample
 ┃ ┣ 📂info
 ┃ ┃ ┗ 📜exclude
 ┃ ┣ 📂logs
 ┃ ┃ ┣ 📂refs
 ┃ ┃ ┃ ┣ 📂heads
 ┃ ┃ ┃ ┃ ┗ 📜main
 ┃ ┃ ┃ ┗ 📂remotes
 ┃ ┃ ┃ ┃ ┗ 📂origin
 ┃ ┃ ┃ ┃ ┃ ┗ 📜HEAD
 ┃ ┃ ┗ 📜HEAD
 ┃ ┣ 📂objects
 ┃ ┃ ┣ 📂info
 ┃ ┃ ┗ 📂pack
 ┃ ┃ ┃ ┣ 📜pack-db663b809b742c94328e14fb898d1f9906160858.idx
 ┃ ┃ ┃ ┣ 📜pack-db663b809b742c94328e14fb898d1f9906160858.pack
 ┃ ┃ ┃ ┗ 📜pack-db663b809b742c94328e14fb898d1f9906160858.rev
 ┃ ┣ 📂refs
 ┃ ┃ ┣ 📂heads
 ┃ ┃ ┃ ┗ 📜main
 ┃ ┃ ┣ 📂remotes
 ┃ ┃ ┃ ┗ 📂origin
 ┃ ┃ ┃ ┃ ┗ 📜HEAD
 ┃ ┃ ┗ 📂tags
 ┃ ┣ 📜config
 ┃ ┣ 📜description
 ┃ ┣ 📜HEAD
 ┃ ┣ 📜index
 ┃ ┗ 📜packed-refs
 ┣ 📂.vscode
 ┃ ┣ 📜extensions.json
 ┃ ┣ 📜launch.json
 ┃ ┗ 📜settings.json
 ┣ 📂client
 ┃ ┣ 📂assets
 ┃ ┃ ┗ 📂icons
 ┃ ┃ ┃ ┣ 📜camera.svg
 ┃ ┃ ┃ ┣ 📜mic.svg
 ┃ ┃ ┃ ┣ 📜output-audio.svg
 ┃ ┃ ┃ ┣ 📜output-text.svg
 ┃ ┃ ┃ ┣ 📜output.svg
 ┃ ┃ ┃ ┣ 📜power.svg
 ┃ ┃ ┃ ┣ 📜screen.svg
 ┃ ┃ ┃ ┣ 📜send.svg
 ┃ ┃ ┃ ┗ 📜settings.svg
 ┃ ┣ 📂css
 ┃ ┃ ┗ 📜styles.css
 ┃ ┣ 📂js
 ┃ ┃ ┣ 📂audio
 ┃ ┃ ┃ ┣ 📂worklets
 ┃ ┃ ┃ ┃ ┗ 📜audio-processor.js
 ┃ ┃ ┃ ┣ 📜recorder.js
 ┃ ┃ ┃ ┣ 📜streamer.js
 ┃ ┃ ┃ ┗ 📜visualizer.js
 ┃ ┃ ┣ 📂camera
 ┃ ┃ ┃ ┗ 📜camera.js
 ┃ ┃ ┣ 📂chat
 ┃ ┃ ┃ ┗ 📜chat-manager.js
 ┃ ┃ ┣ 📂config
 ┃ ┃ ┃ ┗ 📜config.js
 ┃ ┃ ┣ 📂dom
 ┃ ┃ ┃ ┣ 📜elements.js
 ┃ ┃ ┃ ┗ 📜events.js
 ┃ ┃ ┣ 📂main
 ┃ ┃ ┃ ┗ 📜agent.js
 ┃ ┃ ┣ 📂screen
 ┃ ┃ ┃ ┗ 📜screen.js
 ┃ ┃ ┣ 📂settings
 ┃ ┃ ┃ ┣ 📜settings-manager.js
 ┃ ┃ ┃ ┗ 📜settings-template.js
 ┃ ┃ ┣ 📂tools
 ┃ ┃ ┃ ┣ 📜google-search.js
 ┃ ┃ ┃ ┗ 📜tool-manager.js
 ┃ ┃ ┣ 📂transcribe
 ┃ ┃ ┃ ┗ 📜deepgram.js
 ┃ ┃ ┣ 📂utils
 ┃ ┃ ┃ ┣ 📜drag-resize.js
 ┃ ┃ ┃ ┗ 📜utils.js
 ┃ ┃ ┣ 📂ws
 ┃ ┃ ┃ ┗ 📜client.js
 ┃ ┃ ┗ 📜script.js
 ┃ ┗ 📜index.html
 ┣ 📂server
 ┃ ┣ 📜main.js
 ┃ ┗ 📜preload.js
 ┣ 📜.gitignore
 ┣ 📜.roorules-boomerang
 ┣ 📜LICENSE
 ┣ 📜package.json
 ┣ 📜README.md
 ┗ 📜yarn.lock