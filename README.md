# Neon Tetris

Un Tetris completo y accesible que funciona directamente en el navegador, sin
dependencias ni proceso de compilación.

## Ejecutar

```bash
python3 -m http.server 8000
```

Abre <http://localhost:8000>. También puedes abrir `index.html` directamente.

## Controles

| Acción | Teclas |
| --- | --- |
| Mover | `←` / `→` o `A` / `D` |
| Caída suave | `↓` o `S` |
| Caída instantánea | `Espacio` |
| Girar | `↑` / `X` (horario), `Z` (antihorario) |
| Guardar pieza | `C` |
| Pausar | `P` o `Escape` |
| Reiniciar | `R` |

Incluye controles táctiles, pieza fantasma, sistema de *hold*, cola de
próximas piezas, niveles, récord persistente y pausa automática cuando la
ventana pierde el foco.

## Pruebas

```bash
node --test
```
