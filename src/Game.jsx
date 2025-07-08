import { useState, useEffect, useRef } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ squares, onSquareClick, status }) {
  return (
    <>
      <div className="status">{status}</div>
      {[0, 1, 2].map(row => (
        <div className="board-row" key={row}>
          {[0, 1, 2].map(col => {
            const index = row * 3 + col;
            return (
              <Square
                key={index}
                value={squares[index]}
                onSquareClick={() => onSquareClick(row, col, index)}
              />
            );
          })}
        </div>
      ))}
    </>
  );
}

export default function Game() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [player, setPlayer] = useState(null);
  const [turn, setTurn] = useState("X");
  const [status, setStatus] = useState("Waiting for opponent...");
  const [history, setHistory] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket("wss://tictactoeback-h8f8akbugkcfbqdx.canadacentral-01.azurewebsites.net/bbService");
    socketRef.current = socket;

    socket.onopen = () => {
      console.log("Connected to WebSocket");
    };

    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.playerTurn) {
          if (data.playerTurn.includes("X")) setPlayer("X");
          if (data.playerTurn.includes("O")) setPlayer("O");
        }else if(data.turn){
          setTurn(data.turn);
        } else if(data.board){
          const flat = data.board.flat();
          setSquares(flat);
          setHistory(prev => {
            const updated = prev.slice(0, data.step + 1);
            updated[data.step] = flat;
            return updated;
          });
        }
        else if (Array.isArray(data)) {
          const flat = data.flat();
          setSquares(flat);
          setHistory(prev => [...prev, flat]);
        } else if (data.error) {
          alert(data.error);
        }
      } catch (err) {
        console.error("Invalid message from server:", event.data);
      }
    };

    return () => socket.close();
  }, []);

  function handleSquareClick(row, col, index) {
    if (!player || status.includes("Winner") || status.includes("tie")) return;
    if (squares[index] !== null) return;
    if (turn !== player) {
      alert("Not your turn!");
      return;
    }

    socketRef.current?.send(
      JSON.stringify({ row, col, player })
    );
    setTurn(player === "X" ? "O" : "X");
  }

  function jumpTo(move) {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ stepBack: move }));
    }
  }

  useEffect(() => {
    const winner = calculateWinner(squares);
    if (winner) {
      setStatus(`Winner: ${winner}`);
    } else if (squares.every(sq => sq !== null)) {
      setStatus("It's a tie");
    } else {
      setStatus(`Next player: ${turn}`);
    }
  }, [squares, turn]);

  const moves = history.map((board, move) => {
    const desc = move === 0 ? "Go to start" : `Go to move #${move}`;
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{desc}</button>
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board squares={squares} onSquareClick={handleSquareClick} status={status} />
      </div>
      <div className="game-info">
        <div>You are: {player ?? "..."}</div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let [a, b, c] of lines) {
    if (squares[a] && squares[a] === squares[b] && squares[b] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
