const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import { useRef, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import * as THREE from "three";
import { motion, AnimatePresence } from "framer-motion";

import { playChaChig, playClick, playWrong } from "../../lib/sounds";
import { playApproachCue } from "../../lib/a11y";

// ── Constants ────────────────────────────────────────────────────────────────
const LANES_EASY = [-4, 0, 4];
const LANES_HARD = [-6, -3, 0, 3, 6];
const GAME_DURATION = 60;
const TUNNEL_DEPTH  = 120;
const RING_COUNT    = 24;
const RING_SPACING  = TUNNEL_DEPTH / RING_COUNT;
const SHIP_Z        = 6;
const SPAWN_Z       = -55;
const HIT_Z         = 5.5;
const COLL_RADIUS   = 2.2;

// Asset Orb types
const ORBS = {
  bonds:  { hex: 0x3B82F6, css: "#3B82F6", label: "BONDS",  emoji: "💙", scoreBase: 5,  desc: "Stable +5" },
  stocks: { hex: 0x00F2FF, css: "#00F2FF", label: "STOCKS", emoji: "📈", scoreBase: 20, desc: "Growth +20" },
  gold:   { hex: 0xF1C40F, css: "#F1C40F", label: "GOLD",   emoji: "🥇", scoreBase: 10, desc: "Shield!" },
};
const ORB_TYPES = ["bonds", "stocks", "gold"];

// Storm types
const STORMS = {
  inflation:  { hex: 0xFF2244, css: "#FF2244", label: "INFLATION",       emoji: "📛", effect: "score"  },
  rate_hike:  { hex: 0xFF6600, css: "#FF6600", label: "RATE HIKE",       emoji: "⬆️", effect: "slow"   },
  crash:      { hex: 0x7C3AED, css: "#7C3AED", label: "MARKET CRASH",    emoji: "💥", effect: "heart"  },
};
const STORM_TYPES = ["inflation", "rate_hike", "crash"];

// Mission Control messages
const MC_MESSAGES = {
  idle:        "Mission Control: Standing by. Launch when ready, Pilot.",
  bonds:       "📡 Inflation spiking! Collect BLUE BONDS to stabilize the portfolio!",
  stocks:      "🚀 Market is Bullish! Chase CYAN STOCKS for maximum growth!",
  gold:        "🥇 Collect GOLD to shield against incoming crashes!",
  toorisky:    "⚠️ Portfolio too RISKY! Balance with Blue Bonds now!",
  toosafe:     "📉 Too conservative! Take on some Cyan Stocks for growth!",
  balanced:    "✅ Portfolio BALANCED! Keep it up to trigger Bull Market!",
  bull:        "🐂 BULL MARKET ACTIVE! All points DOUBLED! Ride the wave!",
  crash_hit:   "💥 MARKET CRASH! Lost a life — stay diversified!",
  inflation_hit:"📛 INFLATION hit! Score is draining — get to safety!",
  ratehike_hit: "⬆️ RATE HIKE! Controls feel heavy — push through!",
  lowtime:     "⏱️ Final stretch! Give it everything you've got, Pilot!",
};

// ── Three.js helpers ─────────────────────────────────────────────────────────
function makeShipMesh() {
  const group = new THREE.Group();
  const body = new THREE.Mesh(
    new THREE.ConeGeometry(0.55, 2.2, 8),
    new THREE.MeshStandardMaterial({ color: 0x1a2744, emissive: 0x003366, metalness: 0.8, roughness: 0.2 })
  );
  body.rotation.x = Math.PI;
  group.add(body);
  const glass = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 12, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    new THREE.MeshStandardMaterial({ color: 0x00F2FF, emissive: 0x00F2FF, emissiveIntensity: 0.5, transparent: true, opacity: 0.7 })
  );
  glass.position.y = 0.4; glass.rotation.x = Math.PI;
  group.add(glass);
  [-1, 1].forEach(side => {
    const wing = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.12, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x0a1628, emissive: 0x00F2FF, emissiveIntensity: 0.15, metalness: 0.9 })
    );
    wing.position.set(side * 1.05, -0.5, 0);
    group.add(wing);
  });
  return group;
}

function makeOrbMesh(type) {
  const orb = ORBS[type];
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.75, 16, 16),
    new THREE.MeshStandardMaterial({ color: orb.hex, emissive: orb.hex, emissiveIntensity: 0.9, metalness: 0.3, roughness: 0.1, transparent: true, opacity: 0.92 })
  );
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(1.1, 0.08, 8, 32),
    new THREE.MeshStandardMaterial({ color: orb.hex, emissive: orb.hex, emissiveIntensity: 1.2 })
  );
  ring.rotation.x = Math.PI / 2;
  const group = new THREE.Group();
  group.add(mesh); group.add(ring);
  group.userData = { kind: "orb", type };
  return group;
}

function makeStormMesh(type) {
  const storm = STORMS[type];
  const group = new THREE.Group();
  if (type === "inflation") {
    // Red glitch cloud
    for (let i = 0; i < 7; i++) {
      const frag = new THREE.Mesh(
        new THREE.OctahedronGeometry(0.28 + Math.random() * 0.3, 0),
        new THREE.MeshStandardMaterial({ color: storm.hex, emissive: 0xFF0033, emissiveIntensity: 1.3, wireframe: Math.random() > 0.4 })
      );
      frag.position.set((Math.random()-0.5)*1.8, (Math.random()-0.5)*1.8, (Math.random()-0.5)*0.5);
      frag.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      group.add(frag);
    }
  } else if (type === "rate_hike") {
    // Orange spiky shards
    for (let i = 0; i < 6; i++) {
      const frag = new THREE.Mesh(
        new THREE.TetrahedronGeometry(0.4 + Math.random() * 0.35, 0),
        new THREE.MeshStandardMaterial({ color: storm.hex, emissive: 0xDD4400, emissiveIntensity: 1.0, metalness: 0.8 })
      );
      frag.position.set((Math.random()-0.5)*2, (Math.random()-0.5)*2, (Math.random()-0.5)*0.5);
      frag.rotation.set(Math.random()*Math.PI, Math.random()*Math.PI, Math.random()*Math.PI);
      group.add(frag);
    }
  } else {
    // Void zone — dark sphere with purple ring
    const core = new THREE.Mesh(
      new THREE.SphereGeometry(0.9, 16, 16),
      new THREE.MeshStandardMaterial({ color: 0x0a0010, emissive: storm.hex, emissiveIntensity: 0.6, transparent: true, opacity: 0.85 })
    );
    group.add(core);
    const aura = new THREE.Mesh(
      new THREE.TorusGeometry(1.3, 0.12, 8, 32),
      new THREE.MeshStandardMaterial({ color: storm.hex, emissive: storm.hex, emissiveIntensity: 1.5, transparent: true, opacity: 0.8 })
    );
    group.add(aura);
  }
  group.userData = { kind: "storm", stormType: type };
  return group;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function PortfolioPilot({ progress, setProgress }) {
  const mountRef = useRef(null);
  const gameRef  = useRef(null);
  const rafRef   = useRef(null);

  const navigate = useNavigate();
  const part2Unlocked = (progress?.owned_items || []).includes('part2-unlocked');
  const [hardMode, setHardMode]       = useState(false);
  const [gameState, setGameState]     = useState("idle");
  const [score, setScore]             = useState(0);
  const [timeLeft, setTimeLeft]       = useState(GAME_DURATION);
  const [laneIdx, setLaneIdx]         = useState(1);
  const [flashRed, setFlashRed]       = useState(false);
  const [flashCyan, setFlashCyan]     = useState(false);
  const [flashGold, setFlashGold]     = useState(false);
  const [saved, setSaved]             = useState(false);
  const [speed, setSpeed]             = useState(1);
  const [hearts, setHearts]           = useState(3);
  const [goldShield, setGoldShield]   = useState(false);
  const [bullMarket, setBullMarket]   = useState(false);
  const [portfolioBalance, setPortfolioBalance] = useState(50); // 0=all bonds, 100=all stocks
  const [scorePopups, setScorePopups] = useState([]);
  const [missionMsg, setMissionMsg]   = useState(MC_MESSAGES.idle);
  const [gameStats, setGameStats]     = useState({ bondsHit: 0, stocksHit: 0, goldHit: 0, stormsHit: 0, stormsDodged: 0 });
  const [cracks, setCracks]           = useState(false);
  const [lastStormHit, setLastStormHit] = useState(null);
  const bankRef = useRef(0); // current bank angle (radians)
  const cameraRollRef = useRef(0);

  // Spawn floating score popup

  const spawnPopup = useCallback((text, color) => {
    const id = Date.now() + Math.random();
    setScorePopups(p => [...p, { id, text, color }]);
    setTimeout(() => setScorePopups(p => p.filter(x => x.id !== id)), 1200);
  }, []);

  // ── Three.js setup ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (!mountRef.current) return;
    const el = mountRef.current;
    const w = el.clientWidth, h = el.clientHeight;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x0a0e17, 0.008);

    const camera = new THREE.PerspectiveCamera(72, w / h, 0.1, 250);
    camera.position.set(0, 2.5, 10);
    camera.lookAt(0, 0, -30);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(w, h);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x0a0e17, 1);
    el.appendChild(renderer.domElement);

    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    scene.add(ambient);
    const dirLight = new THREE.DirectionalLight(0x00F2FF, 1.2);
    dirLight.position.set(0, 10, 5);
    scene.add(dirLight);
    const pointLight = new THREE.PointLight(0x00F2FF, 2, 30);
    pointLight.position.set(0, 0, 5);
    scene.add(pointLight);

    // ── Tunnel rings with ticker-style material ─────────────────────────────
    const rings = [];
    const ringColors = [0x00F2FF, 0x2ECC71, 0xF1C40F];
    for (let i = 0; i < RING_COUNT; i++) {
      const z = -i * RING_SPACING;
      const geo = new THREE.EdgesGeometry(new THREE.BoxGeometry(14, 9, 0.01));
      const mat = new THREE.LineBasicMaterial({ color: ringColors[i % ringColors.length], transparent: true, opacity: 0.22 });
      const ring = new THREE.LineSegments(geo, mat);
      ring.position.z = z;
      scene.add(ring);
      rings.push(ring);
    }

    // Floor grid
    const floorGeo = new THREE.PlaneGeometry(14, TUNNEL_DEPTH, 7, RING_COUNT);
    const floorMat = new THREE.MeshBasicMaterial({ color: 0x00F2FF, wireframe: true, transparent: true, opacity: 0.10 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.set(0, -4.5, -TUNNEL_DEPTH / 2 + 10);
    scene.add(floor);

    const ship = makeShipMesh();
    ship.position.set(LANES_EASY[1], -2.2, SHIP_Z);
    ship.scale.setScalar(0.85);
    scene.add(ship);

    const thrustGeo = new THREE.BufferGeometry();
    const thrustPositions = new Float32Array(60 * 3);
    thrustGeo.setAttribute("position", new THREE.BufferAttribute(thrustPositions, 3));
    const thrustMat = new THREE.PointsMaterial({ color: 0x00F2FF, size: 0.18, transparent: true, opacity: 0.8 });
    const thrust = new THREE.Points(thrustGeo, thrustMat);
    scene.add(thrust);

    LANES_EASY.forEach(x => {
      const lg = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(x, -4.4, -TUNNEL_DEPTH + 10),
        new THREE.Vector3(x, -4.4, SHIP_Z)
      ]);
      const lm = new THREE.LineBasicMaterial({ color: 0x00F2FF, transparent: true, opacity: 0.15 });
      scene.add(new THREE.Line(lg, lm));
    });

    gameRef.current = {
      scene, camera, renderer, ship, thrust, thrustPositions, rings, pointLight,
      obstacles: [], currentLane: 1, targetLaneX: LANES_EASY[1],
      score: 0, timeLeft: GAME_DURATION, playing: false,
      spawnTimer: 0, speed: 1, tilt: 0, thrustT: 0,
      hearts: 3, goldShield: false, bullMarket: false,
      bullTimer: 0, speedDebuff: 1,
      bondsHit: 0, stocksHit: 0, goldHit: 0, stormsHit: 0, stormsDodged: 0,
      LANES: LANES_EASY,
      bankAngle: 0,        // world bank (tunnel tilt)
      cameraRoll: 0,       // camera roll offset
      thrustLateralV: 0,   // lateral velocity for thrust whip
    };

    const onResize = () => {
      const nw = el.clientWidth, nh = el.clientHeight;
      camera.aspect = nw / nh; camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    };
    window.addEventListener("resize", onResize);

    let idleRaf;
    function idleLoop() {
      idleRaf = requestAnimationFrame(idleLoop);
      rings.forEach(r => {
        r.position.z += 0.04;
        if (r.position.z > 10) r.position.z -= TUNNEL_DEPTH;
        r.material.opacity = Math.max(0.05, 0.22 - Math.abs(r.position.z) * 0.002);
      });
      ship.rotation.z = Math.sin(Date.now() * 0.001) * 0.06;
      ship.position.y = -2.2 + Math.sin(Date.now() * 0.0015) * 0.12;
      renderer.render(scene, camera);
    }
    idleRaf = requestAnimationFrame(idleLoop);
    gameRef.current.stopIdle = () => cancelAnimationFrame(idleRaf);

    return () => {
      cancelAnimationFrame(idleRaf);
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  // ── Game loop ───────────────────────────────────────────────────────────────
  const startGame = useCallback((isHard) => {
    const g = gameRef.current;
    if (!g) return;
    g.stopIdle?.();
    const LANES = isHard ? LANES_HARD : LANES_EASY;
    const mid = Math.floor(LANES.length / 2);
    g.LANES = LANES;
    g.obstacles.forEach(o => g.scene.remove(o.mesh));
    g.obstacles = [];
    g.currentLane = mid; g.targetLaneX = LANES[mid];
    g.score = 0; g.timeLeft = GAME_DURATION; g.playing = true;
    g.spawnTimer = 0; g.speed = 1; g.tilt = 0;
    g.hearts = 3; g.goldShield = false; g.bullMarket = false; g.bullTimer = 0;
    g.speedDebuff = 1;
    g.bondsHit = 0; g.stocksHit = 0; g.goldHit = 0; g.stormsHit = 0; g.stormsDodged = 0;
    g.bankAngle = 0; g.cameraRoll = 0; g.thrustLateralV = 0;
    g.ship.position.set(LANES[mid], -2.2, SHIP_Z);
    g.scene.fog = new THREE.FogExp2(0x0a0e17, isHard ? 0.012 : 0.008);

    setScore(0); setTimeLeft(GAME_DURATION); setLaneIdx(mid);
    setGameState("playing"); setSpeed(1); setHearts(3);
    setGoldShield(false); setBullMarket(false); setPortfolioBalance(50);
    setMissionMsg(MC_MESSAGES.idle);
    setSaved(false);

    let last = performance.now();
    let secTimer = 0;
    let balanceTimer = 0; // seconds with balanced portfolio

    function loop(now) {
      rafRef.current = requestAnimationFrame(loop);
      if (!g.playing) return;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const baseSpeed = 1 + (GAME_DURATION - g.timeLeft) * 0.018;
      const speedMult = baseSpeed * (g.speedDebuff || 1);
      g.speed = speedMult;
      const tunnelSpeed = 18 * speedMult * dt;

      // Bull market: gold tunnel tint
      if (g.bullMarket) {
        g.rings.forEach(r => { r.material.color.setHex(0xF1C40F); });
        g.pointLight.color.setHex(0xF1C40F);
      } else {
        g.rings.forEach((r, i) => { r.material.color.setHex([0x00F2FF, 0x2ECC71, 0xF1C40F][i % 3]); });
        g.pointLight.color.setHex(0x00F2FF);
      }

      // Timer
      secTimer += dt;
      if (secTimer >= 1) {
        secTimer -= 1;
        g.timeLeft = Math.max(0, g.timeLeft - 1);
        setTimeLeft(g.timeLeft);
        setSpeed(+baseSpeed.toFixed(2));

        // Portfolio balance tracking
        const total = g.bondsHit + g.stocksHit;
        if (total > 0) {
          const stockRatio = g.stocksHit / total;
          const bal = Math.round(stockRatio * 100);
          setPortfolioBalance(bal);
          // Balanced = 30-70% stocks
          const isBalanced = bal >= 30 && bal <= 70;
          if (isBalanced) {
            balanceTimer += 1;
            if (balanceTimer >= 15 && !g.bullMarket) {
              g.bullMarket = true;
              setBullMarket(true);
              setMissionMsg(MC_MESSAGES.bull);
            } else if (balanceTimer < 15) {
              setMissionMsg(MC_MESSAGES.balanced);
            }
          } else {
            balanceTimer = 0;
            setMissionMsg(bal > 70 ? MC_MESSAGES.toorisky : MC_MESSAGES.toosafe);
          }
        }

        if (g.timeLeft <= 10) setMissionMsg(MC_MESSAGES.lowtime);
        if (g.timeLeft <= 0) {
          g.playing = false;
          setGameStats({ bondsHit: g.bondsHit, stocksHit: g.stocksHit, goldHit: g.goldHit, stormsHit: g.stormsHit, stormsDodged: g.stormsDodged });
          setGameState("win");
          return;
        }
      }

      // ── Banking system ────────────────────────────────────────────────
      const laneError = g.targetLaneX - g.ship.position.x;
      const targetBank = -laneError * 0.045;          // tunnel tilts opposite to turn
      const targetCamRoll = laneError * 0.018;        // camera rolls with the turn
      g.bankAngle = THREE.MathUtils.lerp(g.bankAngle, targetBank, 0.09);
      g.cameraRoll = THREE.MathUtils.lerp(g.cameraRoll, targetCamRoll, 0.09);

      // Dynamic FOV: increase with speed or bull market
      const targetFov = (g.bullMarket ? 86 : 72) + Math.max(0, (speedMult - 1.5) * 6);
      g.camera.fov = THREE.MathUtils.lerp(g.camera.fov, targetFov, 0.05);
      g.camera.updateProjectionMatrix();

      // Apply camera roll
      g.camera.rotation.z = THREE.MathUtils.lerp(g.camera.rotation.z, g.cameraRoll, 0.1);

      // Apply tunnel + floor banking as a group (tilt entire world opposite to turn)
      g.rings.forEach(r => { r.rotation.z = THREE.MathUtils.lerp(r.rotation.z, g.bankAngle, 0.1); });

      // Rings scroll
      g.rings.forEach(r => {
        r.position.z += tunnelSpeed;
        if (r.position.z > 10) r.position.z -= TUNNEL_DEPTH;
        const frac = Math.max(0, 1 - Math.abs(r.position.z + 20) / 80);
        r.material.opacity = 0.06 + frac * 0.28;
      });

      // Spawn obstacles
      const spawnInterval = Math.max(650, 1500 - (GAME_DURATION - g.timeLeft) * 15);
      g.spawnTimer += dt * 1000;
      if (g.spawnTimer >= spawnInterval) {
        g.spawnTimer = 0;
        const isHardNow = g.LANES?.length > 3;
        const spawnStorm = Math.random() < (isHardNow ? 0.55 : 0.40);
        const lane = Math.floor(Math.random() * (g.LANES?.length || 3));
        let mesh;
        if (spawnStorm) {
          const st = STORM_TYPES[Math.floor(Math.random() * STORM_TYPES.length)];
          mesh = makeStormMesh(st);
        } else {
          const ot = ORB_TYPES[Math.floor(Math.random() * ORB_TYPES.length)];
          mesh = makeOrbMesh(ot);
        }
        mesh.position.set((g.LANES || LANES_EASY)[lane], (Math.random()-0.5)*1.5-1, SPAWN_Z);
        g.scene.add(mesh);
        g.obstacles.push({ mesh, lane, isStorm: spawnStorm });

        // Hard mode: double cluster crashes
        if (isHardNow && spawnStorm && Math.random() < 0.3 && g.LANES) {
          const lane2 = (lane + 1) % g.LANES.length;
          const st2 = STORM_TYPES[Math.floor(Math.random() * STORM_TYPES.length)];
          const mesh2 = makeStormMesh(st2);
          mesh2.position.set(g.LANES[lane2], (Math.random()-0.5)*1.5-1, SPAWN_Z - 5);
          g.scene.add(mesh2);
          g.obstacles.push({ mesh: mesh2, lane: lane2, isStorm: true });
        }
      }

      // Move obstacles & collision
      const toRemove = [];
      g.obstacles.forEach((obs, i) => {
        obs.mesh.position.z += tunnelSpeed * 1.05;
        const prog = (obs.mesh.position.z - SPAWN_Z) / (-SPAWN_Z + HIT_Z);
        obs.mesh.scale.setScalar(Math.max(0.1, 0.12 + prog * 0.88));
        obs.mesh.rotation.y += dt * (obs.isStorm ? 2.5 : 1.2);
        obs.mesh.rotation.x += dt * (obs.isStorm ? 1.5 : 0.4);
        // Tilt obstacles with the world banking so they stay on-track
        obs.mesh.rotation.z = THREE.MathUtils.lerp(obs.mesh.rotation.z, g.bankAngle * 0.5, 0.12);

        // Audio proximity cue when obstacle is ~60% of the way to the ship
        const approachFrac = (obs.mesh.position.z - SPAWN_Z) / (-SPAWN_Z + HIT_Z);
        if (approachFrac > 0.6 && approachFrac < 0.65) {
          const pan = obs.mesh.position.x / 6; // -1 to 1 based on lane
          playApproachCue(obs.isStorm ? "storm" : "orb", pan);
        }

        if (obs.mesh.position.z >= HIT_Z) {
          const dx = Math.abs(obs.mesh.position.x - g.ship.position.x);
          if (dx < COLL_RADIUS) {
            if (obs.isStorm) {
              const st = obs.mesh.userData.stormType || "inflation";
              if (st === "crash") {
                if (g.goldShield) {
                  g.goldShield = false; setGoldShield(false);
                  setMissionMsg("🛡️ Gold Shield absorbed the crash!");
                } else {
                  g.hearts = Math.max(0, g.hearts - 1);
                  setHearts(g.hearts);
                  setCracks(true); setTimeout(() => setCracks(false), 600);
                  setMissionMsg(MC_MESSAGES.crash_hit);
                  if (g.hearts <= 0) { g.playing = false; setGameStats({ bondsHit: g.bondsHit, stocksHit: g.stocksHit, goldHit: g.goldHit, stormsHit: g.stormsHit, stormsDodged: g.stormsDodged }); setGameState("gameover"); return; }
                }
              } else if (st === "inflation") {
                const dmg = g.bullMarket ? 3 : 8;
                g.score = Math.max(0, g.score - dmg);
                setScore(g.score);
                setMissionMsg(MC_MESSAGES.inflation_hit);
              } else if (st === "rate_hike") {
                g.speedDebuff = 0.65;
                setMissionMsg(MC_MESSAGES.ratehike_hit);
                setTimeout(() => { if (g) g.speedDebuff = 1; }, 3000);
              }
              setLastStormHit(st);
              g.stormsHit++;
              setFlashRed(true); setTimeout(() => setFlashRed(false), 400);
              playWrong();
            } else {
              const ot = obs.mesh.userData.type;
              let pts = ORBS[ot].scoreBase;
              if (g.bullMarket) pts *= 2;
              g.score += pts;
              setScore(g.score);
              if (ot === "bonds") { g.bondsHit++; setMissionMsg(MC_MESSAGES.bonds); setFlashCyan(true); setTimeout(() => setFlashCyan(false), 300); }
              else if (ot === "stocks") { g.stocksHit++; setMissionMsg(MC_MESSAGES.stocks); setFlashCyan(true); setTimeout(() => setFlashCyan(false), 300); }
              else if (ot === "gold") { g.goldHit++; g.goldShield = true; setGoldShield(true); setMissionMsg(MC_MESSAGES.gold); setFlashGold(true); setTimeout(() => setFlashGold(false), 400); }
              const popText = ot === "bonds" ? `+${pts} 💙` : ot === "stocks" ? `+${pts} 📈` : `+${pts} 🥇`;
              spawnPopup(popText, ORBS[ot].css);
              playClick();
            }
          } else {
            if (obs.isStorm) g.stormsDodged++;
          }
          toRemove.push(i);
        }
      });
      for (let i = toRemove.length - 1; i >= 0; i--) {
        const idx = toRemove[i];
        g.scene.remove(g.obstacles[idx].mesh);
        g.obstacles.splice(idx, 1);
      }

      // Ship lane glide (Slerp-style smooth snap-to-lane)
      const laneSnapSpeed = 0.13;
      g.ship.position.x += (g.targetLaneX - g.ship.position.x) * laneSnapSpeed;
      // Ship leans into the turn direction (solid body rotation, no warp)
      const shipLeanTarget = -(g.targetLaneX - g.ship.position.x) * 0.35;
      g.ship.rotation.z = THREE.MathUtils.lerp(g.ship.rotation.z, shipLeanTarget, 0.14);
      // Ship pitch up slightly at high speed
      g.ship.rotation.x = THREE.MathUtils.lerp(g.ship.rotation.x, speedMult > 1.8 ? -0.08 : 0, 0.08);

      // Camera follow X loosely (camera glides with ship, not teleports)
      g.camera.position.x += ((g.ship.position.x * 0.25) - g.camera.position.x) * 0.07;
      // Camera shake on high speed
      if (baseSpeed > 2.2) {
        g.camera.position.y = 2.5+(Math.random()-0.5)*0.05*(baseSpeed-2);
      } else {
        g.camera.position.y += (2.5-g.camera.position.y)*0.1;
      }

      // Thrust with lateral whip when changing lanes
      const lateralDelta = g.targetLaneX - g.ship.position.x;
      g.thrustLateralV = THREE.MathUtils.lerp(g.thrustLateralV || 0, lateralDelta * 0.4, 0.18);
      g.thrustT += dt * 10;
      const pos = g.thrustPositions;
      const thrustColor = g.goldShield ? 0xF1C40F : g.bullMarket ? 0xF1C40F : baseSpeed > 2 ? 0xFF6600 : 0x00F2FF;
      for (let i = 0; i < 60; i++) {
        const t = ((i/60) + g.thrustT*0.05) % 1;
        const whip = g.thrustLateralV * t * 0.6;
        pos[i*3]   = g.ship.position.x + (Math.random()-0.5)*0.3 + whip;
        pos[i*3+1] = g.ship.position.y - 1.2 - t*2.5;
        pos[i*3+2] = SHIP_Z + (Math.random()-0.5)*0.2;
      }
      g.thrust.geometry.attributes.position.needsUpdate = true;
      g.thrust.material.opacity = 0.6 + Math.sin(g.thrustT)*0.3;
      g.thrust.material.color.setHex(thrustColor);

      g.renderer.render(g.scene, g.camera);
    }
    rafRef.current = requestAnimationFrame(loop);
  }, [spawnPopup]);

  // ── Save rewards ─────────────────────────────────────────────────────────────
  const saveRewards = useCallback(async (finalScore, stats) => {
    if (saved || !progress?.id) return;
    setSaved(true);
    const xpGain = Math.min(50, Math.floor(finalScore / 3));
    const diversified = stats.bondsHit > 0 && stats.stocksHit > 0;
    const gemGain = (finalScore >= 150 ? 10 : finalScore >= 80 ? 5 : 2) + (diversified ? 5 : 0);
    const update = { xp: (progress.xp||0)+xpGain, gems: (progress.gems||0)+gemGain };
    await db.entities.UserProgress.update(progress.id, update);
    setProgress({ ...progress, ...update });
    if (finalScore >= 100) playChaChig();
  }, [progress, saved, setProgress]);

  useEffect(() => {
    if (gameState === "win") saveRewards(score, gameStats);
  }, [gameState]);

  // ── Keyboard controls ────────────────────────────────────────────────────────
  useEffect(() => {
    if (gameState !== "playing") return;
    const g = gameRef.current;
    const onKey = (e) => {
      if (!g?.playing) return;
      const LANES = g.LANES || LANES_EASY;
      if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") {
        const next = Math.max(0, g.currentLane - 1);
        g.currentLane = next; g.targetLaneX = LANES[next]; setLaneIdx(next);
      } else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") {
        const next = Math.min(LANES.length - 1, g.currentLane + 1);
        g.currentLane = next; g.targetLaneX = LANES[next]; setLaneIdx(next);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [gameState]);

  const moveLeft = useCallback(() => {
    const g = gameRef.current; if (!g?.playing) return;
    const LANES = g.LANES || LANES_EASY;
    const next = Math.max(0, g.currentLane - 1);
    g.currentLane = next; g.targetLaneX = LANES[next]; setLaneIdx(next);
  }, []);
  const moveRight = useCallback(() => {
    const g = gameRef.current; if (!g?.playing) return;
    const LANES = g.LANES || LANES_EASY;
    const next = Math.min(LANES.length - 1, g.currentLane + 1);
    g.currentLane = next; g.targetLaneX = LANES[next]; setLaneIdx(next);
  }, []);

  // ── Portfolio rank ──────────────────────────────────────────────────────────
  function getPortfolioReport(finalScore, stats) {
    const total = stats.bondsHit + stats.stocksHit + stats.goldHit;
    const diversified = stats.bondsHit > 0 && stats.stocksHit > 0;
    const dodgeRate = stats.stormsDodged + stats.stormsHit > 0
      ? Math.round((stats.stormsDodged / (stats.stormsDodged + stats.stormsHit)) * 100)
      : 100;
    let rank, rankColor, title, note;
    if (finalScore >= 200 && diversified && dodgeRate >= 70) { rank = "S"; rankColor = "#F1C40F"; title = "Master Investor"; note = "You played a perfectly balanced, high-growth strategy!"; }
    else if (finalScore >= 120 && diversified) { rank = "A"; rankColor = "#00F2FF"; title = "Portfolio Pro"; note = "Strong diversification with solid returns!"; }
    else if (finalScore >= 70) { rank = "B"; rankColor = "#2ECC71"; title = "Market Watcher"; note = "Good score but try to diversify more!"; }
    else if (finalScore >= 40) { rank = "C"; rankColor = "#FF6600"; title = "Risk Taker"; note = "Heavy focus on one asset type — balance your portfolio!"; }
    else { rank = "D"; rankColor = "#FF2244"; title = "Penny Pincher"; note = "The market was rough — study the orb types and try again!"; }
    const gemBonus = diversified ? 5 : 0;
    return { rank, rankColor, title, note, dodgeRate, diversified, gemBonus };
  }

  const report = (gameState === "win" || gameState === "gameover") ? getPortfolioReport(score, gameStats) : null;
  const balancePct = portfolioBalance;

  return (
    <div className="relative w-full select-none" style={{ height: 520 }}>
      <div ref={mountRef} className="absolute inset-0 rounded-xl overflow-hidden" />

      {/* Crack overlay on crash */}
      <AnimatePresence>
        {cracks && (
          <motion.div key="crack" initial={{ opacity: 0.9 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            className="absolute inset-0 pointer-events-none rounded-xl z-25"
            style={{
              background: "radial-gradient(circle, transparent 30%, rgba(100,0,200,0.5) 100%)",
              boxShadow: "inset 0 0 80px rgba(124,58,237,0.9)"
            }} />
        )}
      </AnimatePresence>

      {/* Screen flashes */}
      <AnimatePresence>
        {flashRed && (<motion.div key="red" initial={{ opacity: 0.65 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 pointer-events-none rounded-xl z-20" style={{ background: "rgba(255,20,60,0.4)", boxShadow: "inset 0 0 60px rgba(255,20,60,0.8)" }} />)}
        {flashCyan && (<motion.div key="cyan" initial={{ opacity: 0.4 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }} className="absolute inset-0 pointer-events-none rounded-xl z-20" style={{ background: "rgba(0,242,255,0.15)" }} />)}
        {flashGold && (<motion.div key="gold" initial={{ opacity: 0.5 }} animate={{ opacity: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="absolute inset-0 pointer-events-none rounded-xl z-20" style={{ background: "rgba(241,196,15,0.25)", boxShadow: "inset 0 0 60px rgba(241,196,15,0.6)" }} />)}
      </AnimatePresence>

      {/* Score popups */}
      <div className="absolute inset-0 pointer-events-none z-40 flex items-center justify-center">
        <AnimatePresence>
          {scorePopups.map(p => (
            <motion.div key={p.id}
              initial={{ y: 0, opacity: 1, scale: 1 }}
              animate={{ y: -70, opacity: 0, scale: 1.4 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              className="absolute font-black text-2xl"
              style={{ color: p.color, textShadow: `0 0 16px ${p.color}`, top: "45%", pointerEvents: "none" }}
            >
              {p.text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── HUD (playing) ─────────────────────────────────────────────────── */}
      {gameState === "playing" && (
        <>
          {/* Score */}
          <div className="absolute top-3 left-3 z-30 px-3 py-1.5 rounded-lg" style={{ background: "rgba(10,14,23,0.8)", border: "1px solid rgba(0,242,255,0.35)", backdropFilter: "blur(8px)" }}>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#00F2FF88" }}>Score</p>
            <p className="text-xl font-black font-mono" style={{ color: bullMarket ? "#F1C40F" : "#00F2FF", textShadow: `0 0 12px ${bullMarket ? "#F1C40F" : "#00F2FF"}` }}>
              {score}{bullMarket ? " ×2" : ""}
            </p>
          </div>

          {/* Timer */}
          <div className="absolute top-3 right-3 z-30 px-3 py-1.5 rounded-lg text-right" style={{ background: "rgba(10,14,23,0.8)", border: "1px solid rgba(0,242,255,0.35)", backdropFilter: "blur(8px)" }}>
            <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#00F2FF88" }}>Time</p>
            <p className="text-xl font-black font-mono" style={{ color: timeLeft <= 10 ? "#FF2244" : "#F1C40F" }}>{timeLeft}s</p>
          </div>

          {/* Center: Bull Market / Gold Shield badges */}
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-1">
            {bullMarket && (
              <motion.div animate={{ scale: [1, 1.08, 1] }} transition={{ repeat: Infinity, duration: 0.7 }}
                className="px-3 py-1 rounded-full text-[10px] font-black"
                style={{ background: "rgba(241,196,15,0.2)", border: "1.5px solid #F1C40F", color: "#F1C40F", boxShadow: "0 0 16px #F1C40F66" }}>
                🐂 BULL MARKET
              </motion.div>
            )}
            {goldShield && !bullMarket && (
              <div className="px-3 py-1 rounded-full text-[10px] font-black" style={{ background: "rgba(241,196,15,0.15)", border: "1.5px solid #F1C40F", color: "#F1C40F" }}>
                🛡️ GOLD SHIELD
              </div>
            )}
          </div>

          {/* Hearts */}
          <div className="absolute top-14 left-3 z-30 flex gap-1">
            {[0,1,2].map(i => (
              <span key={i} className="text-base" style={{ opacity: i < hearts ? 1 : 0.2 }}>❤️</span>
            ))}
          </div>

          {/* Portfolio Balance Meter */}
          <div className="absolute top-14 right-3 z-30" style={{ width: 120 }}>
            <p className="text-[8px] font-bold uppercase tracking-widest mb-0.5 text-right" style={{ color: "rgba(255,255,255,0.4)" }}>Portfolio</p>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.15)" }}>
              <div className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${balancePct}%`,
                  background: balancePct >= 30 && balancePct <= 70
                    ? "linear-gradient(90deg, #3B82F6, #00F2FF)"
                    : balancePct > 70 ? "#FF2244" : "#F1C40F"
                }} />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[7px] font-bold" style={{ color: "#3B82F6" }}>BONDS</span>
              <span className="text-[7px] font-bold" style={{ color: balancePct >= 30 && balancePct <= 70 ? "#2ECC71" : "#FF6600" }}>
                {balancePct >= 30 && balancePct <= 70 ? "✓ BALANCED" : balancePct > 70 ? "RISKY" : "SAFE"}
              </span>
              <span className="text-[7px] font-bold" style={{ color: "#00F2FF" }}>STOCKS</span>
            </div>
          </div>

          {/* Lane dots */}
          <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {(gameRef.current?.LANES || LANES_EASY).map((_, i) => (
              <div key={i} className="w-2.5 h-2.5 rounded-full transition-all duration-200"
                style={{ background: i === laneIdx ? (bullMarket ? "#F1C40F" : "#00F2FF") : "rgba(255,255,255,0.2)", boxShadow: i === laneIdx ? `0 0 8px ${bullMarket ? "#F1C40F" : "#00F2FF"}` : "none" }} />
            ))}
          </div>

          {/* Mission Control */}
          <div className="absolute bottom-16 left-3 right-3 z-30 px-3 py-1.5 rounded-lg"
            style={{ background: "rgba(10,14,23,0.85)", border: "1px solid rgba(0,242,255,0.2)", backdropFilter: "blur(8px)" }}>
            <p className="text-[9px] font-bold uppercase tracking-widest mb-0.5" style={{ color: "rgba(0,242,255,0.5)" }}>📡 MISSION CONTROL</p>
            <p className="text-[10px] font-semibold" style={{ color: "#00F2FF" }}>{missionMsg}</p>
          </div>

          {/* Touch controls */}
          <div className="absolute bottom-4 left-0 right-0 z-30 flex justify-between items-end px-4">
            <button onPointerDown={moveLeft} className="w-14 h-10 rounded-2xl flex items-center justify-center text-xl font-black active:scale-90 transition-transform" style={{ background: "rgba(0,242,255,0.08)", border: "1.5px solid rgba(0,242,255,0.25)", backdropFilter: "blur(12px)", color: "#00F2FF" }}>◀</button>
            <div className="flex gap-3 text-center">
              <div className="text-center">
                <p className="text-[7px] font-bold" style={{ color: "#3B82F6" }}>💙BONDS</p>
                <p className="text-[7px]" style={{ color: "#3B82F6" }}>+5 stable</p>
              </div>
              <div className="text-center">
                <p className="text-[7px] font-bold" style={{ color: "#00F2FF" }}>📈STOCKS</p>
                <p className="text-[7px]" style={{ color: "#00F2FF" }}>+20 risky</p>
              </div>
              <div className="text-center">
                <p className="text-[7px] font-bold" style={{ color: "#F1C40F" }}>🥇GOLD</p>
                <p className="text-[7px]" style={{ color: "#F1C40F" }}>shield</p>
              </div>
            </div>
            <button onPointerDown={moveRight} className="w-14 h-10 rounded-2xl flex items-center justify-center text-xl font-black active:scale-90 transition-transform" style={{ background: "rgba(0,242,255,0.08)", border: "1.5px solid rgba(0,242,255,0.25)", backdropFilter: "blur(12px)", color: "#00F2FF" }}>▶</button>
          </div>
        </>
      )}

      {/* ── Idle ───────────────────────────────────────────────────────────── */}
      {gameState === "idle" && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-4" style={{ background: "rgba(10,14,23,0.6)", backdropFilter: "blur(2px)" }}>
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <div className="text-6xl" style={{ filter: "drop-shadow(0 0 16px #00F2FF)" }}>🚀</div>
          </motion.div>
          <div className="text-center">
            <h2 className="text-xl font-black" style={{ color: "#00F2FF", textShadow: "0 0 20px #00F2FF66" }}>PORTFOLIO PILOT</h2>
            <p className="text-[10px] mt-1" style={{ color: "rgba(0,242,255,0.7)" }}>Market Dynamics Edition</p>
          </div>
          <div className="flex gap-3 text-center px-4">
            {[["💙","BONDS","+5 stable","#3B82F6"],["📈","STOCKS","+20 growth","#00F2FF"],["🥇","GOLD","Shield!","#F1C40F"],["📛","INFLATION","-Score","#FF2244"],["⬆️","RATE HIKE","Slow ship","#FF6600"],["💥","CRASH","-1 Heart","#7C3AED"]].map(([e,n,d,c])=>(
              <div key={n} className="flex-1 rounded-lg p-1.5" style={{ background: `${c}11`, border: `1px solid ${c}44` }}>
                <p className="text-base">{e}</p>
                <p className="text-[7px] font-black" style={{ color: c }}>{n}</p>
                <p className="text-[7px]" style={{ color: "rgba(255,255,255,0.4)" }}>{d}</p>
              </div>
            ))}
          </div>
          {part2Unlocked && (
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl" style={{ background: "rgba(147,51,234,0.15)", border: "1px solid rgba(147,51,234,0.4)" }}>
              <span className="text-xs font-bold text-gray-300">EASY</span>
              <button onClick={() => setHardMode(h => !h)} className="w-12 h-6 rounded-full relative transition-all" style={{ background: hardMode ? "rgba(147,51,234,0.8)" : "rgba(255,255,255,0.15)" }}>
                <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-all" style={{ left: hardMode ? 26 : 4 }} />
              </button>
              <span className="text-xs font-bold" style={{ color: hardMode ? "#C084FC" : "#666" }}>HARD {hardMode ? "🔥" : ""}</span>
            </div>
          )}
          <motion.button whileTap={{ scale: 0.93 }} onClick={() => startGame(hardMode)}
            className="px-10 py-3.5 rounded-xl font-extrabold text-base"
            style={{ background: hardMode ? "linear-gradient(135deg,#9333ea,#6d28d9)" : "linear-gradient(135deg,#00F2FF,#007799)", color: "#0A0E17", boxShadow: hardMode ? "0 0 24px rgba(147,51,234,0.6)" : "0 0 24px rgba(0,242,255,0.5)" }}>
            {hardMode ? "⚡ HARD LAUNCH" : "LAUNCH ▶"}
          </motion.button>
        </div>
      )}

      {/* ── Game Over ──────────────────────────────────────────────────────── */}
      {gameState === "gameover" && report && (
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-3 px-4" style={{ background: "rgba(20,0,0,0.85)", backdropFilter: "blur(4px)" }}>
          <div className="text-5xl">💥</div>
          <h2 className="text-xl font-black text-red-400">PORTFOLIO LIQUIDATED</h2>
          <div className="rounded-xl p-4 w-full max-w-xs text-center" style={{ background: "rgba(255,34,68,0.1)", border: "1px solid rgba(255,34,68,0.3)" }}>
            <p className="text-4xl font-black mb-1" style={{ color: report.rankColor }}>{report.rank}</p>
            <p className="text-sm font-bold text-white">{report.title}</p>
            <p className="text-xs text-gray-400 mt-1">{report.note}</p>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <div><p className="text-base font-black text-white">{gameStats.bondsHit}</p><p className="text-[8px] text-blue-400">Bonds</p></div>
              <div><p className="text-base font-black text-white">{gameStats.stocksHit}</p><p className="text-[8px]" style={{ color: "#00F2FF" }}>Stocks</p></div>
              <div><p className="text-base font-black text-white">{report.dodgeRate}%</p><p className="text-[8px] text-green-400">Dodged</p></div>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button onClick={() => { setSaved(false); setGameState("idle"); }}
              className="px-8 py-3 rounded-xl font-bold text-sm w-full"
              style={{ background: "linear-gradient(135deg,#FF2244,#AA0022)", color: "#fff", boxShadow: "0 0 20px rgba(255,34,68,0.5)" }}>
              RETRY
            </button>
            {lastStormHit && (
              <button onClick={() => navigate(`/knowledge?topic=${lastStormHit}`)}
                className="px-8 py-2.5 rounded-xl font-bold text-xs w-full"
                style={{ background: "rgba(0,242,255,0.1)", border: "1.5px solid rgba(0,242,255,0.4)", color: "#00F2FF" }}>
                📖 Learn why {lastStormHit === "inflation" ? "Inflation" : lastStormHit === "rate_hike" ? "Rate Hikes" : "Market Crashes"} hurt →
              </button>
            )}
          </div>
        </div>
      )}

      {/* ── Win / Portfolio Summary ─────────────────────────────────────────── */}
      {gameState === "win" && report && (
        <div className="absolute inset-0 z-30 overflow-y-auto" style={{ background: "rgba(0,10,20,0.9)", backdropFilter: "blur(6px)" }}>
          <div className="flex flex-col items-center gap-3 py-4 px-4">
            <motion.div animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} transition={{ duration: 0.8 }}>
              <div className="text-5xl">🏆</div>
            </motion.div>
            <h2 className="text-xl font-black" style={{ color: "#F1C40F", textShadow: "0 0 20px #F1C40F88" }}>MISSION COMPLETE</h2>
            <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>PORTFOLIO HEALTH REPORT</p>

            {/* Rank */}
            <div className="rounded-2xl p-4 w-full text-center" style={{ background: `${report.rankColor}15`, border: `2px solid ${report.rankColor}55`, boxShadow: `0 0 24px ${report.rankColor}33` }}>
              <p className="text-5xl font-black" style={{ color: report.rankColor, textShadow: `0 0 20px ${report.rankColor}` }}>{report.rank}</p>
              <p className="text-base font-extrabold text-white mt-1">{report.title}</p>
              <p className="text-xs text-gray-400 mt-1 leading-relaxed">{report.note}</p>
            </div>

            {/* Stats breakdown */}
            <div className="grid grid-cols-3 gap-2 w-full">
              {[
                { label: "💙 Bonds", val: gameStats.bondsHit, color: "#3B82F6" },
                { label: "📈 Stocks", val: gameStats.stocksHit, color: "#00F2FF" },
                { label: "🥇 Gold", val: gameStats.goldHit, color: "#F1C40F" },
                { label: "🎯 Dodged", val: `${report.dodgeRate}%`, color: "#2ECC71" },
                { label: "📛 Hits", val: gameStats.stormsHit, color: "#FF2244" },
                { label: "Score", val: score, color: "#F1C40F" },
              ].map(s => (
                <div key={s.label} className="rounded-lg p-2 text-center" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <p className="text-sm font-black" style={{ color: s.color }}>{s.val}</p>
                  <p className="text-[8px] text-gray-500">{s.label}</p>
                </div>
              ))}
            </div>

            {/* XP & Gem rewards */}
            <div className="rounded-xl p-3 w-full" style={{ background: "rgba(0,242,255,0.06)", border: "1px solid rgba(0,242,255,0.2)" }}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-center mb-2" style={{ color: "rgba(0,242,255,0.5)" }}>Rewards Earned</p>
              <div className="flex justify-around">
                <div className="text-center"><p className="text-lg font-black text-green-400">+{Math.min(50, Math.floor(score/3))} XP</p><p className="text-[8px] text-gray-500">Experience</p></div>
                <div className="text-center">
                  <p className="text-lg font-black" style={{ color: "#F1C40F" }}>
                    +{(score >= 150 ? 10 : score >= 80 ? 5 : 2) + report.gemBonus} 💎
                  </p>
                  <p className="text-[8px] text-gray-500">{report.diversified ? "Diversified Bonus!" : "Gems"}</p>
                </div>
              </div>
              {report.diversified && (
                <p className="text-center text-[9px] font-bold mt-2" style={{ color: "#F1C40F" }}>🎖️ +5 Diversification Bonus for balanced portfolio!</p>
              )}
            </div>

            <button onClick={() => { setSaved(false); setGameState("idle"); }}
              className="px-8 py-3 rounded-xl font-bold text-sm w-full"
              style={{ background: "linear-gradient(135deg,#00F2FF,#007799)", color: "#0A0E17", boxShadow: "0 0 20px rgba(0,242,255,0.4)" }}>
              PLAY AGAIN
            </button>
          </div>
        </div>
      )}
    </div>
  );
}