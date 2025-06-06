// Arquivo: static/js/script.js
// Lógica JavaScript para interatividade do cardápio, popups de mensagem, carrinho de compras, pagamento e comprovante.

// Variáveis Globais
let cart = [];
let currentSubtotal = 0;
let currentPaymentMethod = '';
let currentFinalAmount = 0;
const MESSAGE_BOX_DISPLAY_TIME = 3000;

let messageBox;
let cartCountSpan;
let cartItemsListDiv;
let emptyCartMessage;
let cartTotalSpan;
let checkoutBtn;

let paymentOffcanvas;
let paymentSubtotalSpan;
let paymentFinalTotalSpan;
let paymentMessage;
let paymentOptionBtns;
let confirmPaymentBtn;

let receiptModal;
let receiptMethodDisplay;
let receiptTotalDisplay;

let bootstrapInstance; 

// Funções Auxiliares

function showMessage(message, type = 'success') {
    if (!messageBox) {
        console.error("ERRO: Elemento messageBox não encontrado para exibir mensagem.");
        return;
    }

    messageBox.className = 'message-box';
    messageBox.textContent = message;
    messageBox.classList.add('message-box-show');
    
    if (type === 'success') {
        messageBox.classList.add('message-box-success');
    } else if (type === 'error') {
        messageBox.classList.add('message-box-error');
    }

    setTimeout(() => {
        messageBox.classList.remove('message-box-show');
        setTimeout(() => {
            messageBox.classList.remove('message-box-success', 'message-box-error');
        }, 500);
    }, MESSAGE_BOX_DISPLAY_TIME);
}

function saveCart() {
    localStorage.setItem('lanchoneteCart', JSON.stringify(cart));
}

function loadCart() {
    const savedCart = localStorage.getItem('lanchoneteCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
    } else {
        cart = [];
    }
    updateCartDisplay();
}

function calculateCartSubtotal() {
    let total = 0;
    cart.forEach(item => {
        total += item.price * item.quantity;
    });
    return total;
}

function renderCartItems() {
    if (!cartItemsListDiv || !emptyCartMessage) {
        console.error("ERRO: Elementos do carrinho não encontrados para renderizar.");
        return;
    }

    cartItemsListDiv.innerHTML = '';
    if (cart.length === 0) {
        emptyCartMessage.style.display = 'block';
    } else {
        emptyCartMessage.style.display = 'none';
        cart.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('cart-item', 'd-flex', 'justify-content-between', 'align-items-center', 'py-2', 'border-bottom');
            itemDiv.innerHTML = `
                <div>
                    <h6 class="mb-0 text-white">${item.name}</h6>
                    <small class="text-muted">R$ ${item.price.toFixed(2)} x ${item.quantity}</small>
                </div>
                <div class="d-flex align-items-center">
                    <button class="btn btn-sm btn-outline-warning mx-1 decrease-cart-item" data-item-id="${item.id}">-</button>
                    <span class="text-white">${item.quantity}</span>
                    <button class="btn btn-sm btn-outline-warning mx-1 increase-cart-item" data-item-id="${item.id}">+</button>
                    <button class="btn btn-sm btn-danger ms-2 remove-from-cart" data-item-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
                </div>
            `;
            cartItemsListDiv.appendChild(itemDiv);
        });
    }
    document.querySelectorAll('.decrease-cart-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = parseInt(event.currentTarget.dataset.itemId);
            updateCartItemQuantity(itemId, -1);
        });
    });
    document.querySelectorAll('.increase-cart-item').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = parseInt(event.currentTarget.dataset.itemId);
            updateCartItemQuantity(itemId, 1);
        });
    });
    document.querySelectorAll('.remove-from-cart').forEach(button => {
        button.addEventListener('click', (event) => {
            const itemId = parseInt(event.currentTarget.dataset.itemId);
            removeCartItem(itemId);
        });
    });
}

function updateCartDisplay() {
    if (!cartCountSpan || !cartTotalSpan) {
        console.error("ERRO: Elementos de display do carrinho não encontrados para atualizar.");
        return;
    }
    cartCountSpan.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartTotalSpan.textContent = `R$ ${calculateCartSubtotal().toFixed(2)}`;
    renderCartItems();
    saveCart();
}

function addCartItem(itemData, quantity) {
    const existingItemIndex = cart.findIndex(item => item.id === itemData.id);

    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += quantity;
    } else {
        cart.push({ ...itemData, quantity: quantity });
    }
    updateCartDisplay();
}

function updateCartItemQuantity(itemId, change) {
    const itemIndex = cart.findIndex(item => item.id === itemId);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += change;
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
    }
    updateCartDisplay();
}

function removeCartItem(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    updateCartDisplay();
}

function openPaymentOffcanvas() {
    console.log("DEBUG: --- openPaymentOffcanvas() chamada ---");
    currentSubtotal = calculateCartSubtotal();
    console.log("DEBUG: Subtotal calculado:", currentSubtotal);

    if (!paymentSubtotalSpan || !paymentFinalTotalSpan || !paymentMessage) {
        console.error("ERRO: Elementos de display do pagamento não encontrados.");
        showMessage("Erro ao carregar a tela de pagamento. Recarregue a página.", "error");
        return;
    }

    paymentSubtotalSpan.textContent = `R$ ${currentSubtotal.toFixed(2)}`;
    paymentFinalTotalSpan.textContent = `R$ ${currentSubtotal.toFixed(2)}`;
    paymentMessage.textContent = '';
    currentPaymentMethod = '';
    currentFinalAmount = currentSubtotal;

    paymentOptionBtns.forEach(btn => {
        btn.classList.remove('active', 'btn-warning');
        btn.classList.add('btn-primary');
    });

    if (paymentOffcanvas && bootstrapInstance && bootstrapInstance.Offcanvas) {
        try {
            console.log("DEBUG: Tentando abrir o offcanvas de pagamento com getOrCreateInstance...");
            const offcanvasInstance = bootstrapInstance.Offcanvas.getOrCreateInstance(paymentOffcanvas);
            offcanvasInstance.show();
            console.log("DEBUG: Offcanvas de pagamento deve ter sido aberto com sucesso.");
        } catch (error) {
            console.error("ERRO ao abrir o offcanvas de pagamento:", error);
            showMessage("Erro ao abrir a tela de pagamento. Tente novamente.", "error");
        }
    } else {
        console.error("ERRO: Elemento #pagamentoOffcanvas ou Bootstrap.Offcanvas não encontrado.");
        showMessage("Problema na tela de pagamento. Contate o suporte.", "error");
    }
}

function calculateFinalPayment(method) {
    console.log("DEBUG: calculateFinalPayment() chamada para método:", method);
    let finalTotal = currentSubtotal;
    let message = '';

    if (!paymentOptionBtns || !paymentFinalTotalSpan || !paymentMessage) {
        console.error("ERRO: Elementos de opção de pagamento ou display final não encontrados.");
        showMessage("Erro ao calcular o pagamento. Recarregue a página.", "error");
        return;
    }

    paymentOptionBtns.forEach(btn => {
        btn.classList.remove('active', 'btn-warning');
        btn.classList.add('btn-primary');
    });

    const clickedButton = document.querySelector(`.payment-option-btn[data-payment-method="${method}"]`);
    if (clickedButton) {
        clickedButton.classList.add('active', 'btn-warning');
        clickedButton.classList.remove('btn-primary');
    }

    if (method === 'pix') {
        finalTotal *= 0.91;
        message = 'Você ganhou 9% de desconto!';
    } else if (method === 'cartao') {
        finalTotal *= 1.09;
        message = 'Acréscimo de 9% para pagamento com cartão.';
    } else if (method === 'dinheiro') {
        message = 'Pagamento em dinheiro selecionado.';
    }

    paymentFinalTotalSpan.textContent = `R$ ${finalTotal.toFixed(2)}`;
    paymentMessage.textContent = message;

    currentPaymentMethod = method;
    currentFinalAmount = finalTotal;
    console.log("DEBUG: Método selecionado:", currentPaymentMethod, "Total final:", currentFinalAmount.toFixed(2));
}

function showReceiptModal(method, total) {
    console.log("DEBUG: showReceiptModal() chamada para método:", method, "Total:", total.toFixed(2));
    const methodText = {
        'pix': 'Pix',
        'cartao': 'Cartão de Crédito',
        'dinheiro': 'Dinheiro'
    }[method] || method;

    if (!receiptMethodDisplay || !receiptTotalDisplay) {
        console.error("ERRO CRÍTICO: Elementos de display do comprovante (método ou total) são NULL na showReceiptModal().");
        showMessage("Erro ao gerar o comprovante. Elementos HTML não encontrados.", "error");
        return; 
    }
    
    receiptMethodDisplay.textContent = `Forma de pagamento: ${methodText}`;
    receiptTotalDisplay.textContent = `Total: R$ ${total.toFixed(2)}`;

    if (receiptModal && bootstrapInstance && bootstrapInstance.Modal) {
        try {
            console.log("DEBUG: Tentando abrir o modal de comprovante com getOrCreateInstance...");
            const modalInstance = bootstrapInstance.Modal.getOrCreateInstance(receiptModal);
            modalInstance.show();
            console.log("DEBUG: Modal de comprovante deve ter sido aberto com sucesso.");
        } catch (error) {
            console.error("ERRO ao abrir o modal de comprovante:", error);
            showMessage("Erro ao exibir o comprovante. Tente novamente.", "error");
        }
    } else {
        console.error("ERRO: Elemento #receiptModal ou Bootstrap.Modal não encontrado no momento da chamada.");
        showMessage("Problema ao gerar comprovante. Contate o suporte.", "error");
    }
}

// Início do Script quando o DOM estiver completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    // Inicializa TODOS os elementos do DOM APÓS o DOM estar carregado
    // Isso garante que os elementos HTML já foram parsed e estão disponíveis.
    messageBox = document.getElementById('message-box');
    cartCountSpan = document.getElementById('cart-count');
    cartItemsListDiv = document.getElementById('cart-items-list');
    emptyCartMessage = document.getElementById('empty-cart-message');
    cartTotalSpan = document.getElementById('cart-total');
    checkoutBtn = document.getElementById('checkout-btn');

    paymentOffcanvas = document.getElementById('pagamentoOffcanvas');
    paymentSubtotalSpan = document.getElementById('payment-subtotal');
    paymentFinalTotalSpan = document.getElementById('payment-final-total');
    paymentMessage = document.getElementById('payment-message');
    paymentOptionBtns = document.querySelectorAll('.payment-option-btn');
    confirmPaymentBtn = document.getElementById('confirm-payment-btn');

    receiptModal = document.getElementById('receiptModal');
    receiptMethodDisplay = document.getElementById('receipt-method-display');
    receiptTotalDisplay = document.getElementById('receipt-total-display');

    // DEBUG: Confirma se os elementos do comprovante foram encontrados
    console.log("DEBUG: receiptModal:", receiptModal);
    console.log("DEBUG: receiptMethodDisplay:", receiptMethodDisplay);
    console.log("DEBUG: receiptTotalDisplay:", receiptTotalDisplay);


    bootstrapInstance = window.bootstrap;

    if (!bootstrapInstance || !bootstrapInstance.Offcanvas || !bootstrapInstance.Modal) {
        console.error("ERRO CRÍTICO: Bootstrap JavaScript não carregado corretamente ou APIs não disponíveis. Verifique o link do CDN no base.html.");
        showMessage("Problema técnico: funcionalidade da lanchonete indisponível. Recarregue a página ou contate o suporte.", "error");
        return;
    }
    console.log("DEBUG: Bootstrap JavaScript APIs disponíveis.");

    loadCart();

    // Event listeners para botões de quantidade nos itens do cardápio
    document.querySelectorAll('.quantity-control').forEach(control => {
        const quantityDisplay = control.querySelector('.quantity-display');

        control.querySelector('.btn-decrease').addEventListener('click', () => {
            let currentQuantity = parseInt(quantityDisplay.value);
            if (currentQuantity > 0) {
                currentQuantity--;
                quantityDisplay.value = currentQuantity;
            }
        });

        control.querySelector('.btn-increase').addEventListener('click', () => {
            let currentQuantity = parseInt(quantityDisplay.value);
            currentQuantity++;
            quantityDisplay.value = currentQuantity;
        });
    });

    document.querySelectorAll('.add-to-cart-btn').forEach(button => {
        button.addEventListener('click', () => {
            const itemId = parseInt(button.dataset.itemId);
            const itemName = button.dataset.itemName;
            const itemPrice = parseFloat(button.dataset.itemPrice);

            const quantityControl = document.querySelector(`.quantity-control[data-item-id="${itemId}"]`);
            const quantityDisplay = quantityControl ? quantityControl.querySelector('.quantity-display') : null;
            let quantity = quantityDisplay ? parseInt(quantityDisplay.value) : 0;

            if (quantity > 0) {
                addCartItem({ id: itemId, name: itemName, price: itemPrice }, quantity);
                showMessage(`${quantity}x ${itemName} adicionado(s) ao carrinho!`, 'success');
                
                if (quantityDisplay) {
                    quantityDisplay.value = 0;
                }
            } else {
                showMessage(`Selecione uma quantidade para ${itemName}!`, 'error');
            }
        });
    });

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            console.log("DEBUG: Botão 'Finalizar Pedido' clicado.");
            if (cart.length > 0) {
                const offcanvasCartElement = document.getElementById('carrinhoOffcanvas');
                if (offcanvasCartElement && bootstrapInstance.Offcanvas) {
                    const offcanvasCartInstance = bootstrapInstance.Offcanvas.getOrCreateInstance(offcanvasCartElement);
                    offcanvasCartInstance.hide();
                    console.log("DEBUG: Offcanvas do carrinho escondido.");
                }
                openPaymentOffcanvas();
            } else {
                showMessage("Seu carrinho está vazio. Adicione itens antes de finalizar!", "error");
                console.log("DEBUG: Carrinho vazio, mensagem de erro exibida.");
            }
        });
    } else {
        console.error("ERRO: Botão #checkout-btn não encontrado ao iniciar o script.");
    }

    if (paymentOptionBtns && paymentOptionBtns.length > 0) {
        paymentOptionBtns.forEach(button => {
            button.addEventListener('click', (event) => {
                const method = event.currentTarget.dataset.paymentMethod;
                calculateFinalPayment(method);
            });
        });
    } else {
        console.warn("AVISO: Botões de opção de pagamento não encontrados ou vazios.");
    }

    if (confirmPaymentBtn) {
        confirmPaymentBtn.addEventListener('click', () => {
            console.log("DEBUG: Botão 'Confirmar Pagamento' clicado.");
            if (cart.length > 0 && currentPaymentMethod) {
                
                if (paymentOffcanvas && bootstrapInstance.Offcanvas) {
                    const offcanvasPaymentInstance = bootstrapInstance.Offcanvas.getOrCreateInstance(paymentOffcanvas);
                    offcanvasPaymentInstance.hide();
                    console.log("DEBUG: Offcanvas de pagamento escondido.");
                }

                showReceiptModal(currentPaymentMethod, currentFinalAmount);
                
                cart = [];
                updateCartDisplay();
                console.log("DEBUG: Carrinho limpo e comprovante exibido.");
                
            } else if (!currentPaymentMethod) {
                showMessage("Por favor, selecione uma forma de pagamento!", "error");
                console.log("DEBUG: Método de pagamento não selecionado, mensagem de erro exibida.");
            } else {
                showMessage("Não há itens no carrinho para finalizar o pagamento.", "error");
                if (paymentOffcanvas && bootstrapInstance.Offcanvas) {
                    const offcanvasPaymentInstance = bootstrapInstance.Offcanvas.getOrCreateInstance(paymentOffcanvas);
                    offcanvasPaymentInstance.hide();
                }
                console.log("DEBUG: Carrinho vazio, tela de pagamento fechada.");
            }
        });
    } else {
        console.error("ERRO: Botão #confirm-payment-btn não encontrado ao iniciar o script.");
    }
});
