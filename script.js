// ============================================
// VARIÁVEIS GLOBAIS
// ============================================
let fontSize = 16;
let ecoPoints = 0;
let darkMode = false;
let highContrast = false;
let dyslexiaMode = false;

// ============================================
// ACESSIBILIDADE
// ============================================

function increaseFont() {
    fontSize += 2;
    if (fontSize > 32) fontSize = 32;
    document.body.style.fontSize = fontSize + "px";
    showToast(`🔍 Fonte aumentada para ${fontSize}px`);
}

function decreaseFont() {
    fontSize -= 2;
    if (fontSize < 12) fontSize = 12;
    document.body.style.fontSize = fontSize + "px";
    showToast(`🔍 Fonte reduzida para ${fontSize}px`);
}

function toggleContrast() {
    highContrast = !highContrast;
    if (highContrast) {
        document.body.classList.add("high-contrast");
        showToast("🎨 Modo alto contraste ativado");
    } else {
        document.body.classList.remove("high-contrast");
        showToast("🎨 Modo alto contraste desativado");
    }
}

function toggleDyslexia() {
    dyslexiaMode = !dyslexiaMode;
    if (dyslexiaMode) {
        document.body.classList.add("dyslexia-mode");
        showToast("📖 Modo dislexia ativado");
    } else {
        document.body.classList.remove("dyslexia-mode");
        showToast("📖 Modo dislexia desativado");
    }
}

function toggleDarkMode() {
    darkMode = !darkMode;
    if (darkMode) {
        document.body.classList.add("dark-mode");
        showToast("🌙 Modo escuro ativado");
    } else {
        document.body.classList.remove("dark-mode");
        showToast("☀️ Modo claro ativado");
    }
}

function speakPage() {
    // Verifica se o navegador suporta Speech Synthesis
    if (!('speechSynthesis' in window)) {
        showToast("❌ Seu navegador não suporta leitura em voz alta");
        return;
    }
    
    // Interrompe qualquer fala em andamento
    speechSynthesis.cancel();
    
    const texto = document.body.innerText;
    const fala = new SpeechSynthesisUtterance(texto);
    fala.lang = "pt-BR";
    fala.rate = 0.9;
    fala.pitch = 1;
    fala.volume = 1;
    
    speechSynthesis.speak(fala);
    showToast("🔊 Leitura da página iniciada");
}

function stopSpeaking() {
    if ('speechSynthesis' in window) {
        speechSynthesis.cancel();
        showToast("🔇 Leitura interrompida");
    }
}

// ============================================
// FUNÇÃO DE NOTIFICAÇÃO (TOAST)
// ============================================
function showToast(message, type = "info") {
    // Remove toast existente
    const existingToast = document.querySelector(".toast-notification");
    if (existingToast) existingToast.remove();
    
    // Cria novo toast
    const toast = document.createElement("div");
    toast.className = `toast-notification ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <i class="fas ${type === "success" ? "fa-check-circle" : type === "error" ? "fa-exclamation-circle" : "fa-info-circle"}"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Estilos do toast
    toast.style.position = "fixed";
    toast.style.bottom = "20px";
    toast.style.right = "20px";
    toast.style.zIndex = "9999";
    toast.style.animation = "slideInRight 0.3s ease";
    
    document.body.appendChild(toast);
    
    // Remove após 3 segundos
    setTimeout(() => {
        toast.style.animation = "slideOutRight 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// ============================================
// MONITORAMENTO
// ============================================

function analisarDados() {
    // Verifica se os elementos existem
    const aguaInput = document.getElementById("agua");
    const temperaturaInput = document.getElementById("temperatura");
    const umidadeInput = document.getElementById("umidade");
    const chuvaInput = document.getElementById("chuva");
    const resultadoDiv = document.getElementById("resultado");
    
    if (!aguaInput || !temperaturaInput || !umidadeInput || !chuvaInput || !resultadoDiv) {
        console.error("Elementos do formulário não encontrados");
        return;
    }
    
    const agua = Number(aguaInput.value) || 0;
    const temperatura = Number(temperaturaInput.value) || 0;
    const umidade = Number(umidadeInput.value) || 0;
    const chuva = Number(chuvaInput.value) || 0;
    
    let mensagem = "";
    let alertas = [];
    let pontosGanhos = 0;
    
    // Análise de água
    if (agua > 1000) {
        alertas.push("⚠️ Consumo de água acima do ideal.");
    } else if (agua > 800) {
        alertas.push("⚡ Consumo de água moderado. Pode melhorar.");
        pontosGanhos += 5;
    } else {
        alertas.push("✅ Consumo de água adequado. Parabéns!");
        pontosGanhos += 10;
    }
    
    // Análise de temperatura
    if (temperatura > 38) {
        alertas.push("🌡️ Temperatura crítica! Risco de queima das plantas.");
    } else if (temperatura > 35) {
        alertas.push("🌡️ Temperatura elevada. Atenção à irrigação.");
        pontosGanhos += 3;
    } else if (temperatura >= 20 && temperatura <= 30) {
        alertas.push("🌡️ Temperatura ideal para a plantação.");
        pontosGanhos += 5;
    }
    
    // Análise de umidade
    if (umidade < 25) {
        alertas.push("💧 Umidade crítica! Risco severo para a plantação.");
    } else if (umidade < 30) {
        alertas.push("💧 Umidade baixa. Risco moderado para a plantação.");
        pontosGanhos += 3;
    } else if (umidade >= 40 && umidade <= 70) {
        alertas.push("💧 Umidade ideal para desenvolvimento das culturas.");
        pontosGanhos += 5;
    }
    
    // Análise de chuva
    if (chuva < 15) {
        alertas.push("☁️ Pouca chuva prevista. Planeje irrigação.");
    } else if (chuva > 80) {
        alertas.push("🌧️ Muita chuva! Risco de alagamento.");
    } else {
        alertas.push("🌦️ Índice pluviométrico favorável.");
        pontosGanhos += 3;
    }
    
    // Calcula pontuação de bônus
    if (alertas.length <= 2) {
        pontosGanhos += 15;
        alertas.push("🏆 Excelente! Sua fazenda está muito sustentável!");
    } else if (alertas.length <= 4) {
        pontosGanhos += 8;
        alertas.push("🌱 Bom trabalho! Continue melhorando.");
    }
    
    // Atualiza pontos ecológicos
    ecoPoints += pontosGanhos;
    atualizarPontuacao();
    
    // Exibe mensagem
    mensagem = `
        <div class="alert-container">
            <div class="alert-header">
                <i class="fas fa-chart-line"></i>
                <strong>Análise Ambiental</strong>
                <span class="pontos-ganhos">+${pontosGanhos} pontos</span>
            </div>
            <div class="alert-list">
                ${alertas.map(alerta => `<div class="alert-item">${alerta}</div>`).join('')}
            </div>
            <div class="alert-footer">
                <i class="fas fa-leaf"></i>
                Total de pontos: ${ecoPoints}
            </div>
        </div>
    `;
    
    resultadoDiv.innerHTML = mensagem;
    resultadoDiv.style.animation = "pulse 0.5s ease";
    
    // Atualiza dashboard
    atualizarDashboard();
    
    // Mostra notificação
    if (pontosGanhos > 0) {
        showToast(`🎉 +${pontosGanhos} pontos ecológicos!`, "success");
    }
}

// ============================================
// DASHBOARD
// ============================================

function atualizarDashboard() {
    // Simula dados mais realistas baseados nos inputs reais
    const aguaInput = document.getElementById("agua");
    const temperaturaInput = document.getElementById("temperatura");
    const umidadeInput = document.getElementById("umidade");
    const chuvaInput = document.getElementById("chuva");
    
    const agua = aguaInput ? Number(aguaInput.value) || 0 : 500;
    const temperatura = temperaturaInput ? Number(temperaturaInput.value) || 25 : 25;
    const umidade = umidadeInput ? Number(umidadeInput.value) || 50 : 50;
    const chuva = chuvaInput ? Number(chuvaInput.value) || 30 : 30;
    
    // Calcula indicadores baseados nos dados reais
    let aguaIndicador = Math.min(100, Math.max(0, (agua / 1200) * 100));
    aguaIndicador = Math.floor(aguaIndicador);
    
    let sustentabilidadeIndicador = 70;
    if (agua <= 800) sustentabilidadeIndicador += 15;
    if (temperatura >= 20 && temperatura <= 30) sustentabilidadeIndicador += 10;
    if (umidade >= 40 && umidade <= 70) sustentabilidadeIndicador += 10;
    if (chuva >= 20 && chuva <= 60) sustentabilidadeIndicador += 5;
    sustentabilidadeIndicador = Math.min(100, Math.floor(sustentabilidadeIndicador));
    
    let riscoIndicador = 30;
    if (agua > 1000) riscoIndicador += 25;
    if (temperatura > 35) riscoIndicador += 20;
    if (umidade < 30) riscoIndicador += 25;
    if (chuva < 15) riscoIndicador += 15;
    riscoIndicador = Math.min(95, Math.floor(riscoIndicador));
    
    let economiaGerada = Math.floor((100 - aguaIndicador) * 8) + (ecoPoints * 0.5);
    economiaGerada = Math.max(0, Math.floor(economiaGerada));
    
    // Atualiza os elementos do DOM
    const aguaIndicadorElem = document.getElementById("aguaIndicador");
    const sustentabilidadeElem = document.getElementById("sustentabilidadeIndicador");
    const riscoElem = document.getElementById("riscoIndicador");
    const economiaElem = document.getElementById("economiaIndicador");
    
    if (aguaIndicadorElem) aguaIndicadorElem.innerText = aguaIndicador + "%";
    if (sustentabilidadeElem) sustentabilidadeElem.innerText = sustentabilidadeIndicador + "%";
    if (riscoElem) riscoElem.innerText = riscoIndicador + "%";
    if (economiaElem) economiaElem.innerText = "R$ " + economiaGerada.toLocaleString();
    
    // Adiciona classes de cor baseadas nos valores
    if (aguaIndicadorElem) {
        aguaIndicadorElem.className = aguaIndicador > 70 ? "warning-value" : "good-value";
    }
    if (sustentabilidadeElem) {
        sustentabilidadeElem.className = sustentabilidadeIndicador > 70 ? "good-value" : "warning-value";
    }
    if (riscoElem) {
        riscoElem.className = riscoIndicador > 50 ? "danger-value" : "good-value";
    }
}

// ============================================
// SIMULADOR CLIMÁTICO
// ============================================

function simularClima() {
    const chuvaInput = document.getElementById("simChuva");
    const calorInput = document.getElementById("simCalor");
    const umidadeInput = document.getElementById("simUmidade");
    const resultadoDiv = document.getElementById("resultadoSimulador");
    
    if (!chuvaInput || !calorInput || !umidadeInput || !resultadoDiv) {
        console.error("Elementos do simulador não encontrados");
        return;
    }
    
    const chuva = Number(chuvaInput.value) || 0;
    const calor = Number(calorInput.value) || 25;
    const umidade = Number(umidadeInput.value) || 50;
    
    let impactos = [];
    let produtividade = 100;
    
    // Análise de chuva
    if (chuva < 20) {
        impactos.push("🌵 Seca severa - Risco de perda de safra");
        produtividade -= 30;
    } else if (chuva < 40) {
        impactos.push("💧 Pouca chuva - Necessário irrigação suplementar");
        produtividade -= 15;
    } else if (chuva > 100) {
        impactos.push("🌊 Excesso de chuva - Risco de alagamento");
        produtividade -= 25;
    } else if (chuva >= 60 && chuva <= 90) {
        impactos.push("🌦️ Chuva ideal para a cultura");
        produtividade += 10;
    }
    
    // Análise de calor
    if (calor > 40) {
        impactos.push("🔥 Calor extremo - Queima das plantas");
        produtividade -= 35;
    } else if (calor > 35) {
        impactos.push("🌡️ Calor intenso - Estresse térmico");
        produtividade -= 20;
    } else if (calor < 15) {
        impactos.push("❄️ Frio intenso - Geada pode danificar");
        produtividade -= 25;
    } else if (calor >= 22 && calor <= 28) {
        impactos.push("🌡️ Temperatura ideal para desenvolvimento");
        produtividade += 15;
    }
    
    // Análise de umidade
    if (umidade < 25) {
        impactos.push("💨 Umidade crítica - Dessecação das plantas");
        produtividade -= 25;
    } else if (umidade < 40) {
        impactos.push("🍂 Umidade baixa - Perda de água por evaporação");
        produtividade -= 10;
    } else if (umidade > 85) {
        impactos.push("🍄 Umidade alta - Risco de fungos");
        produtividade -= 15;
    } else if (umidade >= 55 && umidade <= 75) {
        impactos.push("💧 Umidade confortável para as plantas");
        produtividade += 10;
    }
    
    produtividade = Math.min(130, Math.max(0, produtividade));
    
    let classificacao = "";
    let cor = "";
    let icone = "";
    
    if (produtividade >= 90) {
        classificacao = "Excelente";
        cor = "#4caf50";
        icone = "🏆";
    } else if (produtividade >= 70) {
        classificacao = "Boa";
        cor = "#8bc34a";
        icone = "👍";
    } else if (produtividade >= 50) {
        classificacao = "Regular";
        cor = "#ffc107";
        icone = "⚠️";
    } else {
        classificacao = "Crítica";
        cor = "#f44336";
        icone = "🔴";
    }
    
    const resultadoHTML = `
        <div class="simulacao-resultado">
            <div class="sim-header">
                <i class="fas fa-chart-line"></i>
                <strong>Impacto na Plantação</strong>
            </div>
            <div class="sim-impactos">
                ${impactos.map(i => `<div class="impacto-item">${i}</div>`).join('')}
            </div>
            <div class="sim-produtividade" style="border-left-color: ${cor}">
                <div class="prod-label">
                    <span>📊 Produtividade Estimada</span>
                    <span class="prod-class">${icone} ${classificacao}</span>
                </div>
                <div class="prod-bar">
                    <div class="prod-fill" style="width: ${produtividade}%; background: ${cor}"></div>
                </div>
                <div class="prod-value">${produtividade}% da capacidade máxima</div>
            </div>
        </div>
    `;
    
    resultadoDiv.innerHTML = resultadoHTML;
    resultadoDiv.style.animation = "fadeInUp 0.5s ease";
    
    // Atualiza dashboard após simulação
    atualizarDashboard();
}

// ============================================
// PONTUAÇÃO ECOLÓGICA
// ============================================

function atualizarPontuacao() {
    const ecoPointsSpan = document.getElementById("ecoPoints");
    const nivelSpan = document.getElementById("nivelEcologico");
    
    if (ecoPointsSpan) {
        ecoPointsSpan.innerText = ecoPoints;
        ecoPointsSpan.style.animation = "bounce 0.5s ease";
        setTimeout(() => {
            if (ecoPointsSpan) ecoPointsSpan.style.animation = "";
        }, 500);
    }
    
    // Determina nível ecológico
    let nivel = "";
    let medalha = "";
    
    if (ecoPoints >= 500) {
        nivel = "🌍 Mestre Sustentável";
        medalha = "🏆🥇";
    } else if (ecoPoints >= 300) {
        nivel = "🌟 Guardião Ambiental";
        medalha = "🥈";
    } else if (ecoPoints >= 150) {
        nivel = "🌱 Amigo da Terra";
        medalha = "🥉";
    } else {
        nivel = "🌿 Embaixador Verde";
        medalha = "🌱";
    }
    
    if (nivelSpan) {
        nivelSpan.innerHTML = `${medalha} ${nivel}`;
    }
    
    // Salva pontuação no localStorage
    localStorage.setItem("ecoPoints", ecoPoints);
}

// ============================================
// CHATBOT IA INTELIGENTE
// ============================================

function sendMessage() {
    const input = document.getElementById("userInput");
    const chat = document.getElementById("chatWindow");
    
    if (!input || !chat) {
        console.error("Elementos do chat não encontrados");
        return;
    }
    
    const texto = input.value.trim();
    if (texto === "") return;
    
    // Adiciona mensagem do usuário
    addMessageToChat(chat, `👨‍🌾 Você: ${texto}`, "user");
    
    // Processa resposta inteligente
    const resposta = getSmartResponse(texto);
    
    // Adiciona mensagem do bot com delay
    setTimeout(() => {
        addMessageToChat(chat, `🤖 AgroVision IA: ${resposta}`, "bot");
        input.value = "";
        
        // Adiciona pontos por interação no chat
        ecoPoints += 2;
        atualizarPontuacao();
    }, 600);
}

function addMessageToChat(chatElement, message, type) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `chat-message ${type}`;
    messageDiv.innerHTML = message;
    messageDiv.style.animation = "fadeInUp 0.3s ease";
    chatElement.appendChild(messageDiv);
    chatElement.scrollTop = chatElement.scrollHeight;
}

function getSmartResponse(pergunta) {
    const q = pergunta.toLowerCase();
    
    const respostas = {
        // Água
        agua: "💧 Dica de economia de água: utilize irrigação por gotejamento, capture água da chuva e faça mulching no solo. Redução de até 40% no consumo!",
        
        // Solo
        solo: "🌱 Cuide do solo com rotação de culturas, plantio direto e adubação verde. Solo saudável = plantas mais fortes!",
        
        // Sustentabilidade
        sustentabilidade: "♻️ Para ser mais sustentável: reduza o uso de químicos, faça compostagem, utilize energia solar e preserve matas ciliares.",
        
        // Pragas
        praga: "🐛 Controle biológico é a melhor opção! Joaninhas, crisopas e fungos benéficos ajudam sem prejudicar o meio ambiente.",
        
        // Irrigação
        irrigacao: "💦 A irrigação ideal depende da cultura. Gotejamento é o mais eficiente, seguido por aspersão. Evite irrigação por inundação!",
        
        // Clima
        clima: "🌤️ Monitore a previsão do tempo. Em dias quentes, irrigue de manhã cedo ou à noite para evitar evaporação.",
        
        // Colheita
        colheita: "🌾 A melhor época de colheita varia por cultura. Monitore o desenvolvimento e faça testes de maturação.",
        
        // Orgânico
        organico: "🌿 Agricultura orgânica exige planejamento, compostagem e controle biológico. Composteira e bokashi são ótimos fertilizantes!",
        
        // Default
        default: "🌱 Posso ajudar com: água, solo, sustentabilidade, pragas, irrigação, clima ou colheita. O que você gostaria de saber?"
    };
    
    // Verifica palavras-chave
    if (q.includes("água") || q.includes("agua") || q.includes("economia")) return respostas.agua;
    if (q.includes("solo") || q.includes("terra")) return respostas.solo;
    if (q.includes("sustentabilidade") || q.includes("ecológico")) return respostas.sustentabilidade;
    if (q.includes("praga") || q.includes("inseto") || q.includes("doença")) return respostas.praga;
    if (q.includes("irrigação") || q.includes("irrigacao")) return respostas.irrigacao;
    if (q.includes("clima") || q.includes("chuva") || q.includes("temperatura")) return respostas.clima;
    if (q.includes("colheita") || q.includes("plantio")) return respostas.colheita;
    if (q.includes("orgânico") || q.includes("organico") || q.includes("natural")) return respostas.organico;
    
    return respostas.default;
}

// ============================================
// FUNÇÃO PARA ENVIAR POR ENTER
// ============================================

function setupChatEnterKey() {
    const input = document.getElementById("userInput");
    if (input) {
        input.addEventListener("keypress", function(e) {
            if (e.key === "Enter") {
                e.preventDefault();
                sendMessage();
            }
        });
    }
}

// ============================================
// FUNÇÕES DE INICIALIZAÇÃO
// ============================================

function carregarPontuacaoSalva() {
    const savedPoints = localStorage.getItem("ecoPoints");
    if (savedPoints !== null) {
        ecoPoints = parseInt(savedPoints);
        atualizarPontuacao();
    }
}

function verificarElementosObrigatorios() {
    const elementosNecessarios = [
        "agua", "temperatura", "umidade", "chuva", "resultado",
        "simChuva", "simCalor", "simUmidade", "resultadoSimulador",
        "userInput", "chatWindow", "ecoPoints"
    ];
    
    const faltando = [];
    elementosNecessarios.forEach(id => {
        if (!document.getElementById(id)) {
            faltando.push(id);
        }
    });
    
    if (faltando.length > 0) {
        console.warn("Elementos faltando:", faltando);
    }
}

function adicionarEstilosAnimacao() {
    if (!document.querySelector("#customAnimations")) {
        const style = document.createElement("style");
        style.id = "customAnimations";
        style.textContent = `
            @keyframes slideInRight {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideOutRight {
                from { transform: translateX(0); opacity: 1; }
                to { transform: translateX(100%); opacity: 0; }
            }
            @keyframes bounce {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.2); }
            }
            @keyframes pulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.02); }
                100% { transform: scale(1); }
            }
            .toast-notification {
                animation: slideInRight 0.3s ease;
                background: linear-gradient(135deg, #0a8f4d, #06723d);
                color: white;
                padding: 12px 20px;
                border-radius: 12px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                font-family: inherit;
                z-index: 10000;
            }
            .toast-notification.error {
                background: linear-gradient(135deg, #d32f2f, #b71c1c);
            }
            .toast-notification.success {
                background: linear-gradient(135deg, #388e3c, #2e7d32);
            }
            .good-value {
                color: #4caf50;
                font-weight: bold;
            }
            .warning-value {
                color: #ff9800;
                font-weight: bold;
            }
            .danger-value {
                color: #f44336;
                font-weight: bold;
            }
        `;
        document.head.appendChild(style);
    }
}

// ============================================
// LOADER E INICIALIZAÇÃO
// ============================================

window.onload = () => {
    // Esconde loader
    const loader = document.getElementById("loader");
    if (loader) {
        setTimeout(() => {
            loader.style.display = "none";
        }, 1500);
    }
    
    // Carrega pontuação salva
    carregarPontuacaoSalva();
    
    // Verifica elementos
    verificarElementosObrigatorios();
    
    // Adiciona estilos de animação
    adicionarEstilosAnimacao();
    
    // Configura chat
    setupChatEnterKey();
    
    // Inicializa dashboard
    atualizarPontuacao();
    atualizarDashboard();
    
    // Adiciona mensagem de boas-vindas no chat
    const chat = document.getElementById("chatWindow");
    if (chat && chat.children.length === 0) {
        addMessageToChat(chat, "🤖 AgroVision IA: Olá! 🌱 Sou seu assistente virtual. Pergunte-me sobre sustentabilidade, água, solo ou práticas ecológicas!", "bot");
    }
    
    // Adiciona event listeners para inputs (atualização em tempo real)
    const inputs = ["agua", "temperatura", "umidade", "chuva"];
    inputs.forEach(id => {
        const input = document.getElementById(id);
        if (input) {
            input.addEventListener("input", () => atualizarDashboard());
        }
    });
    
    console.log("✅ AgroVision IA iniciado com sucesso!");
}