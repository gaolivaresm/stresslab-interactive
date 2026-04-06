# StressLab Interactive (v1.3) 🏗️

**StressLab** es un simulador educativo interactivo desarrollado para estudiantes de **Estructuras I**. La herramienta permite visualizar de manera dinámica la transición crítica entre la **Estática de Cuerpo Rígido** y la **Resistencia de Materiales**.

El objetivo es que el alumno comprenda físicamente cómo las fuerzas externas se transforman en esfuerzos internos y reacciones de apoyo mediante un modelo isostático de mástil con viento.

---

## 🎯 Propósito Pedagógico
En el contexto de la formación de arquitectos e ingenieros, esta herramienta ayuda a identificar:
* **Acciones:** Cargas externas aplicadas al sistema (Viento $P$).
* **Esfuerzos Internos:** El "sufrimiento" interno de la materia (Tracción en cable $N_c$ y Compresión en poste $N_p$).
* **Reacciones:** Las fuerzas que el suelo ejerce para mantener el equilibrio del conjunto ($R_x, R_y$).

## 🛠️ Características Técnicas
* **Motor Lógico:** Cálculo de equilibrio en tiempo real basado en trigonometría fundamental.
* **Estética TikZ:** Interfaz limpia inspirada en la precisión gráfica de LaTeX/TikZ.
* **Análisis de Falla:** Alertas visuales de **Colapso Estructural** basadas en límites elásticos reales:
  * Acero (Cable): $\sigma > 250$ MPa.
  * Perno (Anclaje): $\tau > 120$ MPa.
* **Portabilidad:** Desarrollado en **Vanilla JavaScript** y **SVG**. Sin dependencias, funciona en cualquier navegador moderno.

## 📐 Modelo Matemático
El simulador resuelve el equilibrio del nodo superior mediante las siguientes ecuaciones:

### Esfuerzos Internos
$$N_c = \frac{P}{\cos(\alpha)}$$
$$N_p = P \cdot \tan(\alpha)$$

### Tensiones de Diseño
$$\sigma = \frac{N_c}{A_{cable}} \cdot 10$$
$$\tau = \frac{R_{x,anc}}{A_{perno}} \cdot 10$$
*(Donde el factor 10 convierte de kN/cm² a MPa)*.

## 🖥️ Instalación y Uso
1. Clona este repositorio:
   ```bash
   git clone [https://github.com/gaolivaresm/stresslab-interactive.git](https://github.com/gaolivaresm/stresslab-interactive.git)
