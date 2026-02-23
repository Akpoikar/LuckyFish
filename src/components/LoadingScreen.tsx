export function LoadingScreen() {
  return (
    <div className="loading-screen">
      <div
        className="loading-screen__bg"
        aria-hidden
        style={{
          backgroundImage: `url(${import.meta.env.BASE_URL}images/underwater-bg.webp)`,
        }}
      />
      <div className="loading-screen__content">
        <div className="loading-screen__fish" aria-hidden>
          <img
            src={`${import.meta.env.BASE_URL}images/fish.webp`}
            alt=""
            className="loading-screen__fish-img"
          />
        </div>
        <h1 className="loading-screen__title">Lucky Fishy</h1>
        <p className="loading-screen__subtitle">Loading game…</p>
        <div className="loading-screen__spinner" aria-label="Loading">
          <span className="loading-screen__bubble" />
          <span className="loading-screen__bubble" />
          <span className="loading-screen__bubble" />
        </div>
      </div>
    </div>
  );
}
