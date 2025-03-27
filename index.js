const container = document.querySelector('.container')


container.addEventListener('click', event => {
    if (event.target.className === 'close') {
        event.target.parentElement.remove()
    }
})

document.querySelector('.search').oninput = event => {
    getRepositoriesFn(event.target.value)
}

document.querySelector('.search-results').onclick = event => {
    if (event.target.className === 'search-item') {
        createDiv(event.target.data)
        document.querySelectorAll('.search-item').forEach(elem => elem.remove())
        document.querySelector('.search').value = ''
    }
}

function getRepositories(value) {
    if (value === '') {
        document.querySelectorAll('.search-item').forEach(elem => elem.remove())
        return
    }

    fetch(`https://api.github.com/search/repositories?q=${value}&per_page=5`)
        .then(data => data.json())
        .then(data => data.items.map(item => {
            return {
                name: item.name,
                owner: item.owner.login,
                stars: item.stargazers_count
            }
        }))
        .then(items => {
            document.querySelectorAll('.search-item').forEach(elem => elem.remove())
            const ul = document.querySelector('.search-results')
            items.forEach((item) => {
                const infoItem = document.createElement('li')
                infoItem.classList.add('search-item')
                infoItem.textContent = item.name
                infoItem.data = item
                ul.appendChild(infoItem)
            })
        })
}


function createDiv(obj) {
    const fragment = document.createDocumentFragment()

    const card = document.createElement('div');
    card.classList.add('card')
    fragment.appendChild(card)

    const close = document.createElement('a')
    close.classList.add('close')
    close.id = 'close-btn'
    card.appendChild(close)

    const p = document.createElement('p')
    p.classList.add('card-name')
    p.textContent = `name: ${obj.name}`
    card.appendChild(p)

    const p1 = document.createElement('p')
    p1.classList.add('card-owner')
    p1.textContent = `owner: ${obj.owner}`
    card.appendChild(p1)

    const p2 = document.createElement('p')
    p2.classList.add('card-stars')
    p2.textContent = `stars: ${obj.stars}`
    card.appendChild(p2)

    container.appendChild(fragment)
}

const debounce = (fn, timeMs) => {
    let timeout;
    return function (value) {
        const fnCall = () => {
            fn.call(this, value)
        }
        clearTimeout(timeout);
        timeout = setTimeout(fnCall, timeMs)
    }
};
const getRepositoriesFn = debounce(getRepositories, 650)
