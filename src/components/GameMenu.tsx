import { useState, useCallback } from 'react';

const SoundIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
    <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
  </svg>
);

const MusicIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 18V5l12-2v13" />
    <circle cx="6" cy="18" r="3" />
    <circle cx="18" cy="16" r="3" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const DocumentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

export function GameMenu() {
  const [open, setOpen] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [musicOn, setMusicOn] = useState(false);

  const handleMenuClick = useCallback(() => {
    setOpen((o) => !o);
  }, []);

  const handleLinkClick = useCallback((action: () => void) => {
    action();
    setOpen(false);
  }, []);

  return (
    <div className="game-menu">
      <button
        type="button"
        className="game-menu__trigger"
        onClick={handleMenuClick}
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="Menu"
      >
        <span className="game-menu__icon" aria-hidden>☰</span>
      </button>

      {open && (
        <>
          <button
            type="button"
            className="game-menu__backdrop"
            onClick={() => setOpen(false)}
            aria-label="Close menu"
          />
          <div className="game-menu__dropdown">
            <div className="game-menu__section">
              <div className="game-menu__row">
                <span className="game-menu__row-icon"><SoundIcon /></span>
                <span className="game-menu__row-label">Sound</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={soundOn}
                  className={`game-menu__toggle ${soundOn ? 'game-menu__toggle--on' : ''}`}
                  onClick={() => setSoundOn((s) => !s)}
                >
                  <span className="game-menu__toggle-thumb" />
                </button>
              </div>
              <div className="game-menu__row">
                <span className="game-menu__row-icon"><MusicIcon /></span>
                <span className="game-menu__row-label">Music</span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={musicOn}
                  className={`game-menu__toggle ${musicOn ? 'game-menu__toggle--on' : ''}`}
                  onClick={() => setMusicOn((m) => !m)}
                >
                  <span className="game-menu__toggle-thumb" />
                </button>
              </div>
            </div>

            <div className="game-menu__divider" />

            <div className="game-menu__section">
              <button
                type="button"
                className="game-menu__link"
                onClick={() => handleLinkClick(() => { /* TODO: Provably fair */ })}
              >
                <span className="game-menu__row-icon"><ShieldIcon /></span>
                <span className="game-menu__row-label">Provably fair settings</span>
              </button>
              <button
                type="button"
                className="game-menu__link"
                onClick={() => handleLinkClick(() => { /* TODO: Game rules */ })}
              >
                <span className="game-menu__row-icon"><DocumentIcon /></span>
                <span className="game-menu__row-label">Game rules</span>
              </button>
              <button
                type="button"
                className="game-menu__link"
                onClick={() => handleLinkClick(() => { /* TODO: Bet history */ })}
              >
                <span className="game-menu__row-icon"><HistoryIcon /></span>
                <span className="game-menu__row-label">My bet history</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
