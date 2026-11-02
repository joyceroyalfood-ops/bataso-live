* {
  box-sizing: border-box;
}

html, body {
  margin: 0;
  min-height: 100%;
  font-family: 'Segoe UI', Tahoma, sans-serif;
  background: linear-gradient(180deg, #130f0d 0%, #201511 100%);
  color: #fff7ea;
}

body.admin-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 28px;
}

.admin-shell {
  width: min(1200px, calc(100vw - 40px));
  min-height: 760px;
  display: grid;
  grid-template-columns: 230px 1fr;
  background: rgba(30, 21, 17, 0.88);
  border: 1px solid rgba(248, 207, 113, 0.2);
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 30px 60px rgba(0,0,0,0.35);
}

.sidebar {
  background: linear-gradient(180deg, #3d241e, #1d110d);
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 28px 18px;
  gap: 12px;
}

.brand-mark {
  width: 120px;
  height: 70px;
  display: grid;
  place-items: center;
  background: rgba(255,255,255,0.9);
  border-radius: 18px;
}

.brand-mark img {
  width: 90%;
  height: auto;
}

.sidebar h1 {
  margin: 6px 0 0;
  font-size: 26px;
  letter-spacing: 0.04em;
  text-align: center;
}

.sidebar p {
  margin: 0;
  opacity: 0.8;
}

.panel {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
}

.card {
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(247, 200, 103, 0.2);
  border-radius: 16px;
  padding: 18px;
}

.top-card {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 24px;
}

.connect-block {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 10px;
}

.connect-block label,
.field-row label {
  font-size: 14px;
  color: #f3d6a4;
}

input[type='text'],
input[type='number'] {
  width: 100%;
  border-radius: 12px;
  border: 1px solid rgba(255, 211, 126, 0.2);
  background: rgba(13, 10, 11, 0.28);
  color: #fdf4e1;
  padding: 10px 12px;
  font-size: 16px;
}

.button-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

button {
  border: none;
  border-radius: 12px;
  background: rgba(255,255,255,0.08);
  color: #fff7ee;
  font-size: 15px;
  font-weight: 700;
  padding: 10px 16px;
  cursor: pointer;
}

button.primary {
  background: linear-gradient(135deg, #f5c86d, #dd7d2d);
  color: #2b160f;
}

button.secondary {
  background: rgba(255,255,255,0.04);
}

.status-block {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 160px;
  gap: 8px;
}

.status-label {
  font-size: 12px;
  opacity: 0.7;
}

.status-badge {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  min-width: 130px;
  padding: 10px 16px;
  border-radius: 999px;
  font-size: 15px;
  font-weight: 800;
}

.status-badge.live {
  background: rgba(84, 194, 112, 0.14);
  border: 1px solid rgba(125, 228, 157, 0.35);
  color: #bbf7cb;
}

.status-badge.offline {
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.12);
  color: #efd9a3;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 14px;
}

.stat-box {
  padding: 18px 12px;
  border-radius: 14px;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(247, 200, 103, 0.2);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.stat-box span {
  font-size: 12px;
  text-transform: uppercase;
  color: #f2d7a4;
  opacity: 0.8;
}

.stat-box strong {
  font-size: 36px;
  font-weight: 800;
}

.controls {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 18px;
}

.field-row {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.toggle-row {
  grid-column: 1 / -1;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
  color: #f2d29f;
}

.toggle-row label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.action-panel h2 {
  margin: 0 0 12px;
}

.wrap {
  flex-wrap: wrap;
}
