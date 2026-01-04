# Pokemon Mezastar Organizer

## Features
- store trainer IDs
- extract QR code from images (these codes container the data below):
   - trainer ID (if separated by exactly one period character) (also embedded in a url found in the url param `s`)
   - support pokemon (the rest)
- Support Pokemon registry where:
  - given a support pokemon data code
  - shows the corresponding pokemon info:
    - name
    - type
    - ability
  - [FUTURE] pokemon community can submit the data 
  - key: hex encoded, value: purely for UI display (data may differ slightly from actual in-game data) (render the data while decoding the code from hex to utf-8)
- great UX/UI for organizing and viewing trainer IDs and support pokemon. So we can easily play the arcade game.
- can rerender the trainer ID and support pokemon as QR codes
- usage flow:
- select trainer ID
- select support pokemon
## Technlogies
- dexie for persisting data locally
- Effect TS for maintainability
- Shadcn for UI
- tailwind for styling
- tanstack stores for state management
- zxing for QR code scanning
- qrcode.react for QR code rendering
