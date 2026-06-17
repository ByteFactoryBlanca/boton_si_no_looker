(function() {
  var APPS_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwM1IyN6dDCQTy6JMYYVLI5CJu5mo9DZd_bF0D2Ro2-8lSM3qJPBMQLmVgtLsClpMcg/exec';

  function drawViz(data) {
    var container = document.getElementById('container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'container';
      document.body.appendChild(container);
    }
    container.innerHTML = '';

    // Estilos generales
    container.style.fontFamily = 'Arial, sans-serif';
    container.style.padding = '10px';
    container.style.overflowY = 'auto';

    // Cabecera de la tabla
    var header = document.createElement('div');
    header.style.display = 'grid';
    header.style.gridTemplateColumns = '1fr 150px';
    header.style.fontWeight = 'bold';
    header.style.borderBottom = '2px solid #ccc';
    header.style.paddingBottom = '5px';
    header.style.marginBottom = '5px';
    header.innerHTML = '<span>Identificador</span><span>¿Seleccionado?</span>';
    container.appendChild(header);

    // Filas de datos
    var rows = data.tables.DEFAULT;
    rows.forEach(function(row) {
      var identificador = row.identificador[0];
      var valorActual = row.valorSiNo[0] || 'No';

      var fila = document.createElement('div');
      fila.style.display = 'grid';
      fila.style.gridTemplateColumns = '1fr 150px';
      fila.style.alignItems = 'center';
      fila.style.padding = '5px 0';
      fila.style.borderBottom = '1px solid #eee';

      // Columna identificador
      var idSpan = document.createElement('span');
      idSpan.textContent = identificador;
      fila.appendChild(idSpan);

      // Columna selector Sí/No
      var select = document.createElement('select');
      select.style.padding = '4px 8px';
      select.style.borderRadius = '4px';
      select.style.border = '1px solid #ccc';
      select.style.cursor = 'pointer';

      ['Sí', 'No'].forEach(function(opcion) {
        var opt = document.createElement('option');
        opt.value = opcion;
        opt.text = opcion;
        if (valorActual === opcion) opt.selected = true;
        select.appendChild(opt);
      });

      // Evento al cambiar el valor
      select.addEventListener('change', function() {
        var nuevoValor = select.value;

        // Feedback visual mientras se guarda
        select.disabled = true;
        select.style.backgroundColor = '#fffacd';

        fetch(APPS_SCRIPT_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({
            identificador: identificador,
            value: nuevoValor
          })
        })
        .then(function(response) { return response.json(); })
        .then(function(result) {
          if (result.status === 'ok') {
            select.style.backgroundColor = '#d4edda'; // verde = guardado OK
          } else {
            select.style.backgroundColor = '#f8d7da'; // rojo = error
          }
          select.disabled = false;
        })
        .catch(function() {
          select.style.backgroundColor = '#f8d7da'; // rojo = error de red
          select.disabled = false;
        });
      });

      fila.appendChild(select);
      container.appendChild(fila);
    });
  }

  dscc.subscribeToData(drawViz, { transform: dscc.objectTransform });
})();