import React, { useState, useMemo } from 'react';

const Index = () => {
  // Parámetros del simulador
  const [P, setP] = useState(10);
  const [alpha, setAlpha] = useState(45);
  const [Ac, setAc] = useState(5);

  // Estado del Cuestionario
  const [integrantes, setIntegrantes] = useState("");
  const [respuestas, setRespuestas] = useState<{ [key: number]: string }>({});

  // Constantes y Cálculos Estructuras I
  const H = 350; 
  const MARGIN = 80;
  const A_PERNO = 5; 

  const metrics = useMemo(() => {
    const aRad = alpha * (Math.PI / 180);
    const Nc = P / Math.cos(aRad);
    const Np = P * Math.tan(aRad);
    const sigma_mpa = (Nc / Ac) * 10;
    const tau_mpa = (P / A_PERNO) * 10;

    const failCable = sigma_mpa > 250;
    const failPin = tau_mpa > 120;
    const collapse = failCable || failPin;

    const anchorDx = H / Math.tan(aRad);
    const POST_X = MARGIN + anchorDx + 60;
    const POST_TOP_Y = MARGIN;
    const BASE_Y = MARGIN + H;
    const ANC_X = POST_X - anchorDx;
    const ANC_Y = BASE_Y;

    return { 
      Nc, Np, sigma_mpa, tau_mpa, failCable, failPin, collapse,
      POST_X, POST_TOP_Y, BASE_Y, ANC_X, ANC_Y, aRad,
      pLen: Math.min(80, Math.max(30, P * 1.2)),
      ryLen: Math.min(60, Math.max(15, Np * 0.6)),
      rxLen: Math.min(60, Math.max(15, P * 1.0))
    };
  }, [P, alpha, Ac]);

  // Preguntas sugeridas para el laboratorio
  const preguntas = [
    {
      id: 1,
      texto: "¿Para qué ángulo α la reacción Ry en el poste es exactamente igual a la carga P?",
      opciones: ["30°", "45°", "60°", "75°"]
    },
    {
      id: 2,
      texto: "Si aumentamos el Área del Cable (Ac), ¿qué sucede con la fuerza interna Nc?",
      opciones: ["Aumenta proporcionalmente", "Disminuye", "Se mantiene constante", "Se vuelve nula"]
    },
    {
      id: 3,
      texto: "¿Qué componente en el anclaje resiste el empuje horizontal del viento?",
      opciones: ["Reacción Ry", "Reacción Rx (Corte)", "La compresión Np", "Ninguna de las anteriores"]
    }
  ];

  // Función para descargar el JSON para Moodle
  const descargarEntrega = () => {
    const data = {
      proyecto: "StressLab v1.3 - Entrega Moodle",
      fecha: new Date().toLocaleString(),
      integrantes: integrantes,
      configuracion_final: { P, alpha, Ac },
      respuestas_cuestionario: respuestas
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `entrega_estructuras_${new Date().getTime()}.json`;
    link.click();
  };

  const Arrow = ({ x1, y1, x2, y2, color, width = 2 }: any) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return null;
    const ux = dx / len, uy = dy / len, sz = 10;
    const px = x2 - ux * sz, py = y2 - uy * sz, lx = -uy * sz * 0.4, ly = ux * sz * 0.4;
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} />
        <polygon points={`${x2},${y2} ${px + lx},${py + ly} ${px - lx},${py - ly}`} fill={color} />
      </g>
    );
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900 font-serif overflow-hidden">
      {/* Panel Izquierdo: Controles */}
      <aside className="w-72 border-r border-slate-900 p-5 flex flex-col gap-6 bg-slate-50 overflow-y-auto">
        <h1 className="text-xl text-center border-b border-slate-900 pb-2 font-bold tracking-tight">StressLab v1.3</h1>
        
        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-tighter">1. Carga de Viento</h2>
            <label className="text-sm flex justify-between font-mono">P: <span>{P} kN</span></label>
            <input type="range" min="1" max="80" step="0.5" value={P} onChange={(e) => setP(parseFloat(e.target.value))} className="w-full accent-slate-900" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-tighter">2. Geometría (α)</h2>
            <label className="text-sm flex justify-between font-mono">Ángulo: <span>{alpha}°</span></label>
            <input type="range" min="30" max="75" step="1" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} className="w-full accent-slate-900" />
          </div>

          <div className="flex flex-col gap-2">
            <h2 className="text-xs font-bold uppercase tracking-tighter">3. Material Cable</h2>
            <label className="text-sm flex justify-between font-mono">Ac: <span>{Ac} cm²</span></label>
            <input type="range" min="1" max="30" step="0.5" value={Ac} onChange={(e) => setAc(parseFloat(e.target.value))} className="w-full accent-slate-900" />
          </div>
        </div>

        {/* Sección de Entrega Moodle */}
        <div className="mt-4 border-t-2 border-slate-900 pt-4 space-y-4">
          <h2 className="text-sm font-bold uppercase text-center bg-slate-900 text-white py-1">Entrega Moodle</h2>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold uppercase">Nombres de Integrantes:</label>
            <textarea 
              className="text-xs p-2 border border-slate-400 font-sans h-16" 
              placeholder="Ej: Juan Pérez, María Soto..."
              value={integrantes}
              onChange={(e) => setIntegrantes(e.target.value)}
            />
          </div>
          <button 
            onClick={descargarEntrega}
            disabled={!integrantes || Object.keys(respuestas).length < preguntas.length}
            className="w-full bg-slate-900 text-white py-2 text-xs font-bold uppercase hover:bg-slate-700 disabled:bg-slate-300 transition-colors"
          >
            Descargar Reporte JSON
          </button>
        </div>
      </aside>

      {/* Área Central: Simulador */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 relative overflow-y-auto">
        {metrics.collapse && (
          <div className="absolute top-4 bg-red-600 text-white px-8 py-2 text-lg font-bold border-2 border-red-900 animate-pulse z-50">
            ⚠ COLAPSO ESTRUCTURAL ⚠
          </div>
        )}

        <svg width="550" height="400" viewBox="0 0 600 520" className="border border-slate-200 shadow-md bg-white shrink-0">
          {[metrics.POST_X, metrics.ANC_X].map((x, i) => (
            <g key={i} transform={`translate(${x}, ${metrics.BASE_Y})`}>
              <circle r="5" fill="white" stroke="black" strokeWidth="1.5" />
              <path d="M0,5 L-15,20 L15,20 Z" fill="none" stroke="black" strokeWidth="1.5" />
              <line x1="-25" y1="20" x2="25" y2="20" stroke="black" strokeWidth="1.5" />
            </g>
          ))}
          <line x1={metrics.POST_X} y1={metrics.BASE_Y} x2={metrics.POST_X} y2={metrics.POST_TOP_Y} stroke="#111" strokeWidth="3" />
          <line x1={metrics.POST_X} y1={metrics.POST_TOP_Y} x2={metrics.ANC_X} y2={metrics.ANC_Y} stroke={metrics.failCable ? "#c00" : "#0057b7"} strokeWidth={2} strokeDasharray="6,3" />
          <Arrow x1={metrics.POST_X - metrics.pLen - 10} y1={metrics.POST_TOP_Y} x2={metrics.POST_X - 6} y2={metrics.POST_TOP_Y} color="#c00" width={2.5} />
          <text x={metrics.POST_X - metrics.pLen/2 - 10} y={metrics.POST_TOP_Y - 10} className="fill-red-700 text-xs font-bold" textAnchor="middle">P={P} kN</text>
          
          {/* Reacción Poste hacia ARRIBA */}
          <Arrow x1={metrics.POST_X} y1={metrics.BASE_Y + 5 + metrics.ryLen} x2={metrics.POST_X} y2={metrics.BASE_Y + 6} color="#080" />
          
          <Arrow x1={metrics.ANC_X} y1={metrics.ANC_Y} x2={metrics.ANC_X - metrics.rxLen} y2={metrics.ANC_Y} color="#080" />
          <Arrow x1={metrics.ANC_X} y1={metrics.ANC_Y} x2={metrics.ANC_X} y2={metrics.ANC_Y + metrics.ryLen} color="#080" />
          
          <text x={metrics.POST_X + 16} y={(metrics.BASE_Y + metrics.POST_TOP_Y)/2} className="fill-blue-800 text-xs font-bold">Np={metrics.Np.toFixed(1)} kN</text>
        </svg>

        {/* Monitor de Tensiones */}
        <div className="w-[550px] border border-slate-900 mt-4 p-3 font-mono text-[12px] bg-[#f8f8f0] shadow-sm shrink-0">
          <div className="font-bold border-b border-slate-400 mb-2 pb-1 text-center italic">─── Monitor de Tensiones ───</div>
          <div className="flex justify-around">
            <span className={metrics.failCable ? "text-red-600 font-bold" : ""}>σ: {metrics.sigma_mpa.toFixed(1)} MPa</span>
            <span className={metrics.failPin ? "text-red-600 font-bold" : ""}>τ: {metrics.tau_mpa.toFixed(1)} MPa</span>
            <span className="text-slate-500 italic">α: {alpha}°</span>
          </div>
        </div>

        {/* Módulo de Preguntas (Alternativas) */}
        <div className="w-[550px] mt-6 space-y-4 pb-10">
          <h3 className="text-sm font-bold uppercase border-b-2 border-slate-900 pb-1 italic">Cuestionario de Laboratorio</h3>
          {preguntas.map((q) => (
            <div key={q.id} className="bg-slate-50 p-3 border border-slate-200">
              <p className="text-xs font-bold mb-2">{q.id}. {q.texto}</p>
              <div className="grid grid-cols-2 gap-2">
                {q.opciones.map((opt) => (
                  <label key={opt} className="flex items-center gap-2 text-[11px] cursor-pointer hover:bg-slate-200 p-1 rounded">
                    <input 
                      type="radio" 
                      name={`pregunta-${q.id}`} 
                      value={opt}
                      checked={respuestas[q.id] === opt}
                      onChange={() => setRespuestas({ ...respuestas, [q.id]: opt })}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
