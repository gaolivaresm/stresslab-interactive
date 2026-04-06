import React, { useState, useMemo } from 'react';

const Index = () => {
  // Estados para los parámetros de carga y geometría
  const [P, setP] = useState(10);
  const [alpha, setAlpha] = useState(45);
  const [Ac, setAc] = useState(5);

  // Constantes de diseño
  const H = 350; // altura en px
  const MARGIN = 80;
  const A_PERNO = 5; // cm²

  // Cálculos estáticos y de tensiones
  const metrics = useMemo(() => {
    const aRad = alpha * (Math.PI / 180);
    const Nc = P / Math.cos(aRad);
    const Np = P * Math.tan(aRad);
    const sigma_mpa = (Nc / Ac) * 10;
    const tau_mpa = (P / A_PERNO) * 10;

    const failCable = sigma_mpa > 250;
    const failPin = tau_mpa > 120;
    const collapse = failCable || failPin;

    // Coordenadas dinámicas para el SVG
    const anchorDx = H / Math.tan(aRad);
    const POST_X = MARGIN + anchorDx + 60;
    const POST_TOP_Y = MARGIN;
    const BASE_Y = MARGIN + H;
    const ANC_X = POST_X - anchorDx;
    const ANC_Y = BASE_Y;

    return { 
      Nc, Np, sigma_mpa, tau_mpa, failCable, failPin, collapse,
      POST_X, POST_TOP_Y, BASE_Y, ANC_X, ANC_Y, aRad
    };
  }, [P, alpha, Ac]);

  return (
    <div className="flex min-h-screen bg-white text-slate-900 font-serif">
      {/* Panel Lateral de Controles */}
      <aside className="w-80 border-r border-slate-900 p-6 flex flex-col gap-6 bg-slate-50">
        <h1 className="text-2xl text-center border-bottom border-slate-900 pb-2 tracking-tight font-bold">
          StressLab v1.3
        </h1>

        <div className="space-y-4">
          <section className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest">Parámetros de Carga</h2>
            <label className="text-sm flex justify-between">Fuerza P (kN): <span>{P}</span></label>
            <input 
              type="range" min="1" max="80" step="0.5" value={P} 
              onChange={(e) => setP(parseFloat(e.target.value))}
              className="w-full accent-slate-900"
            />
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest">Geometría</h2>
            <label className="text-sm flex justify-between">Ángulo α (°): <span>{alpha}</span></label>
            <input 
              type="range" min="30" max="75" step="1" value={alpha} 
              onChange={(e) => setAlpha(parseFloat(e.target.value))}
              className="w-full accent-slate-900"
            />
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-widest">Sección del Cable</h2>
            <label className="text-sm flex justify-between">Área A<sub>cable</sub> (cm²): <span>{Ac}</span></label>
            <input 
              type="range" min="1" max="30" step="0.5" value={Ac} 
              onChange={(e) => setAc(parseFloat(e.target.value))}
              className="w-full accent-slate-900"
            />
          </section>
        </div>

        {/* Glosario Pedagógico */}
        <div className="mt-auto border border-slate-900 p-3 text-xs leading-relaxed bg-white">
          <h3 className="font-bold border-b border-slate-300 mb-2 pb-1 uppercase">Glosario Pedagógico</h3>
          <dl className="space-y-1">
            <dt className="text-red-600 font-bold">● Acción (Rojo)</dt>
            <dd>Fuerza externa aplicada al sistema (viento P).</dd>
            <dt className="text-green-700 font-bold">● Reacción (Verde)</dt>
            <dd>Fuerzas que los apoyos ejercen para el equilibrio.</dd>
            <dt className="text-blue-700 font-bold">● Esfuerzo Interno (Azul)</dt>
            <dd>Fuerza interna: tracción en cable, compresión en poste.</dd>
          </dl>
        </div>
      </aside>

      {/* Área Principal de Visualización */}
      <main className="flex-1 flex flex-col items-center justify-center p-8 relative">
        {metrics.collapse && (
          <div className="absolute top-10 bg-red-600 text-white px-8 py-3 text-xl font-bold border-2 border-red-800 animate-pulse z-10">
            ⚠ COLAPSO ESTRUCTURAL ⚠
          </div>
        )}

        <svg 
          width="600" height="520" 
          viewBox={`0 0 600 520`}
          className="border border-slate-200 shadow-sm bg-white"
        >
          {/* Apoyos (Simplificados para React) */}
          <g transform={`translate(${metrics.POST_X}, ${metrics.BASE_Y})`}>
            <circle r="5" fill="white" stroke="black" />
            <path d="M0,5 L-15,20 L15,20 Z" fill="none" stroke="black" />
            <line x1="-20" y1="20" x2="20" y2="20" stroke="black" strokeWidth="1.5" />
          </g>
          <g transform={`translate(${metrics.ANC_X}, ${metrics.ANC_Y})`}>
            <circle r="5" fill="white" stroke="black" />
            <path d="M0,5 L-15,20 L15,20 Z" fill="none" stroke="black" />
            <line x1="-20" y1="20" x2="20" y2="20" stroke="black" strokeWidth="1.5" />
          </g>

          {/* Poste */}
          <line 
            x1={metrics.POST_X} y1={metrics.BASE_Y} 
            x2={metrics.POST_X} y2={metrics.POST_TOP_Y} 
            stroke="#111" strokeWidth="3" 
          />

          {/* Cable */}
          <line 
            x1={metrics.POST_X} y1={metrics.POST_TOP_Y} 
            x2={metrics.ANC_X} y2={metrics.ANC_Y} 
            stroke={metrics.failCable ? "#dc2626" : "#1d4ed8"} 
            strokeWidth="2" strokeDasharray="6,3" 
          />

          {/* Etiquetas de Esfuerzos */}
          <text 
            x={(metrics.POST_X + metrics.ANC_X) / 2 - 20} 
            y={(metrics.POST_TOP_Y + metrics.ANC_Y) / 2 - 10} 
            fill={metrics.failCable ? "#dc2626" : "#1d4ed8"} className="text-xs italic"
          >
            Nc={metrics.Nc.toFixed(1)} kN
          </text>
          <text x={metrics.POST_X + 10} y={(metrics.BASE_Y + metrics.POST_TOP_Y) / 2} fill="#1d4ed8" className="text-xs">
            Np={metrics.Np.toFixed(1)} kN
          </text>

          {/* Vectores de Reacción (Verde) */}
          <path d={`M${metrics.ANC_X},${metrics.ANC_Y} L${metrics.ANC_X + 40},${metrics.ANC_Y} M${metrics.ANC_X+35},${metrics.ANC_Y-5} L${metrics.ANC_X+40},${metrics.ANC_Y} L${metrics.ANC_X+35},${metrics.ANC_Y+5}`} stroke="#15803d" strokeWidth="2" fill="none" />
          <text x={metrics.ANC_X + 45} y={metrics.ANC_Y + 5} fill="#15803d" className="text-[10px] font-bold">Rx={P.toFixed(1)} kN</text>
        </svg>

        {/* Monitor de Tensiones */}
        <div className="w-[450px] border border-slate-900 mt-6 p-4 font-mono text-sm bg-slate-50 shadow-inner">
          <div className="font-bold border-b border-slate-300 mb-2 pb-1 text-center">─── Monitor de Tensiones ───</div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span>σ<sub>cable</sub> = Nc/A:</span>
              <span className={metrics.failCable ? "text-red-600 font-bold" : ""}>
                {metrics.sigma_mpa.toFixed(1)} MPa {metrics.failCable && "▸ FALLA"}
              </span>
            </div>
            <div className="flex justify-between">
              <span>τ<sub>perno</sub> = Rx/Ap:</span>
              <span className={metrics.failPin ? "text-red-600 font-bold" : ""}>
                {metrics.tau_mpa.toFixed(1)} MPa {metrics.failPin && "▸ FALLA"}
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
