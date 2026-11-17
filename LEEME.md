# Código editable — Oscilaciones mecánicas

Esta carpeta contiene la misma presentación de 19 diapositivas en cinco archivos independientes.
No necesita servidor ni conexión a internet: abre `index.html` con el navegador.

## ¿Qué archivo edito?

- **index.html**: textos de las diapositivas, fórmulas LaTeX y contenido.
  Encuentra `<!-- DIAPOSITIVA: ... -->` para localizar cada sección.
  Las notas de exposición están conservadas como **comentarios HTML**, invisibles en pantalla.
  Para cambiar fórmulas: modifica `\( ... \)` directamente.
  Para añadir/borrar una diapositiva: duplica/elimina un bloque `<article class="slide">` completo.
- **styles.css**: colores, tamaños de letra, disposición de los paneles.
- **navigation.js**: funcionamiento de las flechas, índice, numeración y estados preconfigurados.
  Modifica el atributo `data-sim` de cada diapositiva para asignar una demostración.
- **simulador.html**: código original del simulador físico interactivo (controles y animaciones).
- **mathjax-tex-svg.js**: motor de renderizado de LaTeX; NO ES NECESARIO EDITARLO.

La numeración de diapositivas y el índice lateral se generan automáticamente.
Se retiraron los comentarios visibles en la exposición y la antigua diapositiva 19 (gráfica del ejercicio), conservando la deducción de resonancia en la 18.
