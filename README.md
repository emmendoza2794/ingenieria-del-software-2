# Ingeniería del Software II

Repositorio del curso **Ingeniería del Software II** — Universidad Popular del Cesar (UPC).  
Contiene los laboratorios, materiales de clase y recursos de apoyo organizados por semana.

---

## Contenido del repositorio

```
ingenieria-del-software-2/
├── Plan_Ingenieria_Software_II.md   ← cronograma completo del curso
└── testing-lab/                     ← Semanas 13, 14 & 15 — Pruebas de Software
    ├── slides.html                  ← presentación (abrir en el navegador)
    └── MVP/
        ├── dev.sh                   ← levanta back + front juntos
        ├── back/                    ← FastAPI + Poetry
        │   ├── src/
        │   ├── tests/
        │   │   ├── unit/            ← 17 tests — pytest + freezegun
        │   │   ├── integration/     ← 21 tests — TestClient + SQLite
        │   │   └── load/            ← K6: smoke · load · stress
        │   └── TESTING.md
        └── front/                   ← Nuxt 3 + Bun
            ├── tests/e2e/           ← 5 tests — Playwright (JS)
            └── TESTING.md
```

---

## Laboratorios disponibles

| Semanas | Lab | Contenido | Materiales |
|---------|-----|-----------|-----------|
| 13 – 15 | Pruebas de Software | Unitarias · Integración · E2E · Carga | [`testing-lab/`](./testing-lab/) |

---

## Cronograma resumido

| Semana | Unidad | Tema | Hito del proyecto |
|--------|--------|------|-------------------|
| 1 | U1 | Intro a la Gestión de Proyectos | Identificación del problema real |
| 2 | U1 | Procesos de Inicio y Planificación | Alcance y stakeholders |
| 3 | U1 | Ejecución, Monitoreo y Cierre | Cronograma (Gantt/WBS) |
| 4 | U2 | Patrones de Diseño | Especificación de requerimientos |
| **5** | — | **Evaluación Corte 1** | Entrega: Documento de Gestión |
| 6 | U2 | Arquitectura: Monolitos vs Microservicios | Diagrama de arquitectura |
| 7 | U2 | El futuro de los Patrones de Diseño | Diseño de BD y API |
| 8 | U3 | Desarrollo Web y Móvil | Prototipo de alta fidelidad |
| 9 | U3 | Frameworks: Instalación y Entorno | Configuración del entorno |
| 10 | U3 | Lógica de Negocio en Frameworks | Implementación del Módulo Core |
| **11** | — | **Evaluación Corte 2** | Entrega: MVP Funcional en Git |
| 12 | U3 | Control de Versiones Avanzado | Integración de módulos |
| 13 | U4 | Pruebas Unitarias y Automatización | Plan de pruebas + unit testing |
| 14 | U4 | Pruebas de Integración y E2E | Pruebas de integración de servicios |
| 15 | U5 | Gestión de Calidad y Carga | Reporte de calidad y performance |
| **16** | — | **Evaluación Final** | Entrega: Producto Terminado |
| 17 | — | Cierre y Calificaciones | Retroalimentación final |
| 18 | — | Habilitaciones / Cierre de Acta | — |

> Plan completo con focos de investigación en [`Plan_Ingenieria_Software_II.md`](./Plan_Ingenieria_Software_II.md).

---

## Quick start — Lab de Testing (Semanas 13–15)

### Requisitos

- Python 3.11+ con [Poetry](https://python-poetry.org/)
- [Bun](https://bun.sh/)
- [K6](https://k6.io/docs/get-started/installation/)
- Node.js para instalar Playwright

### Levantar el entorno

```bash
# Desde testing-lab/MVP/
./dev.sh   # inicia back en :8000 y front en :3000
```

### Pruebas unitarias e integración (back)

```bash
cd testing-lab/MVP/back
.venv/bin/python -m pytest --cov=src --cov-report=term-missing
```

### Pruebas E2E (front)

```bash
cd testing-lab/MVP/front
bun install && npx playwright install chromium

bun run test:e2e           # headless
bun run test:e2e:headed    # con ventana visible, slowMo 1500ms
```

### Pruebas de carga

```bash
cd testing-lab/MVP/back
k6 run tests/load/smoke.js    # sanity check — 1 VU, 30s
k6 run tests/load/load.js     # carga normal — 10 VUs
k6 run tests/load/stress.js   # punto de quiebre — hasta 70 VUs
```

---

## Stack del laboratorio

| Capa | Tecnología |
|------|-----------|
| Backend | FastAPI · SQLAlchemy · slowapi · Poetry |
| Frontend | Nuxt 3 · Vue 3 · PrimeVue · Tailwind CSS |
| Pruebas unitarias / integración | pytest · httpx · freezegun · pytest-cov |
| Pruebas E2E | Playwright (JavaScript) |
| Pruebas de carga | K6 |

---

## Entregables por corte

### Corte 1 — Planificación y Análisis (30%)
- Documento de visión y alcance
- Project Charter
- Lista de requerimientos priorizados (MoSCoW)
- Cronograma inicial

### Corte 2 — Diseño y Construcción MVP (30%)
- Repositorio en GitHub con commits frecuentes
- Diagrama de arquitectura y entidad-relación
- Aplicación con al menos el 40% de la funcionalidad core operativa
- Uso de un framework (React, Vue, Spring Boot, Flutter, etc.)

### Corte 3 — Calidad y Despliegue (40%)
- Aplicación funcional al 100%
- Suite de pruebas: mínimo 2 unitarias + 2 integración + 2 E2E por grupo
- Reporte de pruebas de carga
- Manual de usuario y documentación de despliegue
