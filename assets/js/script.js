async function handleSubmit(event) {
    event.preventDefault();
    let inputValue = document.querySelector(".js-search-input").value;
    let searchQuery = inputValue.trim();

    let searchResults = document.querySelector(".js-search-results");
    searchResults.innerHTML = '';

    let spinner = document.querySelector('.js-spinner');
    spinner.classList.remove('hidden');

    try {
        let results = await searchWikipedia(searchQuery);
        if (results.query.searchinfo.totalhits === 0) {
            alert('No results found. Try different keywords');
            return;
        }

        displayResults(results);
    }
    finally {
        spinner.classList.add('hidden');
    }
}

async function searchWikipedia(searchQuery) {
    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&list=search&prop=info&inprop=url&utf8=&format=json&origin=*&srlimit=20&srsearch=${searchQuery}`;
    const response = await fetch(endpoint);
    if (!response.ok) {
      throw Error(response.statusText);
    }
    const json = await response.json();
    return json;
}

function displayResults(results) {
        let searchResults = document.querySelector('.js-search-results');

        results.query.search.forEach(result => {
            let url = `https://en.wikipedia.org/?curid=${result.pageid}`;
            searchResults.insertAdjacentHTML('beforeend', `<div class="result-item"><h3 class="result-title"><a href="${url}" target="_blank" rel="noopener">${result.title}</a></h3><span class="result-snippet">${result.snippet}</span><br></div>`)
        })
}



    let form = document.querySelector('.js-search-form');
    form.addEventListener('submit', handleSubmit);