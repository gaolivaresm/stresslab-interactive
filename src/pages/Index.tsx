import React, { useState, useMemo } from 'react';

const Index = () => {
  // 1. ESTADO DE PARÁMETROS
  const [P, setP] = useState(10);
  const [alpha, setAlpha] = useState(45);
  const [Ac, setAc] = useState(5);

  // 2. ESTADO DE INTEGRANTES Y CUESTIONARIO
  const [estudiantes, setEstudiantes] = useState([{ nombre: "", apellido: "", rut: "" }]);
  const [respuestas, setRespuestas] = useState<{ [key: number]: string }>({});

  // 3. CONSTANTES Y MOTOR DE CÁLCULO
  const H = 350; 
  const MARGIN = 100;
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
    const POST_X = MARGIN + anchorDx + 80;
    const POST_TOP_Y = MARGIN;
    const BASE_Y = MARGIN + H;
    const ANC_X = POST_X - anchorDx;
    const ANC_Y = BASE_Y;

    // Escalamiento de flechas para máxima visibilidad
    const pLen = Math.min(120, Math.max(50, P * 2.0));
    const ryLen = Math.min(100, Math.max(30, Np * 1.0));
    const rxLen = Math.min(100, Math.max(30, P * 1.5));

    return { 
      Nc, Np, sigma_mpa, tau_mpa, failCable, failPin, collapse,
      POST_X, POST_TOP_Y, BASE_Y, ANC_X, ANC_Y, aRad,
      pLen, ryLen, rxLen
    };
  }, [P, alpha, Ac]);

  // Componente para dibujar flechas técnicas
  const Arrow = ({ x1, y1, x2, y2, color, width = 3 }: any) => {
    const dx = x2 - x1, dy = y2 - y1, len = Math.sqrt(dx * dx + dy * dy);
    if (len < 2) return null;
    const ux = dx / len, uy = dy / len, sz = 14; 
    const px = x2 - ux * sz, py = y2 - uy * sz, lx = -uy * sz * 0.4, ly = ux * sz * 0.4;
    return (
      <g>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width} strokeLinecap="round" />
        <polygon points={`${x2},${y2} ${px + lx},${py + ly} ${px - lx},${py - ly}`} fill={color} />
      </g>
    );
  };

  const descargarEntrega = () => {
    const data = {
      proyecto: "StressLab v1.3 - Entrega Estructuras I (PUCV)",
      integrantes: estudiantes,
      analisis: { P, alpha, Ac, Nc: metrics.Nc, Np: metrics.Np, sigma: metrics.sigma_mpa, tau: metrics.tau_mpa },
      respuestas: respuestas
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `ENTREGA_EST_I_${new Date().getTime()}.json`;
    link.click();
  };

  return (
    <div className="flex h-screen bg-slate-100 text-slate-900 font-serif overflow-hidden">
      
      {/* PANEL DE CONTROL (IZQUIERDA) */}
      <aside className="w-80 border-r-2 border-slate-900 p-5 flex flex-col gap-6 bg-white overflow-y-auto shadow-2xl z-20">
        <h1 className="text-2xl text-center border-b-4 border-slate-900 pb-2 font-black uppercase tracking-tighter">StressLab v1.3</h1>
        
        <div className="space-y-6">
          <section className="space-y-3">
            <h2 className="text-xs font-bold uppercase bg-slate-900 text-white p-1 text-center">Configuración del Sistema</h2>
            <div className="space-y-4 pt-2">
              <div>
                <label className="text-sm flex justify-between font-bold">Viento P: <span className="text-red-600">{P} kN</span></label>
                <input type="range" min="1" max="80" step="0.5" value={P} onChange={(e) => setP(parseFloat(e.target.value))} className="w-full accent-red-600" />
              </div>
              <div>
                <label className="text-sm flex justify-between font-bold">Ángulo α: <span>{alpha}°</span></label>
                <input type="range" min="30" max="75" step="1" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} className="w-full accent-slate-700" />
              </div>
              <div>
                <label className="text-sm flex justify-between font-bold">Área Cable: <span className="text-blue-700">{Ac} cm²</span></label>
                <input type="range" min="1" max="30" step="0.5" value={Ac} onChange={(e) => setAc(parseFloat(e.target.value))} className="w-full accent-blue-700" />
              </div>
            </div>
          </section>

          <section className="space-y-3 border-t-2 border-slate-200 pt-4">
            <h2 className="text-xs font-bold uppercase text-slate-500">Datos del Grupo</h2>
            {estudiantes.map((est, idx) => (
              <div key={idx} className="space-y-1 p-2 border-2 border-slate-200 bg-slate-50 rounded shadow-sm">
                <input placeholder="Nombre" className="text-xs w-full p-1 border" value={est.nombre} onChange={(e) => {
                  const n = [...estudiantes]; n[idx].nombre = e.target.value; setEstudiantes(n);
                }} />
                <input placeholder="Apellido" className="text-xs w-full p-1 border" value={est.apellido} onChange={(e) => {
                  const n = [...estudiantes]; n[idx].apellido = e.target.value; setEstudiantes(n);
                }} />
                <input placeholder="RUT" className="text-xs w-full p-1 border" value={est.rut} onChange={(e) => {
                  const n = [...estudiantes]; n[idx].rut = e.target.value; setEstudiantes(n);
                }} />
              </div>
            ))}
            <button onClick={() => setEstudiantes([...estudiantes, { nombre: "", apellido: "", rut: "" }])} className="w-full text-[10px] font-bold border-2 border-dashed border-slate-400 py-1 hover:bg-slate-200 uppercase">+ Integrante</button>
          </section>

          <button 
            onClick={descargarEntrega}
            disabled={estudiantes.some(e => !e.nombre || !e.rut) || Object.keys(respuestas).length < 3}
            className="w-full bg-slate-900 text-white py-3 text-xs font-bold uppercase hover:bg-green-700 disabled:bg-slate-300 transition-all shadow-lg"
          >
            Descargar JSON Moodle
          </button>
        </div>
      </aside>

      {/* ÁREA DEL DIAGRAMA Y MONITOR (CENTRO) */}
      <main className="flex-1 flex flex-col items-center justify-start p-6 overflow-y-auto">
        
        {metrics.collapse && (
          <div className="mb-4 bg-red-600 text-white px-12 py-3 text-xl font-bold border-4 border-red-900 animate-pulse shadow-2xl">
            ⚠ COLAPSO ESTRUCTURAL ⚠
          </div>
        )}

        {/* DIAGRAMA DE CUERPO LIBRE (DCL) */}
        <div className="relative bg-white border-2 border-slate-900 shadow-2xl mb-6">
          <svg width="750" height="480" viewBox="0 0 750 520">
            {/* Suelo y Apoyos */}
            <line x1="50" y1={metrics.BASE_Y + 25} x2="700" y2={metrics.BASE_Y + 25} stroke="#ccc" strokeWidth="1" />
            {[metrics.POST_X, metrics.ANC_X].map((x, i) => (
              <g key={i} transform={`translate(${x}, ${metrics.BASE_Y})`}>
                <circle r="7" fill="white" stroke="black" strokeWidth="2" />
                <path d="M0,7 L-20,25 L20,25 Z" fill="none" stroke="black" strokeWidth="2" />
                <line x1="-35" y1="25" x2="35" y2="25" stroke="black" strokeWidth="2.5" />
              </g>
            ))}

            {/* Elementos Estructurales */}
            <line x1={metrics.POST_X} y1={metrics.BASE_Y} x2={metrics.POST_X} y2={metrics.POST_TOP_Y} stroke="#000" strokeWidth="5" />
            <line x1={metrics.POST_X} y1={metrics.POST_TOP_Y} x2={metrics.ANC_X} y2={metrics.ANC_Y} 
                  stroke={metrics.failCable ? "#c00" : "#0057b7"} strokeWidth={4} strokeDasharray="10,5" />

            {/* DIAGRAMA DE FUERZAS: ACCIÓN P */}
            <Arrow x1={metrics.POST_X - metrics.pLen - 20} y1={metrics.POST_TOP_Y} x2={metrics.POST_X - 10} y2={metrics.POST_TOP_Y} color="#c00" width={5} />
            <text x={metrics.POST_X - metrics.pLen/2 - 20} y={metrics.POST_TOP_Y - 20} className="fill-red-700 text-base font-black" textAnchor="middle">ACCIÓN P = {P} kN</text>

            {/* DIAGRAMA DE FUERZAS: REACCIONES */}
            {/* Poste Ry ↑ */}
            <Arrow x1={metrics.POST_X} y1={metrics.BASE_Y + 10 + metrics.ryLen} x2={metrics.POST_X} y2={metrics.BASE_Y + 12} color="#15803d" width={4} />
            <text x={metrics.POST_X + 15} y={metrics.BASE_Y + metrics.ryLen + 30} className="fill-green-800 text-sm font-black font-mono">Ry,post = {metrics.Np.toFixed(1)} kN ↑</text>

            {/* Anclaje Rx ← y Ry ↓ */}
            <Arrow x1={metrics.ANC_X} y1={metrics.ANC_Y} x2={metrics.ANC_X - metrics.rxLen} y2={metrics.ANC_Y} color="#15803d" width={4} />
            <text x={metrics.ANC_X - metrics.rxLen - 10} y={metrics.ANC_Y + 5} textAnchor="end" className="fill-green-800 text-sm font-black font-mono">Rx,anc = {P.toFixed(1)} kN ←</text>
            <Arrow x1={metrics.ANC_X} y1={metrics.ANC_Y} x2={metrics.ANC_X} y2={metrics.ANC_Y + metrics.ryLen} color="#15803d" width={4} />
            <text x={metrics.ANC_X - 10} y={metrics.ANC_Y + metrics.ryLen + 25} textAnchor="end" className="fill-green-800 text-sm font-black font-mono">Ry,anc = {metrics.Np.toFixed(1)} kN ↓</text>

            {/* ESFUERZOS INTERNOS */}
            <text x={(metrics.POST_X + metrics.ANC_X)/2} y={(metrics.POST_TOP_Y + metrics.ANC_Y)/2 - 30} 
                  className={`text-base font-black italic ${metrics.failCable ? 'fill-red-600' : 'fill-blue-700'}`} textAnchor="middle">
              Nc (Tensión) = {metrics.Nc.toFixed(1)} kN
            </text>
            <text x={metrics.POST_X + 25} y={(metrics.BASE_Y + metrics.POST_TOP_Y)/2} className="fill-blue-900 text-base font-black">
              Np (Compresión) = {metrics.Np.toFixed(1)} kN
            </text>
          </svg>
        </div>

        {/* MONITOR DE FUERZAS Y MEMORIA (AMPLIADO) */}
        <div className="w-[750px] border-4 border-slate-900 p-6 font-mono bg-[#fdfdf7] shadow-2xl mb-8">
          <h3 className="font-black border-b-2 border-slate-400 mb-4 pb-2 text-center text-xl uppercase tracking-widest text-slate-700">
            ─── Memoria de Cálculo y Tensiones ───
          </h3>
          <div className="grid grid-cols-1 gap-6 text-lg">
            <div className="flex justify-between items-center bg-white p-3 border-l-8 border-blue-700 shadow-sm">
              <span className="font-bold">σ<sub>cable</sub> (Tracción) = N<sub>c</sub> / A<sub>c</sub></span>
              <span className="text-slate-500">{metrics.Nc.toFixed(2)} / {Ac} =</span>
              <span className={`text-2xl font-black px-4 py-1 ${metrics.failCable ? "bg-red-600 text-white" : "bg-blue-100 text-blue-900"}`}>
                {metrics.sigma_mpa.toFixed(2)} MPa
              </span>
            </div>
            <div className="flex justify-between items-center bg-white p-3 border-l-8 border-green-700 shadow-sm">
              <span className="font-bold">τ<sub>perno</sub> (Corte) = R<sub>x,anc</sub> / A<sub>perno</sub></span>
              <span className="text-slate-500">{P.toFixed(2)} / {A_PERNO} =</span>
              <span className={`text-2xl font-black px-4 py-1 ${metrics.failPin ? "bg-red-600 text-white" : "bg-green-100 text-green-900"}`}>
                {metrics.tau_mpa.toFixed(2)} MPa
              </span>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t-4 border-slate-900 flex justify-around text-sm font-black text-slate-600 italic bg-slate-100 p-2">
            <span>Nc = {metrics.Nc.toFixed(4)} kN</span>
            <span>Np = {metrics.Np.toFixed(4)} kN</span>
            <span>α = {alpha}.00°</span>
          </div>
        </div>

        {/* CUESTIONARIO */}
        <div className="w-[750px] space-y-4 pb-16">
          <h3 className="text-xl font-black uppercase border-b-4 border-slate-900 pb-2 italic tracking-tight">Cuestionario de Laboratorio</h3>
          {[
            { id: 1, texto: "¿Para qué ángulo α la reacción Ry en el poste es exactamente igual a la carga P?", opciones: ["30°", "45°", "60°", "75°"] },
            { id: 2, texto: "Si aumentamos el Área del Cable (Ac), ¿qué sucede con la fuerza interna Nc?", opciones: ["Aumenta proporcionalmente", "Disminuye", "Se mantiene constante", "Se vuelve nula"] },
            { id: 3, texto: "¿Qué componente en el anclaje resiste el empuje horizontal del viento?", opciones: ["Reacción Ry", "Reacción Rx (Corte)", "La compresión Np", "Ninguna de las anteriores"] }
          ].map((q) => (
            <div key={q.id} className="bg-white p-5 border-l-8 border-slate-900 shadow-md">
              <p className="text-base font-bold mb-4">{q.id}. {q.texto}</p>
              <div className="grid grid-cols-2 gap-4">
                {q.opciones.map((opt) => (
                  <label key={opt} className={`flex items-center gap-4 cursor-pointer p-3 border-2 transition-all font-bold text-sm ${respuestas[q.id] === opt ? 'bg-slate-900 text-white border-slate-900 shadow-inner' : 'bg-slate-50 border-slate-200 hover:border-slate-500'}`}>
                    <input type="radio" name={`q-${q.id}`} value={opt} className="hidden" checked={respuestas[q.id] === opt} onChange={() => setRespuestas({ ...respuestas, [q.id]: opt })} />
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
