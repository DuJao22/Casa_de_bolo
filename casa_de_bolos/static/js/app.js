// Casa de Bolos - Interatividade Vanilla JS
document.addEventListener('DOMContentLoaded', function() {
  
  // Máscara de Telefone Brasileira: (00) 00000-0000 ou (00) 0000-0000
  const phoneInputs = document.querySelectorAll('.js-phone-mask');
  phoneInputs.forEach(input => {
    input.addEventListener('input', function(e) {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);

      if (value.length > 10) {
        // (11) 98765-4321
        value = value.replace(/^(\d{2})(\d{5})(\d{4})$/, '($1) $2-$3');
      } else if (value.length > 6) {
        // (11) 9876-5432
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4})$/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})$/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d*)$/, '($1');
      }
      e.target.value = value;
    });
  });

  // Controle de Quantidade em formulários (+ / -)
  const qtyWrappers = document.querySelectorAll('.js-qty-stepper');
  qtyWrappers.forEach(wrap => {
    const input = wrap.querySelector('input[type="number"]');
    const btnMinus = wrap.querySelector('.js-qty-minus');
    const btnPlus = wrap.querySelector('.js-qty-plus');

    if (btnMinus && input) {
      btnMinus.addEventListener('click', () => {
        let val = parseInt(input.value) || 1;
        if (val > 1) {
          input.value = val - 1;
        }
      });
    }

    if (btnPlus && input) {
      btnPlus.addEventListener('click', () => {
        let val = parseInt(input.value) || 1;
        input.value = val + 1;
      });
    }
  });

  // Toggle entre Retirada e Entrega na tela de checkout
  const radioEntrega = document.getElementById('tipo_entrega_entrega');
  const radioRetirada = document.getElementById('tipo_entrega_retirada');
  const enderecoBox = document.getElementById('box-endereco-entrega');

  function toggleEndereco() {
    if (radioEntrega && radioRetirada && enderecoBox) {
      if (radioEntrega.checked) {
        enderecoBox.style.display = 'block';
      } else {
        enderecoBox.style.display = 'none';
      }
    }
  }

  if (radioEntrega && radioRetirada) {
    radioEntrega.addEventListener('change', toggleEndereco);
    radioRetirada.addEventListener('change', toggleEndereco);
    toggleEndereco();
  }
});
