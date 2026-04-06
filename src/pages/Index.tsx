import React, { useState, useMemo } from 'react';

const Index = () => {
  // Parámetros de entrada
  const [P, setP] = useState(10);
  const [alpha, setAlpha] = useState(45);
  const [Ac, setAc] = useState(5);

  // Constantes de diseño y geometría
  const H = 350; 
  const MARGIN = 80;
  const A_PERNO = 5; // cm²

  const metrics = useMemo(() => {
    const aRad = alpha * (Math.PI / 180);
    const Nc = P / Math.cos(aRad);
    const Np = P * Math.tan(aRad);
    const sigma_mpa = (Nc / Ac) * 10;
    const tau_mpa = (P / A_PERNO) * 10;

    const failCable = sigma_mpa > 250;
    const failPin = tau_mpa > 120;
    const collapse = failCable || failPin;

    // Posicionamiento dinámico
    const anchorDx = H / Math.tan(aRad);
    const POST_X = MARGIN + anchorDx + 60;
    const POST_TOP_Y = MARGIN;
    const BASE_Y = MARGIN + H;
    const ANC_X = POST_X - anchorDx;
    const ANC_Y = BASE_Y;

    // Escalamiento de vectores
    const pLen = Math.min(80, Math.max(30, P * 1.2));
    const ryLen = Math.min(60, Math.max(15, Np * 0.6));
    const rxLen = Math.min(60, Math.max(15, P * 1.0));

    return { 
      Nc, Np, sigma_mpa, tau_mpa, failCable, failPin, collapse,
      POST_X, POST_TOP_Y, BASE_Y, ANC_X, ANC_Y, aRad,
      pLen, ryLen, rxLen
    };
  }, [P, alpha, Ac]);

  // Componente interno para Flechas (estilo TikZ)
  const Arrow = ({ x1, y1, x2, y2, color, width = 2 }: any) => {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return null;
    const ux = dx / len;
    const uy = dy / len;
    const sz = 10;
    const px = x2 - ux * sz;
    const py = y2 - uy * sz;
    const lx = -uy * sz * 0.4;
    const ly = ux * sz * 0.4;

    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} />
        <polygon points={`${x2},${y2} ${px + lx},${py + ly} ${px - lx},${py - ly}`} fill={color} />
      </g>
    );
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900 font-serif">
      {/* Panel Lateral */}
      <aside className="w-80 border-r border-slate-900 p-6 flex flex-col gap-6 bg-slate-50 shadow-inner">
        <h1 className="text-2xl text-center border-b border-slate-900 pb-2 font-bold tracking-tight">StressLab v1.3</h1>
        
        <div className="space-y-6">
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase">Parámetros de Carga</h2>
            <label className="text-sm flex justify-between">Fuerza P (kN): <span>{P}</span></label>
            <input type="range" min="1" max="80" step="0.5" value={P} onChange={(e) => setP(parseFloat(e.target.value))} className="w-full accent-slate-900" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase">Geometría</h2>
            <label className="text-sm flex justify-between">Ángulo α (°): <span>{alpha}</span></label>
            <input type="range" min="30" max="75" step="1" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} className="w-full accent-slate-900" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase">Sección del Cable</h2>
            <label className="text-sm flex justify-between">Área A<sub>cable</sub> (cm²): <span>{Ac}</span></label>
            <input type="range" min="1" max="30" step="0.5" value={Ac} onChange={(e) => setAc(parseFloat(e.target.value))} className="w-full accent-slate-900" />
          </div>
        </div>

        <div className="mt-auto border border-slate-900 p-4 text-[11px] leading-snug bg-white shadow-sm">
          <h3 className="font-bold border-b border-slate-200 mb-2 pb-1 uppercase tracking-tighter">Glosario Pedagógico</h3>
          <dl className="space-y-1">
            <dt className="text-red-600 font-bold">● Acción (Rojo)</dt>
            <dd>Fuerza externa aplicada (Viento P).</dd>
            <dt className="text-green-700 font-bold">● Reacción (Verde)</dt>
            <dd>Fuerzas de los apoyos para el equilibrio.</dd>
            <dt className="text-blue-700 font-bold">● Esfuerzo Interno (Azul)</dt>
            <dd>Fuerza que viaja dentro del elemento estructural.</dd>
          </dl>
        </div>
      </aside>

      <main className="flex-1 flex flex-col items-center justify-center p-10 relative">
        {metrics.collapse && (
          <div className="absolute top-10 bg-red-600 text-white px-10 py-4 text-xl font-bold border-2 border-red-900 animate-pulse z-50">
            ⚠ COLAPSO ESTRUCTURAL ⚠
          </div>
        )}

        {/* SVG de Análisis */}
        <svg width="600" height="520" viewBox="0 0 600 520" className="border border-slate-200 shadow-lg bg-white">
          {/* Apoyos Articulados */}
          {[
            { x: metrics.POST_X, y: metrics.BASE_Y, w: 50 },
            { x: metrics.ANC_X, y: metrics.ANC_Y, w: 40 }
          ].map((s, i) => (
            <g key={i} transform={`translate(${s.x}, ${s.y})`}>
              <circle r="5" fill="white" stroke="black" strokeWidth="1.5" />
              <path d="M0,5 L-15,20 L15,20 Z" fill="none" stroke="black" strokeWidth="1.5" />
              <line x1={-s.w/2} y1="20" x2={s.w/2} y2="20" stroke="black" strokeWidth="1.5" />
            </g>
          ))}

          {/* Poste y Cable */}
          <line x1={metrics.POST_X} y1={metrics.BASE_Y} x2={metrics.POST_X} y2={metrics.POST_TOP_Y} stroke="#111" strokeWidth="3" />
          <line 
            x1={metrics.POST_X} y1={metrics.POST_TOP_Y} x2={metrics.ANC_X} y2={metrics.ANC_Y} 
            stroke={metrics.failCable ? "#c00" : "#0057b7"} strokeWidth="2" strokeDasharray="6,3" 
          />

          {/* Arco de Ángulo Alpha */}
          <path 
            d={`M${metrics.ANC_X + 40},${metrics.ANC_Y} A40,40 0 0,0 ${metrics.ANC_X + 40 * Math.cos(Math.atan2(metrics.ANC_Y - metrics.POST_TOP_Y, metrics.POST_X - metrics.ANC_X))},${metrics.ANC_Y - 40 * Math.sin(Math.atan2(metrics.ANC_Y - metrics.POST_TOP_Y, metrics.POST_X - metrics.ANC_X))}`} 
            fill="none" stroke="#666" strokeWidth="1" 
          />
          <text x={metrics.ANC_X + 50} y={metrics.ANC_Y - 15} className="text-[12px] fill-slate-500 italic">α={alpha}°</text>

          {/* Vectores: ACCIÓN P */}
          <Arrow x1={metrics.POST_X - metrics.pLen - 10} y1={metrics.POST_TOP_Y} x2={metrics.POST_X - 6} y2={metrics.POST_TOP_Y} color="#c00" width={2.5} />
          <text x={metrics.POST_X - metrics.pLen/2 - 10} y={metrics.POST_TOP_Y - 10} className="fill-red-700 text-sm font-bold text-center">P={P} kN</text>

          {/* Vectores: REACCIONES */}
          <Arrow x1={metrics.POST_X} y1={metrics.BASE_Y + 5} x2={metrics.POST_X} y2={metrics.BASE_Y + 5 + metrics.ryLen} color="#080" />
          <text x={metrics.POST_X + 8} y={metrics.BASE_Y + metrics.ryLen + 20} className="fill-green-700 text-[11px]">Ry={metrics.Np.toFixed(1)} kN</text>

          <Arrow x1={metrics.ANC_X} y1={metrics.ANC_Y} x2={metrics.ANC_X - metrics.rxLen} y2={metrics.ANC_Y} color="#080" />
          <text x={metrics.ANC_X - metrics.rxLen - 4} y={metrics.ANC_Y + 4} textAnchor="end" className="fill-green-700 text-[11px]">Rx={P.toFixed(1)} kN ←</text>

          <Arrow x1={metrics.ANC_X} y1={metrics.ANC_Y} x2={metrics.ANC_X} y2={metrics.ANC_Y + metrics.ryLen} color="#080" />
          <text x={metrics.ANC_X - 4} y={metrics.ANC_Y + metrics.ryLen + 14} textAnchor="end" className="fill-green-700 text-[11px]">Ry={metrics.Np.toFixed(1)} kN</text>

          {/* Etiquetas de Esfuerzos */}
          <text x={(metrics.POST_X + metrics.ANC_X)/2 - 14} y={(metrics.POST_TOP_Y + metrics.ANC_Y)/2 - 10} className={`text-xs italic ${metrics.failCable ? 'fill-red-600' : 'fill-blue-700'}`}>Nc={metrics.Nc.toFixed(1)} kN</text>
          <text x={metrics.POST_X + 16} y={(metrics.BASE_Y + metrics.POST_TOP_Y)/2} className="fill-blue-800 text-xs">Np={metrics.Np.toFixed(1)} kN</text>
          <text x={metrics.POST_X - 14} y={(metrics.BASE_Y + metrics.POST_TOP_Y)/2} textAnchor="end" className="fill-slate-400 text-xs italic">H</text>
        </svg>

        {/* Monitor con Memoria de Cálculo */}
        <div className="w-[480px] border border-slate-900 mt-6 p-4 font-mono text-[13px] bg-[#f8f8f0] shadow-inner leading-relaxed">
          <div className="font-bold border-b border-slate-400 mb-2 pb-1 text-center">─── Monitor de Tensiones ───</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span>σ<sub>cable</sub> = N<sub>c</sub>/A = {metrics.Nc.toFixed(2)}/{Ac} =</span>
              <span className={metrics.failCable ? "text-red-600 font-bold" : "text-slate-900"}>
                {metrics.sigma_mpa.toFixed(1)} MPa {metrics.failCable ? "▸ FALLA (>250)" : "✓"}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>τ<sub>perno</sub> = R<sub>x</sub>/A<sub>p</sub> = {P.toFixed(2)}/{A_PERNO} =</span>
              <span className={metrics.failPin ? "text-red-600 font-bold" : "text-slate-900"}>
                {metrics.tau_mpa.toFixed(1)} MPa {metrics.failPin ? "▸ FALLA (>120)" : "✓"}
              </span>
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-dashed border-slate-300 text-[11px] text-slate-500 flex justify-around">
            <span>Nc={metrics.Nc.toFixed(2)} kN</span> | <span>Np={metrics.Np.toFixed(2)} kN</span> | <span>α={alpha}°</span>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
