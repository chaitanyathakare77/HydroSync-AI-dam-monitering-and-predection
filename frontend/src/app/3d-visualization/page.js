"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import Sidebar from "../components/Sidebar"

export default function ThreeDVisualizationPage() {
  const [user, setUser] = useState(null)
  const [activeKey, setActiveKey] = useState("3d visualization")
  const [waterLevel, setWaterLevel] = useState(0.15)
  const [inflowValue, setInflowValue] = useState("")
  const [alertActive, setAlertActive] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [isReleasing, setIsReleasing] = useState(false)
  const [systemStatus, setSystemStatus] = useState("NORMAL")
  const mainRef = useRef(null)
  const canvasRef = useRef(null)
  const sceneRef = useRef(null)   // holds all mutable 3-D state
  const router = useRouter()

  /* ── Auth ── */
  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) { router.push("/login"); return }
    fetch("http://localhost:5000/api/auth/profile", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(r => r.json())
      .then(d => {
        if (d.message) { localStorage.removeItem("token"); router.push("/login") }
        else setUser(d)
      })
  }, [])

  /* ── Init Three.js once user is confirmed ── */
  useEffect(() => {
    if (!user) return
    let cancelled = false

    function startScene() {
      if (cancelled) return
      if (!canvasRef.current || !mainRef.current) return
      if (sceneRef.current) return          // already running

      const api = buildScene(canvasRef.current, mainRef.current)
      sceneRef.current = api
    }

    if (window.THREE) {
      // library already loaded (e.g. hot-reload)
      requestAnimationFrame(startScene)
    } else {
      const existing = document.getElementById("threejs-cdn")
      if (existing) {
        existing.addEventListener("load", () => requestAnimationFrame(startScene))
      } else {
        const s = document.createElement("script")
        s.id  = "threejs-cdn"
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"
        s.onload = () => requestAnimationFrame(startScene)
        document.head.appendChild(s)
      }
    }

    return () => {
      cancelled = true
      if (sceneRef.current) {
        sceneRef.current.dispose()
        sceneRef.current = null
      }
    }
  }, [user])

  /* ── Water-level simulation (React side) ── */
  useEffect(() => {
    if (!user) return
    const CRITICAL = 0.9
    const DANGER   = 0.8
    let autoRelease = false
    let alertFired  = false

    const id = setInterval(() => {
      setWaterLevel(prev => {
        const inflow = parseFloat(
          document.getElementById("inflowInput")?.value || "0"
        ) || 0

        // Map inflow (M) to target level percentage
        let targetLevel
        if (inflow <= 200) targetLevel = (inflow / 200) * 0.1
        else if (inflow <= 500) targetLevel = 0.1 + ((inflow - 200) / 300) * 0.15
        else if (inflow <= 900) targetLevel = 0.25 + ((inflow - 500) / 400) * 0.25
        else if (inflow <= 1300) targetLevel = 0.5 + ((inflow - 900) / 400) * 0.2
        else if (inflow <= 1700) targetLevel = 0.7 + ((inflow - 1300) / 400) * 0.2
        else targetLevel = 0.9 + Math.min((inflow - 1700) / 1700 * 0.1, 0.1)

        const rise = (targetLevel - prev) * 0.02  // gradual approach
        let next = prev + rise

        /* Trigger emergency release */
        if (next >= CRITICAL && !alertFired) {
          alertFired  = true
          autoRelease = true
          setAlertActive(true)
          setIsReleasing(true)
          setAlertMessage("⚠️ CRITICAL: Water level critical! Emergency gates opened!")
          setSystemStatus("EMERGENCY")
          sceneRef.current?.setGateOpen(1.0)
         
           // Send WhatsApp alerts to registered villagers
           const sendWhatsAppAlerts = async () => {
             try {
               const registrations = localStorage.getItem("villager_registrations")
               const villagers = registrations ? JSON.parse(registrations) : []
             
               if (villagers.length === 0) {
                 console.log("No registered villagers to alert")
                 return
               }
             
               const phoneNumbers = villagers.map(v => v.mobile)
               const token = localStorage.getItem("token")
             
               const alertText = `🚨 JAYAKWADI DAM EMERGENCY ALERT 🚨\n\nWater level has reached CRITICAL (90%)!\n\nEmergency gates have been OPENED!\n\n⚠️ URGENT: Evacuate to safer areas immediately!\n\n- HydroSync AI Monitoring System`
             
               const response = await fetch("http://localhost:5000/api/alerts/send-dam-alert", {
                 method: "POST",
                 headers: {
                   "Content-Type": "application/json",
                   Authorization: `Bearer ${token}`
                 },
                 body: JSON.stringify({
                   phoneNumbers,
                   alertMessage: alertText,
                   waterLevel: 90
                 })
               })
             
               const data = await response.json()
               console.log("WhatsApp alerts sent:", data)
             } catch (error) {
               console.error("Error sending alerts:", error)
             }
           }
         
           sendWhatsAppAlerts()
        }

        /* Drain during auto-release */
        if (autoRelease) {
          next -= 0.0035
          if (next < DANGER) {
            autoRelease = false
            alertFired  = false
            setAlertActive(false)
            setIsReleasing(false)
            setAlertMessage("")
            setSystemStatus(next < 0.5 ? "NORMAL" : "MONITORING")
            sceneRef.current?.setGateOpen(0)
          }
        }

        next = Math.max(0.05, Math.min(1.0, next))

        /* Status colour */
        if (!autoRelease) {
          if      (next >= CRITICAL) setSystemStatus("EMERGENCY")
          else if (next >= DANGER)   setSystemStatus("WARNING")
          else if (next >= 0.5)      setSystemStatus("MONITORING")
          else                       setSystemStatus("NORMAL")
        }

        sceneRef.current?.setWaterLevel(next)
        return next
      })
    }, 500)

    return () => clearInterval(id)
  }, [user])

  /* ── UI handlers ── */
  const handleManualRelease = () => {
    const next = !isReleasing
    setIsReleasing(next)
    sceneRef.current?.setGateOpen(next ? 1.0 : 0)
  }

  const handleLogout   = () => { localStorage.removeItem("token"); router.push("/login") }
  const handleNavClick = item => {
    setActiveKey(item.key)
    if (item.key !== "3d visualization") router.push(item.href)
  }

  /* ── Derived display values ── */
  const levelPct     = Math.round(waterLevel * 100)
  const DANGER_PCT   = 80
  const CRITICAL_PCT = 90
  const thermColor   =
    levelPct >= CRITICAL_PCT ? "#ff2222" :
    levelPct >= DANGER_PCT   ? "#ffaa00" :
    levelPct >= 50           ? "#ffee00" : "#22dd88"

  const statusStyle = {
    NORMAL:     { bg:"rgba(34,200,100,0.15)",  border:"rgba(34,200,100,0.5)",  text:"#22cc66" },
    MONITORING: { bg:"rgba(255,220,0,0.15)",   border:"rgba(255,220,0,0.5)",   text:"#ffdd00" },
    WARNING:    { bg:"rgba(255,140,0,0.15)",   border:"rgba(255,140,0,0.5)",   text:"#ffaa00" },
    EMERGENCY:  { bg:"rgba(255,30,30,0.15)",   border:"rgba(255,30,30,0.6)",   text:"#ff3333" },
  }
  const sc = statusStyle[systemStatus] || statusStyle.NORMAL

  /* ── Loading screen ── */
  if (!user) return (
    <div className="flex h-screen w-full items-center justify-center"
         style={{ background: "linear-gradient(135deg,#e0f0ff,#e8e0ff)" }}>
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent" />
        <span className="text-sm tracking-widest uppercase text-blue-600 opacity-70">
          Loading 3-D Visualization…
        </span>
      </div>
    </div>
  )

  /* ════════════════════════════════════════════════════════════
     RENDER
  ════════════════════════════════════════════════════════════ */
  return (
    <div className="flex h-screen w-full overflow-hidden font-sans">
      <Sidebar activeKey={activeKey} onNavClick={handleNavClick}
               user={user} onLogout={handleLogout} />

      <main ref={mainRef}
            className="relative flex-1 overflow-hidden"
            style={{ background: "#0d1e2e" }}>

        {/* ── THREE.JS CANVAS ── */}
        <canvas
          ref={canvasRef}
          style={{ display:"block", width:"100%", height:"100%", touchAction:"none" }}
        />

        {/* ── HUD – top-left ── */}
        <div style={{
          position:"absolute", top:14, left:14,
          background:"rgba(0,0,0,0.60)", border:"1px solid rgba(255,255,255,0.14)",
          borderRadius:10, padding:"11px 15px", color:"#aaccee",
          fontSize:11, lineHeight:1.9, pointerEvents:"none", fontFamily:"monospace",
        }}>
          <b style={{color:"#fff"}}>Concrete Dam — 3-D Simulation</b><br/>
          Left-drag → Orbit &nbsp;|&nbsp; Right-drag → Pan<br/>
          Scroll → Zoom<br/><br/>
          <span id="fps-counter">FPS: —</span>
        </div>

        {/* ── Thermometer gauge – top-right ── */}
        <div style={{
          position:"absolute", top:14, right:14,
          background:"rgba(0,0,0,0.70)", border:"1px solid rgba(255,255,255,0.15)",
          borderRadius:12, padding:"14px 18px", color:"#aaccee",
          fontFamily:"monospace", fontSize:12, minWidth:170,
          display:"flex", flexDirection:"column", gap:8,
        }}>
          <div style={{color:"#fff",fontWeight:"bold",textAlign:"center",fontSize:13}}>
            Reservoir Level
          </div>

          <div style={{display:"flex",alignItems:"flex-end",justifyContent:"center",gap:10}}>
            {/* Bar */}
            <div style={{
              position:"relative", width:28, height:160,
              background:"rgba(255,255,255,0.07)", borderRadius:14,
              border:"1px solid rgba(255,255,255,0.18)", overflow:"hidden",
            }}>
              {/* Danger line */}
              <div style={{
                position:"absolute",left:0,right:0,
                bottom:`${DANGER_PCT}%`,height:1,
                background:"rgba(255,170,0,0.75)",
              }}/>
              {/* Critical line */}
              <div style={{
                position:"absolute",left:0,right:0,
                bottom:`${CRITICAL_PCT}%`,height:1,
                background:"rgba(255,50,50,0.9)",
              }}/>
              {/* Fill */}
              <div style={{
                position:"absolute",bottom:0,left:0,right:0,
                height:`${levelPct}%`,
                background:`linear-gradient(to top,${thermColor}cc,${thermColor}55)`,
                transition:"height 0.5s ease, background 0.5s ease",
              }}/>
            </div>

            {/* Tick labels */}
            <div style={{
              display:"flex",flexDirection:"column-reverse",
              justifyContent:"space-between",height:160,
              fontSize:10,color:"#88aacc",
            }}>
              {[0,20,40,60,80,90,100].map(v=>(
                <div key={v} style={{
                  color: v===90?"#ff4444":v===80?"#ffaa00":"#88aacc",
                  fontWeight: v>=80?"bold":"normal",
                }}>{v}%</div>
              ))}
            </div>
          </div>

          {/* Numeric */}
          <div style={{
            textAlign:"center",fontSize:22,fontWeight:"bold",
            color:thermColor,transition:"color 0.5s",
            textShadow:`0 0 10px ${thermColor}88`,
          }}>
            {levelPct}%
          </div>

          {/* Status badge */}
          <div style={{
            textAlign:"center",padding:"4px 8px",borderRadius:6,
            background:sc.bg, border:`1px solid ${sc.border}`,
            color:sc.text, fontWeight:"bold", fontSize:11,
          }}>
            {systemStatus}
          </div>

          <div style={{fontSize:10,color:"#668899",textAlign:"center"}}>
            Inflow: {parseFloat(inflowValue)||0} M
          </div>
        </div>

        {/* ── Alert banner ── */}
        {alertActive && (
          <div style={{
            position:"absolute",top:400,right:14,
            background:"rgba(160,0,0,0.92)",
            border:"2px solid #ff4444",borderRadius:14,
            padding:"18px 32px",color:"#fff",
            fontFamily:"monospace",fontSize:15,fontWeight:"bold",
            textAlign:"center",zIndex:200,width:170,
            boxShadow:"0 0 50px rgba(255,50,50,0.7)",
          }}>
            <div style={{fontSize:30,marginBottom:8}}>🚨</div>
            {alertMessage}
            <div style={{fontSize:11,marginTop:8,opacity:0.8}}>
              Emergency gates activated — releasing water downstream
            </div>
          </div>
        )}

        {/* ── Inflow + controls panel (bottom-centre) ── */}
        <div style={{
          position:"absolute",bottom:70,left:"50%",
          transform:"translateX(-50%)",
          background:"rgba(0,0,0,0.72)",
          border:"1px solid rgba(255,255,255,0.16)",
          borderRadius:12,padding:"13px 22px",
          color:"#aaddff",fontFamily:"monospace",fontSize:12,
          display:"flex",gap:18,alignItems:"center",flexWrap:"wrap",
          justifyContent:"center",
        }}>
          {/* Inflow */}
          <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"center"}}>
            <span style={{fontSize:10,color:"#88aacc",letterSpacing:1}}>WATER INFLOW</span>
            <div style={{display:"flex",gap:7,alignItems:"center"}}>
              <input
                id="inflowInput"
                type="number" min="0" placeholder="0"
                value={inflowValue}
                onChange={e=>setInflowValue(e.target.value)}
                style={{
                  width:80,padding:"5px 9px",borderRadius:7,
                  background:"rgba(255,255,255,0.07)",
                  border:"1px solid rgba(100,180,255,0.4)",
                  color:"#aaddff",fontSize:13,fontFamily:"monospace",outline:"none",
                }}
              />
              <span style={{fontSize:11,color:"#668899"}}>m³/s</span>
            </div>
          </div>

          <div style={{width:1,height:38,background:"rgba(255,255,255,0.12)"}}/>

          {/* Gate control */}
          <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"center"}}>
            <span style={{fontSize:10,color:"#88aacc",letterSpacing:1}}>GATE CONTROL</span>
            <button onClick={handleManualRelease} style={{
              padding:"6px 16px",borderRadius:7,cursor:"pointer",
              fontFamily:"monospace",fontWeight:"bold",fontSize:12,
              background: isReleasing?"rgba(255,50,50,0.35)":"rgba(50,200,100,0.28)",
              border:`1px solid ${isReleasing?"rgba(255,80,80,0.6)":"rgba(50,220,100,0.5)"}`,
              color: isReleasing?"#ff8888":"#88ffaa",transition:"all 0.3s",
            }}>
              {isReleasing ? "🔴 CLOSE GATES" : "🟢 OPEN GATES"}
            </button>
          </div>

          <div style={{width:1,height:38,background:"rgba(255,255,255,0.12)"}}/>

          {/* Camera views */}
          <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"center"}}>
            <span style={{fontSize:10,color:"#88aacc",letterSpacing:1}}>CAMERA VIEW</span>
            <div style={{display:"flex",gap:6}}>
              {["FRONT","RESERVOIR","TOP"].map(v=>(
                <button key={v}
                  onClick={()=>sceneRef.current?.setView(v.toLowerCase())}
                  style={{
                    padding:"5px 11px",borderRadius:7,cursor:"pointer",
                    background:"rgba(80,80,130,0.4)",
                    border:"1px solid rgba(150,150,255,0.4)",
                    color:"#aaaaff",fontFamily:"monospace",fontSize:10,
                  }}>{v}</button>
              ))}
            </div>
          </div>

          <div style={{width:1,height:38,background:"rgba(255,255,255,0.12)"}}/>

          {/* Speed */}
          <div style={{display:"flex",flexDirection:"column",gap:5,alignItems:"center"}}>
            <span style={{fontSize:10,color:"#88aacc",letterSpacing:1}}>FLOW SPEED</span>
            <input type="range" id="speedSlider" min="0.2" max="3" step="0.1" defaultValue="1"
              style={{width:90,cursor:"pointer"}}/>
          </div>
        </div>

        <style>{`
          @keyframes alertPulse {
            from { box-shadow: 0 0 20px rgba(255,50,50,0.4); }
            to   { box-shadow: 0 0 60px rgba(255,50,50,0.9); }
          }
        `}</style>
      </main>
    </div>
  )
}

/* ══════════════════════════════════════════════════════════════
   BUILD SCENE  –  returns a small API object used by React
══════════════════════════════════════════════════════════════ */
function buildScene(canvas, container) {
  const THREE = window.THREE
  if (!THREE) { console.error("THREE not loaded"); return null }

  /* ── Renderer ── */
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false })
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type    = THREE.PCFSoftShadowMap
  renderer.toneMapping       = THREE.ACESFilmicToneMapping
  renderer.toneMappingExposure = 1.1

  /* ── Camera ── */
  const camera = new THREE.PerspectiveCamera(52, container.clientWidth/container.clientHeight, 0.1, 800)

  function resize() {
    const w = container.clientWidth, h = container.clientHeight
    if (w > 0 && h > 0) {
      renderer.setSize(w, h, false)       // false → don't set canvas CSS
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
  }
  resize()
  new ResizeObserver(resize).observe(container)

  /* ── Scene ── */
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(0x0d1e2e)
  scene.fog = new THREE.FogExp2(0x0d1e2e, 0.0035)

  // Orbit state
  let orb  = { theta:0.05, phi:0.44, r:85 }
  let orbT = { theta:0.05, phi:0.44, r:85 }
  const lookAt = new THREE.Vector3(0, 8, 0)

  function applyCamera() {
    camera.position.set(
      lookAt.x + orb.r * Math.sin(orb.phi) * Math.sin(orb.theta),
      lookAt.y + orb.r * Math.cos(orb.phi),
      lookAt.z + orb.r * Math.sin(orb.phi) * Math.cos(orb.theta),
    )
    camera.lookAt(lookAt)
  }
  applyCamera()

  /* ── Lights ── */
  scene.add(new THREE.AmbientLight(0x6688bb, 0.6))

  const sun = new THREE.DirectionalLight(0xfff4e0, 1.5)
  sun.position.set(40, 70, 35)
  sun.castShadow = true
  sun.shadow.mapSize.set(2048, 2048)
  sun.shadow.camera.left   = -100
  sun.shadow.camera.right  =  100
  sun.shadow.camera.top    =  100
  sun.shadow.camera.bottom = -100
  sun.shadow.camera.far    =  400
  sun.shadow.bias = -0.001
  scene.add(sun)

  const fill = new THREE.DirectionalLight(0x88bbff, 0.5)
  fill.position.set(-30, 25, -20)
  scene.add(fill)

  const back = new THREE.DirectionalLight(0x334466, 0.3)
  back.position.set(0, -5, 40)
  scene.add(back)

  /* ════════════════════════════════════════════════
     MATERIALS
  ════════════════════════════════════════════════ */
  function makeCanvas(w, h, fn) {
    const cv = document.createElement("canvas")
    cv.width = w; cv.height = h
    fn(cv.getContext("2d"), w, h)
    return cv
  }

  // Concrete texture
  const concCanvas = makeCanvas(256, 256, (ctx, w, h) => {
    ctx.fillStyle = "#8c8c84"; ctx.fillRect(0,0,w,h)
    for (let i=0;i<5000;i++){
      const x=Math.random()*w, y=Math.random()*h, d=Math.random()*2+0.5
      const l=Math.floor(110+Math.random()*50-25)
      ctx.fillStyle=`rgb(${l+6},${l+6},${l})`; ctx.fillRect(x,y,d,d)
    }
    for (let i=0;i<15;i++){
      ctx.beginPath()
      ctx.moveTo(Math.random()*w, Math.random()*h)
      ctx.lineTo(Math.random()*w, Math.random()*h)
      ctx.strokeStyle=`rgba(40,40,35,${Math.random()*0.2})`
      ctx.lineWidth=Math.random()*1.8; ctx.stroke()
    }
  })
  const concTex = new THREE.CanvasTexture(concCanvas)
  concTex.wrapS = concTex.wrapT = THREE.RepeatWrapping
  concTex.repeat.set(6,3)

  // Water texture
  function makeWaterTex(moving) {
    const wc = makeCanvas(256,256,(ctx,w,h)=>{
      ctx.fillStyle="#083060"; ctx.fillRect(0,0,w,h)
      for(let i=0;i<70;i++){
        ctx.beginPath()
        const x=Math.random()*w, y=Math.random()*h
        const len=12+Math.random()*45
        ctx.moveTo(x,y)
        ctx.lineTo(x+len*(moving?0.12:0.9), y+(Math.random()-0.5)*5)
        ctx.strokeStyle=`rgba(120,200,255,${Math.random()*0.3+0.06})`
        ctx.lineWidth=Math.random()*2.2; ctx.stroke()
      }
    })
    const t = new THREE.CanvasTexture(wc)
    t.wrapS = t.wrapT = THREE.RepeatWrapping
    return t
  }

  const mat = {
    concrete:     new THREE.MeshLambertMaterial({color:0x9c9c92, map:concTex}),
    concreteDark: new THREE.MeshLambertMaterial({color:0x7a7a70, map:concTex}),
    pier:         new THREE.MeshLambertMaterial({color:0x8a8a82, map:concTex}),
    gateFrame:    new THREE.MeshLambertMaterial({color:0x4a4a40}),
    gateDoor:     new THREE.MeshLambertMaterial({color:0x3a5835}),
    gateBar:      new THREE.MeshLambertMaterial({color:0x1e3a1a}),
    rail:         new THREE.MeshLambertMaterial({color:0x383830}),
    riverBed:     new THREE.MeshLambertMaterial({color:0x5c4a36}),
    sideWall:     new THREE.MeshLambertMaterial({color:0x685e5e}),
    void:         new THREE.MeshBasicMaterial({color:0x020608}),
  }

  /* ════════════════════════════════════════════════
     DAM BODY
  ════════════════════════════════════════════════ */
  const DAM_W      = 60
  const DAM_H      = 22
  const DAM_BASE_T = 12
  const DAM_TOP_T  = 5
  const NUM_GATES  = 5
  const GATE_W     = 5.5
  const GATE_H     = 8.0
  const GATE_Y_BASE= 1.0
  // front-face Z at height y (tapered upstream face)
  const ffz = y => DAM_BASE_T/2 - (DAM_BASE_T/2 - DAM_TOP_T/2)*(y/DAM_H)

  // Tapered dam body via BufferGeometry
  ;(()=>{
    const g = new THREE.BufferGeometry()
    const hw=DAM_W/2, tb=DAM_BASE_T/2, tt=DAM_TOP_T/2, h=DAM_H
    g.setAttribute("position", new THREE.BufferAttribute(new Float32Array([
      -hw,0, tb,  hw,0, tb,  hw,h, tt, -hw,h, tt,   // front face
      -hw,0,-tb,  hw,0,-tb,  hw,h,-tt, -hw,h,-tt,   // back face
    ]),3))
    g.setIndex([
      0,1,2, 0,2,3,   // front
      5,4,7, 5,7,6,   // back
      4,0,3, 4,3,7,   // left
      1,5,6, 1,6,2,   // right
      3,2,6, 3,6,7,   // top
      4,5,1, 4,1,0,   // bottom
    ])
    g.computeVertexNormals()
    // simple UVs
    const uv=new Float32Array([0,0,1,0,1,1,0,1, 0,0,1,0,1,1,0,1])
    g.setAttribute("uv",new THREE.BufferAttribute(uv,2))
    const m = new THREE.Mesh(g, mat.concrete)
    m.castShadow = m.receiveShadow = true
    scene.add(m)
  })()

  // Crest walkway
  const crest = new THREE.Mesh(
    new THREE.BoxGeometry(DAM_W+1, 1.6, DAM_TOP_T+2),
    mat.concreteDark,
  )
  crest.position.set(0, DAM_H+0.8, (DAM_TOP_T-DAM_BASE_T)/4)
  crest.castShadow = true
  scene.add(crest)

  // Parapet rails along crest
  ;[-1,1].forEach(side=>{
    const p=new THREE.Mesh(new THREE.BoxGeometry(DAM_W+1,0.9,0.3),mat.concreteDark)
    p.position.set(0,DAM_H+1.9,side*(DAM_TOP_T/2+1)+(DAM_TOP_T-DAM_BASE_T)/4)
    scene.add(p)
  })

  // Buttresses (upstream)
  for(let i=0;i<7;i++){
    const bx=-DAM_W/2+(i+0.5)*(DAM_W/7)
    const b=new THREE.Mesh(new THREE.BoxGeometry(1.6,DAM_H*0.88,8),mat.concreteDark)
    b.position.set(bx,DAM_H*0.44,-DAM_BASE_T/2-4)
    b.castShadow=true; scene.add(b)
  }

  /* ════════════════════════════════════════════════
     GATES
  ════════════════════════════════════════════════ */
  const gateDoors = [], gateBarGroups = [], gateOpenings = []
  const gateSpacing = DAM_W/(NUM_GATES+1)

  for(let i=0;i<NUM_GATES;i++){
    const gx = -DAM_W/2 + gateSpacing*(i+1)
    const pw  = (gateSpacing-GATE_W)/2 - 0.3

    // Piers
    ;[-1,1].forEach(side=>{
      const p=new THREE.Mesh(new THREE.BoxGeometry(pw,DAM_H+2,DAM_BASE_T+0.4),mat.pier)
      p.position.set(gx+side*(GATE_W/2+pw/2), DAM_H/2, 0)
      p.castShadow=true; scene.add(p)
    })

    // Void (opening)
    const vm=new THREE.Mesh(new THREE.BoxGeometry(GATE_W+0.05,GATE_H,DAM_BASE_T+1.5),mat.void)
    vm.position.set(gx, GATE_Y_BASE+GATE_H/2, 0); scene.add(vm)

    // Gate frame
    const midY=GATE_Y_BASE+GATE_H/2
    const fm=new THREE.Mesh(new THREE.BoxGeometry(GATE_W+0.9,GATE_H+0.9,0.55),mat.gateFrame)
    fm.position.set(gx, midY, ffz(midY)+0.28); scene.add(fm)

    // Side rails
    ;[-1,1].forEach(side=>{
      const rl=new THREE.Mesh(new THREE.BoxGeometry(0.32,GATE_H+1.6,0.58),mat.rail)
      rl.position.set(gx+side*(GATE_W/2+0.12), GATE_Y_BASE+GATE_H/2, ffz(GATE_Y_BASE+GATE_H/2)+0.32)
      scene.add(rl)
    })

    // Gate door (slides up)
    const door=new THREE.Mesh(new THREE.BoxGeometry(GATE_W-0.18,GATE_H,0.48),mat.gateDoor)
    door.position.set(gx, GATE_Y_BASE+GATE_H/2, ffz(GATE_Y_BASE+GATE_H/2)+0.22)
    door.castShadow=true; scene.add(door); gateDoors.push(door)

    // Horizontal bars on door
    const bars=[]
    for(let b=0;b<5;b++){
      const by=GATE_Y_BASE+0.75+b*((GATE_H-0.75)/4)
      const bar=new THREE.Mesh(new THREE.BoxGeometry(GATE_W-0.18,0.24,0.58),mat.gateBar)
      bar.position.set(gx, by, ffz(by)+0.28); scene.add(bar); bars.push(bar)
    }
    gateBarGroups.push(bars)

    // Gate tower
    const tw=new THREE.Mesh(new THREE.BoxGeometry(GATE_W+1,4,1.3),mat.concreteDark)
    tw.position.set(gx, DAM_H+2.6, ffz(DAM_H)+0.65); tw.castShadow=true; scene.add(tw)
    // Hoist cable
    const cb=new THREE.Mesh(new THREE.BoxGeometry(0.12,5.5,0.12),
      new THREE.MeshLambertMaterial({color:0x999090}))
    cb.position.set(gx, DAM_H+0.5, ffz(DAM_H)+0.32); scene.add(cb)

    gateOpenings.push({x:gx, y:GATE_Y_BASE})
  }

  /* ════════════════════════════════════════════════
     TERRAIN / RIVERBED
  ════════════════════════════════════════════════ */
  // Abutments (sides)
  ;[-1,1].forEach(side=>{
    const a=new THREE.Mesh(new THREE.BoxGeometry(14,DAM_H*0.92,DAM_BASE_T+6),mat.sideWall)
    a.position.set(side*(DAM_W/2+7), DAM_H*0.46, -2)
    a.castShadow=true; scene.add(a)
  })

  // Downstream bed
  const downBed=new THREE.Mesh(new THREE.BoxGeometry(DAM_W+28,1,100),mat.riverBed)
  downBed.position.set(0,-0.5,DAM_BASE_T/2+50)
  downBed.receiveShadow=true; scene.add(downBed)
  ;[-1,1].forEach(side=>{
    const w=new THREE.Mesh(new THREE.BoxGeometry(14,12,100),mat.sideWall)
    w.position.set(side*(DAM_W/2+7),6,DAM_BASE_T/2+50)
    w.receiveShadow=true; scene.add(w)
  })
  // Apron
  const apron=new THREE.Mesh(new THREE.BoxGeometry(DAM_W+6,0.7,20),mat.concreteDark)
  apron.position.set(0,0.35,DAM_BASE_T/2+10); scene.add(apron)

  // Upstream basin
  const upBed=new THREE.Mesh(new THREE.BoxGeometry(DAM_W+28,1,100),mat.riverBed)
  upBed.position.set(0,-0.5,-DAM_BASE_T/2-50)
  upBed.receiveShadow=true; scene.add(upBed)
  ;[-1,1].forEach(side=>{
    const w=new THREE.Mesh(new THREE.BoxGeometry(14,28,100),mat.sideWall)
    w.position.set(side*(DAM_W/2+7),14,-DAM_BASE_T/2-50); scene.add(w)
  })

  /* ════════════════════════════════════════════════
     WATER SURFACES
  ════════════════════════════════════════════════ */
  // Reservoir surface
  const resTex = makeWaterTex(false); resTex.repeat.set(5,5)
  const resMat = new THREE.MeshLambertMaterial({
    color:0x1155aa, transparent:true, opacity:0.88, map:resTex,
  })
  const reservoir = new THREE.Mesh(new THREE.BoxGeometry(DAM_W+22, 0.6, 96), resMat)
  scene.add(reservoir)

  // Reservoir volume (sides) – scales vertically with level
  const resVolMat = new THREE.MeshLambertMaterial({color:0x0d3a77,transparent:true,opacity:0.75})
  const resVol    = new THREE.Mesh(new THREE.BoxGeometry(DAM_W+22,1,96), resVolMat)
  scene.add(resVol)

  // Downstream river
  const dnTex = makeWaterTex(false); dnTex.repeat.set(3,7)
  const dnMat = new THREE.MeshLambertMaterial({color:0x1166cc,transparent:true,opacity:0.72,map:dnTex})
  const downRiver = new THREE.Mesh(new THREE.BoxGeometry(DAM_W+22,0.45,96),dnMat)
  downRiver.position.set(0,0.62,DAM_BASE_T/2+50); scene.add(downRiver)

  /* ── Reservoir level setter ── */
  let waterLevel = 0.15
  function setWaterLevel(v) {
    waterLevel = Math.max(0.05, Math.min(1.0, v))
    const y = waterLevel * DAM_H
    reservoir.position.set(0, y, -DAM_BASE_T/2-50)
    resVol.scale.y = y
    resVol.position.set(0, y/2, -DAM_BASE_T/2-50)
  }
  setWaterLevel(waterLevel)

  /* ── Overflow cascade (near crest) ── */
  const ovfMat = new THREE.MeshLambertMaterial({color:0x44aaee,transparent:true,opacity:0})
  const ovfMesh= new THREE.Mesh(new THREE.BoxGeometry(DAM_W-2,0.45,DAM_TOP_T+2),ovfMat)
  ovfMesh.position.set(0,DAM_H+1.7,0); scene.add(ovfMesh)

  const cascadeMats=[], cascadeMeshes=[]
  for(let i=0;i<9;i++){
    const cm=new THREE.MeshLambertMaterial({color:0x44bbff,transparent:true,opacity:0})
    const ch=new THREE.Mesh(new THREE.BoxGeometry(DAM_W-2,0.5,2.5),cm)
    ch.position.set(0, DAM_H-i*2.4, DAM_BASE_T/2-i*0.32); scene.add(ch)
    cascadeMats.push(cm); cascadeMeshes.push(ch)
  }

  /* ════════════════════════════════════════════════
     GATE FLOW EFFECTS
  ════════════════════════════════════════════════ */
  const flowTex = makeWaterTex(true); flowTex.repeat.set(1,8)
  const allFlow = []
  let gateOpenAmount = 0     // 0..1
  let gateOpenTarget = 0

  for(let gi=0;gi<NUM_GATES;gi++){
    const gx=gateOpenings[gi].x
    const group=[]

    // Through-gate stream
    const sM=new THREE.MeshLambertMaterial({color:0x22aaff,transparent:true,opacity:0,map:flowTex.clone()})
    const sm=new THREE.Mesh(new THREE.BoxGeometry(GATE_W-0.28,GATE_H*0.6,DAM_BASE_T+0.6),sM)
    sm.position.set(gx,GATE_Y_BASE+GATE_H*0.3,0); scene.add(sm)
    group.push({mesh:sm,type:"through",mat:sM})

    // Fall segments
    for(let s=0;s<14;s++){
      const fM=new THREE.MeshLambertMaterial({
        color:s<4?0x22aaff:0x33bbee, transparent:true, opacity:0, map:flowTex.clone(),
      })
      const fm=new THREE.Mesh(new THREE.BoxGeometry(GATE_W-0.32,1.05,GATE_W-0.22),fM)
      fm.position.set(gx, GATE_Y_BASE-s*1.1, ffz(Math.max(0,GATE_Y_BASE-s*1.1))+1.05)
      scene.add(fm); group.push({mesh:fm,type:"fall",segIdx:s,mat:fM})
    }

    // Splash pool
    const spM=new THREE.MeshLambertMaterial({color:0x55ccff,transparent:true,opacity:0})
    const spm=new THREE.Mesh(new THREE.BoxGeometry(GATE_W+4.5,0.48,GATE_W+6.5),spM)
    spm.position.set(gx,0.88,DAM_BASE_T/2+4.5); scene.add(spm)
    group.push({mesh:spm,type:"splash",mat:spM})

    // Mist particles
    for(let p=0;p<18;p++){
      const mM=new THREE.MeshLambertMaterial({color:0xaaddff,transparent:true,opacity:0})
      const mm=new THREE.Mesh(new THREE.BoxGeometry(0.5,0.35,0.5),mM)
      mm.userData={
        bx: gx+(Math.random()-0.5)*6,
        sp: 0.3+Math.random()*0.6,
        ph: Math.random()*Math.PI*2,
        amp:Math.random()*2.5,
      }
      scene.add(mm); group.push({mesh:mm,type:"mist",mat:mM})
    }

    allFlow.push({gx,group})
  }

  function setGateOpen(v) { gateOpenTarget = Math.max(0,Math.min(1,v)) }

  /* ════════════════════════════════════════════════
     MOUSE / TOUCH ORBIT
  ════════════════════════════════════════════════ */
  let drag={active:false,right:false,lx:0,ly:0}

  canvas.addEventListener("mousedown", e=>{
    drag={active:true,right:e.button===2,lx:e.clientX,ly:e.clientY}
  })
  window.addEventListener("mouseup",   ()=>{ drag.active=false })
  window.addEventListener("mousemove", e=>{
    if(!drag.active) return
    const dx=(e.clientX-drag.lx)*0.007, dy=(e.clientY-drag.ly)*0.006
    if(drag.right){ lookAt.x-=dx*orb.r*0.14; lookAt.y+=dy*orb.r*0.14 }
    else { orbT.theta-=dx; orbT.phi=Math.max(0.05,Math.min(1.45,orbT.phi+dy)) }
    drag.lx=e.clientX; drag.ly=e.clientY
  })
  canvas.addEventListener("wheel", e=>{
    orbT.r=Math.max(18,Math.min(220,orbT.r+e.deltaY*0.06))
  },{passive:true})
  canvas.addEventListener("contextmenu", e=>e.preventDefault())

  let lt2=null
  canvas.addEventListener("touchstart", e=>{ lt2={x:e.touches[0].clientX,y:e.touches[0].clientY} })
  canvas.addEventListener("touchmove",  e=>{
    if(!lt2) return; e.preventDefault()
    const dx=(e.touches[0].clientX-lt2.x)*0.007, dy=(e.touches[0].clientY-lt2.y)*0.006
    orbT.theta-=dx; orbT.phi=Math.max(0.05,Math.min(1.45,orbT.phi+dy))
    lt2={x:e.touches[0].clientX,y:e.touches[0].clientY}
  },{passive:false})

  /* ── Camera preset views ── */
  function setView(v){
    if(v==="front")     { orbT={theta:0.05,  phi:0.44, r:88} }
    else if(v==="reservoir"){ orbT={theta:Math.PI, phi:0.38, r:96} }
    else if(v==="top")  { orbT={theta:0.05,  phi:0.06, r:105} }
  }

  /* ════════════════════════════════════════════════
     ANIMATION LOOP
  ════════════════════════════════════════════════ */
  let running = true
  let lastT   = 0, fps = 0
  const fpsEl = document.getElementById("fps-counter")
  const speedEl = document.getElementById("speedSlider")

  function animate(now) {
    if(!running) return
    requestAnimationFrame(animate)

    const t  = now*0.001
    const dt = Math.min(t-lastT, 0.05); lastT=t
    fps = Math.round(fps*0.92 + (1/(dt||0.016))*0.08)
    if(fpsEl) fpsEl.textContent = "FPS: "+fps

    const speed = parseFloat(speedEl?.value||"1")
    const gOpen = gateOpenAmount

    /* Smooth orbit */
    orb.theta += (orbT.theta-orb.theta)*0.07
    orb.phi   += (orbT.phi  -orb.phi  )*0.07
    orb.r     += (orbT.r    -orb.r    )*0.07
    applyCamera()

    /* Interpolate gate open */
    gateOpenAmount += (gateOpenTarget - gateOpenAmount) * 0.05

    /* Animate water textures */
    resTex.offset.x += 0.0015*speed
    resTex.offset.y += 0.0010*speed
    dnTex.offset.y  += 0.0030*speed

    /* Reservoir gentle bob */
    reservoir.position.y = waterLevel*DAM_H + Math.sin(t*0.38)*0.12
    downRiver.position.y = 0.62 + Math.sin(t*0.5)*0.05

    /* Overflow when near crest */
    const ovf = Math.max(0,(waterLevel-0.92)/0.08)
    ovfMat.opacity = ovf*0.82
    cascadeMats.forEach((cm,i)=>{ cm.opacity=ovf*Math.max(0,0.72-i*0.07) })

    /* Gate doors */
    gateDoors.forEach((door,idx)=>{
      const closedY = GATE_Y_BASE+GATE_H/2
      const openY   = GATE_Y_BASE+GATE_H*1.75
      const cy = closedY+(openY-closedY)*gOpen
      door.position.y=cy
      door.position.z=ffz(cy)+0.22
      door.visible   =gOpen<0.97
      gateBarGroups[idx].forEach((bar,b)=>{
        const by=(cy-GATE_H/2)+0.75+b*((GATE_H-0.75)/4)
        bar.position.y=by; bar.position.z=ffz(by)+0.28
        bar.visible=gOpen<0.97 && by<DAM_H+1
      })
    })

    /* Flow effects */
    allFlow.forEach(({group})=>{
      const show=gOpen>0.02
      const fspd=speed*gOpen, vol=gOpen
      group.forEach(s=>{
        const {mesh,type,mat:m}=s
        if(!show){ mesh.visible=false; m.opacity=0; return }
        mesh.visible=true
        if(type==="through"){
          m.opacity=0.76*vol
          mesh.scale.y=Math.max(0.1,vol)
          mesh.position.y=GATE_Y_BASE+GATE_H*0.3*vol
          if(m.map) m.map.offset.y=(t*fspd*1.2)%1
        } else if(type==="fall"){
          const si=s.segIdx
          mesh.position.y=GATE_Y_BASE-si*Math.max(GATE_H*vol/10,0.42)
          mesh.position.z=ffz(Math.max(0,mesh.position.y))+1.05
          m.opacity=Math.max(0,0.8-si*0.045)*vol
          if(m.map) m.map.offset.y=(t*fspd*2.8)%1
          const ph=((t*fspd*0.35-si*0.18)%1+1)%1
          mesh.scale.set(vol*(1+ph*0.09),1,vol*(1+ph*0.07))
        } else if(type==="splash"){
          const pulse=1+Math.sin(t*fspd*4)*0.22
          mesh.scale.set(pulse*vol,1,pulse*vol)
          m.opacity=0.64*vol
          mesh.position.z=DAM_BASE_T/2+4.5+Math.sin(t*fspd)*0.5
        } else if(type==="mist"){
          const {bx,sp,ph,amp}=mesh.userData
          const mt=t*sp*Math.max(fspd,0.1)+ph
          mesh.position.set(
            bx+Math.sin(mt*1.3)*amp,
            1.4+Math.abs(Math.sin(mt*0.85))*3.5,
            DAM_BASE_T/2+2.5+Math.cos(mt*0.9)*amp,
          )
          m.opacity=vol*0.4*(0.5+0.5*Math.sin(mt))
        }
      })
    })

    renderer.render(scene,camera)
  }
  requestAnimationFrame(animate)

  /* ── Dispose ── */
  function dispose(){
    running=false
    renderer.dispose()
    scene.traverse(obj=>{
      if(obj.geometry) obj.geometry.dispose()
      if(obj.material){
        if(Array.isArray(obj.material)) obj.material.forEach(m=>m.dispose())
        else obj.material.dispose()
      }
    })
  }

  return { setWaterLevel, setGateOpen, setView, dispose }
}