# TTVFlash Presentation App

## Installation

Clone this repo and run `yarn install`

## Commands

```
yarn start
yarn lint
yarn build
```

## Directory Layout

```bash
├── node_modules/                  # 3rd-party libraries and utilities
├── public/                        # Static files such as favicon.ico etc.
├── src/                           # Application source code
│   ├── components/                # Shared React components
│   ├── routes/                    # Components for pages/screens + routing information
│   ├── history.js                 # Client-side navigation manager
│   ├── index.js                   # <== Application entry point (main) <===
│   ├── registerServiceWorker.json # This list of application routes
├── build/                         # Build output
├── package.json                   # The list of project dependencies + NPM scripts
└── setup.js                       # Customizations for create-react-app
```
