* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  background: linear-gradient(180deg, #170f0e 0%, #261812 100%);
  color: #f9f1d7;
}

body.admin-page {
  display: grid;
  place-items: center;
  min-height: 100vh;
}

.admin-shell {
  width: min(1100px, calc(100vw - 40px));
  min-height: 760px;
  display: grid;
  grid-template-columns: 220px 1fr;
  border-radius: 18px;
  overflow: hidden;
  background: rgba(29, 19, 16, 0.9);
  border: 1px solid rgba(255, 219, 135, 0.28);
  box-shadow: 0 20px 50px rgba(0,0,0,0.35);
}

.sidebar {
  background: linear-gradient(180deg, #3d261c, #1f120d);
  padding: 28px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.brand-mark {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  display: grid;
  place-items: center;
  background: linear-gradient(135deg, #f9d978, #d76d2f);
  color: #2b170f;
  font-size: 2rem;
  font-weight: 800;
}

.sidebar h1 {
  margin: 0;
  font-size: 1.2rem;
  text-align: center;
}

.sidebar p {
  margin: 0;
  opacity: 0.7;
}

.panel {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}

.card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255, 211, 121, 0.22);
  border-radius: 16px;
  padding: 18px;
}

.top-card {
  display: flex;
  justify-content: space-between;
  align-items: end;
  gap: 18px;
}

.connect-block {
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 280px;
}

.connect-block label,
.field-row label {
  font-size: 0.82rem;
  color: #f1d6a1;
}

input[type="text"], input[type="number"] {
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255, 214, 124, 0.2);
  background: rgba(10, 9, 11, 0.38);
  color: #fff3d7;
}

.button-row {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

button {
  border: 0;
  border-radius: 10px;
  padding: 10px 16px;
  cursor: pointer;
  font-weight: 700;
  background: rgba(255,255,255,0.08);
  color: #fff4dc;
}

button.primary {
  background: linear-gradient(135deg, #efb54a, #d3642e);
  color: #2d190f;
}

button.secondary {
  background: rgba(255,255,255,0.06);
}

.status-block {
  min-width: 140px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
}

.status-label {
  font-size: 0.7rem;
  opacity: 0.8;
}

.status-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 8px 14px;
  border-radius: 999px;
  font-weight: 700;
}

.status-badge.live {
  background: rgba(93, 192, 119, 0.16);
  color: #b7f4c8;
  border: 1px solid rgba(124, 232, 178, 0.4);
}

.status-badge.offline {
  background: rgba(255, 255, 255, 0.05);
  color: #f1d1a1;
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stat-box {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255, 214, 124, 0.2);
  border-radius: 14px;
  padding: 18px 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  text-align: center;
}

.stat-box span {
  font-size: 0.7rem;
  text-transform: uppercase;
  opacity: 0.8;
}

.stat-box strong {
  font-size: 1.8rem;
  font-weight: 800;
}

.controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggle-row {
  grid-column: 1 / -1;
  display: flex;
  gap: 18px;
  flex-wrap: wrap;
  align-items: center;
  color: #f0d69d;
}

.toggle-row label {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-panel h2 {
  margin: 0 0 12px;
}

.wrap {
  flex-wrap: wrap;
}
