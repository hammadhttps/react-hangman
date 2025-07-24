import React, { useState } from 'react';

const WORDS = [
    'react', 'typescript', 'hangman', 'javascript', 'component', 'function', 'variable', 'state', 'props', 'effect',
];

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz'.split('');

function getRandomWord() {
    return WORDS[Math.floor(Math.random() * WORDS.length)];
}

const MAX_WRONG = 6;

const hangmanParts = [
    // SVG parts: [element, props]
    <circle key="head" cx="140" cy="70" r="20" stroke="#222" strokeWidth="4" fill="none" />, // Head
    <line key="body" x1="140" y1="90" x2="140" y2="140" stroke="#222" strokeWidth="4" />, // Body
    <line key="left-arm" x1="140" y1="110" x2="110" y2="100" stroke="#222" strokeWidth="4" />, // Left Arm
    <line key="right-arm" x1="140" y1="110" x2="170" y2="100" stroke="#222" strokeWidth="4" />, // Right Arm
    <line key="left-leg" x1="140" y1="140" x2="120" y2="180" stroke="#222" strokeWidth="4" />, // Left Leg
    <line key="right-leg" x1="140" y1="140" x2="160" y2="180" stroke="#222" strokeWidth="4" />, // Right Leg
];

const Hangman: React.FC = () => {
    const [answer, setAnswer] = useState<string>(getRandomWord());
    const [guessed, setGuessed] = useState<Set<string>>(new Set());
    const [wrong, setWrong] = useState<number>(0);
    const [gameOver, setGameOver] = useState<boolean>(false);
    const [win, setWin] = useState<boolean>(false);

    const handleGuess = (letter: string) => {
        if (gameOver) return;
        if (guessed.has(letter)) return;
        const newGuessed = new Set(guessed);
        newGuessed.add(letter);
        setGuessed(newGuessed);
        if (!answer.includes(letter)) {
            const newWrong = wrong + 1;
            setWrong(newWrong);
            if (newWrong >= MAX_WRONG) {
                setGameOver(true);
            }
        } else {
            const isWin = answer.split('').every((l) => newGuessed.has(l));
            if (isWin) {
                setWin(true);
                setGameOver(true);
            }
        }
    };

    const handleRestart = () => {
        setAnswer(getRandomWord());
        setGuessed(new Set());
        setWrong(0);
        setGameOver(false);
        setWin(false);
    };

    const renderWord = () =>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {answer.split('').map((letter, idx) => (
                <span
                    key={idx}
                    style={{
                        borderBottom: '3px solid #888',
                        minWidth: '2rem',
                        fontSize: '2.2rem',
                        textAlign: 'center',
                        color: guessed.has(letter) || gameOver ? (win ? '#0c0' : '#fff') : '#fff',
                        transition: 'color 0.3s',
                        fontWeight: 'bold',
                        background: guessed.has(letter) || gameOver ? '#222' : 'transparent',
                        borderRadius: '6px',
                        padding: '0 0.2rem',
                    }}
                >
                    {guessed.has(letter) || gameOver ? letter : ''}
                </span>
            ))}
        </div>;

    const renderKeyboard = () =>
        <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(13, minmax(1.8rem, 1fr))',
            gap: '0.4rem',
            justifyContent: 'center',
            margin: '0 auto',
            maxWidth: 400,
        }}>
            {ALPHABET.map((letter) => (
                <button
                    key={letter}
                    onClick={() => handleGuess(letter)}
                    disabled={guessed.has(letter) || gameOver}
                    style={{
                        width: '100%',
                        height: '2.2rem',
                        fontSize: '1.1rem',
                        textTransform: 'uppercase',
                        background: guessed.has(letter)
                            ? (answer.includes(letter) ? '#0c0' : '#c00')
                            : '#333',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: guessed.has(letter) || gameOver ? 'not-allowed' : 'pointer',
                        opacity: guessed.has(letter) || gameOver ? 0.6 : 1,
                        transition: 'background 0.2s, opacity 0.2s',
                        boxShadow: '0 1px 2px #0002',
                    }}
                >
                    {letter}
                </button>
            ))}
        </div>;

    const renderHangmanSVG = () => (
        <svg width="220" height="220" style={{ display: 'block', margin: '0 auto', background: 'none' }}>
            {/* Gallows */}
            <line x1="20" y1="200" x2="200" y2="200" stroke="#444" strokeWidth="6" />
            <line x1="60" y1="200" x2="60" y2="30" stroke="#444" strokeWidth="6" />
            <line x1="60" y1="30" x2="140" y2="30" stroke="#444" strokeWidth="6" />
            <line x1="140" y1="30" x2="140" y2="50" stroke="#444" strokeWidth="6" />
            {/* Hangman parts */}
            {hangmanParts.slice(0, wrong)}
        </svg>
    );

    return (
        <div style={{
            maxWidth: 520,
            margin: '2rem auto',
            padding: '2.5rem 1.5rem 2rem 1.5rem',
            background: 'linear-gradient(135deg, #232526 0%, #414345 100%)',
            borderRadius: '18px',
            boxShadow: '0 4px 24px #0005',
            color: '#fff',
            position: 'relative',
        }}>
            <h2 style={{
                fontSize: '2.2rem',
                marginBottom: '0.5rem',
                letterSpacing: '0.05em',
                fontWeight: 700,
                textShadow: '0 2px 8px #0007',
            }}>Hangman Game</h2>
            <div style={{ marginBottom: '1.5rem' }}>{renderHangmanSVG()}</div>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: '#aaa' }}>
                Wrong guesses: <span style={{ color: wrong > 3 ? '#c00' : '#ff0', fontWeight: 600 }}>{wrong}</span> / {MAX_WRONG}
            </div>
            {renderWord()}
            {renderKeyboard()}
            {gameOver && (
                <div style={{
                    margin: '1.5rem 0 0.5rem 0',
                    fontSize: '1.3rem',
                    fontWeight: 600,
                    color: win ? '#0f0' : '#f33',
                    textShadow: win ? '0 0 8px #0f08' : '0 0 8px #f338',
                    animation: 'pop 0.7s',
                }}>
                    {win ? '🎉 Congratulations! You won!' : `💀 Game Over! The word was "${answer}".`}
                </div>
            )}
            <button
                onClick={handleRestart}
                style={{
                    marginTop: '1.2rem',
                    padding: '0.7rem 2.2rem',
                    fontSize: '1.1rem',
                    background: 'linear-gradient(90deg, #646cff 0%, #61dafb 100%)',
                    color: '#222',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px #0003',
                    transition: 'background 0.2s',
                }}
            >
                Restart
            </button>
            <style>{`
                @keyframes pop {
                    0% { transform: scale(0.7); opacity: 0; }
                    60% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); }
                }
                @media (max-width: 600px) {
                    .App, div[style*='max-width: 520px'] {
                        padding: 1rem 0.2rem !important;
                    }
                    svg {
                        width: 90vw !important;
                        height: 40vw !important;
                        min-width: 160px;
                        min-height: 120px;
                    }
                }
            `}</style>
        </div>
    );
};

export default Hangman; 