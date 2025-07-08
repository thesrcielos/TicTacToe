# React Tic Tac Toe
This is the React frontend for the real-time two-player Tic Tac Toe game.  
It connects to a WebSocket backend and allows players to play interactively, view move history, and replay previous steps.


## Getting Started

These instructions will help you get the project running on your local machine for development and testing purposes.

### Prerequisites

You will need the following installed:

- [Node.js 16+](https://nodejs.org/)
- [npm 8+](https://www.npmjs.com/get-npm) or [yarn](https://yarnpkg.com/)
- [vite](https://vite.dev/)
- Git (optional, for cloning)

### Installing

Clone the repository:

```bash
git clone https://github.com/thesrcielos/TicTacToe
cd TicTacToe
```

Install dependencies:
```
npm install
```
### Running the Application
Start the development server with:

```
npm run dev
```

### Features
* ✅ 2-player turn-based gameplay (X and O)

* ✅ Winner detection logic

* ✅ Tie/draw detection

* ✅ Move history with ability to jump to any previous state

* ✅ Functional components using React Hooks

### Folder Structure
```
react-tic-tac-toe/
├── public/
│   └── index.html
├── src/
│   ├── App.js          # Main game logic (Game, Board, Square)
|   ├── Game.jsx 
│   └── index.js        # Entry point
├── package.json
└── README.md
```
### Built With
* React – UI library
* JavaScript (ES6+)