let produtos = []
let carrinho = []

fetch("../js/produtos.json")
  .then(res => res.json())
  .then(data => {
    produtos = data
    const categoriaInicial = getCategoriaURL()
    marcarCategoriaInicial(categoriaInicial)
    aplicarFiltros()
  })

function adicionarAoCarrinho(prod) {
  const itemExistente = carrinho.find(item => item.id === prod.id)

  if (itemExistente) {
    itemExistente.quantidade++
  } else {
    carrinho.push({
      id: prod.id,
      nome: prod.nome,
      preco: prod.preco,
      quantidade: 1
    })
  }
}
  
function renderizarProdutos(lista) {
  const container = document.getElementById("produtos-container")

  container.innerHTML = ""

  lista.forEach(prod => {
    const card = document.createElement("div")
    card.classList.add("card")

    card.innerHTML = `
      <img src="${prod.imagem}" class="card-img-top" alt="${prod.nome}">
      <div class="card-body">
        <h5 class="card-title">${prod.nome}</h5>
        <p>R$ ${prod.preco.toFixed(2)}</p>
        <button class="btn btn-outline-dark btn-detalhes">Ver detalhes</button>
        <button class="btn btn-success btn-carrinho">Adicionar ao carrinho</button>
      </div>
    `
    card.querySelector('.btn-detalhes').addEventListener('click', () => {
        abrirModal(prod)
    })

    container.appendChild(card)
  })
}

function abrirModal(prod){

  document.getElementById('modalImagem').src = prod.imagem
  document.getElementById('modalTitulo').textContent = prod.nome_desc
  document.getElementById('modalDescricao').textContent = prod.descricao
  document.getElementById('modalPreco').textContent = prod.preco.toFixed(2)

  const modal = new bootstrap.Modal(document.getElementById('modalProduto'))
  modal.show()
}

function aplicarFiltros() {
  const precoMin = parseFloat(document.getElementById('precoMin').value) || 0
  const precoMax = parseFloat(document.getElementById('precoMax').value) || Infinity

  const categoriaSelecionada = document.querySelector('#filtroCategoria .ativo')?.dataset.categoria || 'todos'

  let filtrados = produtos.filter(prod => {
    const dentroPreco = prod.preco >= precoMin && prod.preco <= precoMax
    const dentroCategoria = categoriaSelecionada === 'todos' || prod.categoria === categoriaSelecionada
    return dentroPreco && dentroCategoria
  })

  renderizarProdutos(filtrados)
}

document.querySelectorAll('#filtroCategoria li').forEach(item => {
    item.addEventListener('click', () => {
        document.querySelectorAll('#filtroCategoria li').forEach(li => li.classList.remove('ativo'))
        item.classList.add('ativo')

        aplicarFiltros()
    })
  })

document.getElementById('precoMin').addEventListener('input', aplicarFiltros)
document.getElementById('precoMax').addEventListener('input', aplicarFiltros)

function limpa() {
  document.getElementById('precoMin').value = ''
  document.getElementById('precoMax').value = ''

  document.querySelectorAll('#filtroCategoria li').forEach(li => li.classList.remove('ativo'))

  const todos = document.querySelector('[data-categoria="todos"]')
  if (todos) todos.classList.add('ativo')

  renderizarProdutos(produtos)
}

function getCategoriaURL() {
  const params = new URLSearchParams(window.location.search)
  return params.get('categoria') || 'todos'
}

function marcarCategoriaInicial(categoria) {
  document.querySelectorAll('#filtroCategoria li')
    .forEach(li => li.classList.remove('ativo'))

  const item = document.querySelector(`[data-categoria="${categoria}"]`)
  if (item) item.classList.add('ativo')
}