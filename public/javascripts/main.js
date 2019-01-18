window.onload = () => {
    loadItems((res) => {
        displayItems(JSON.parse(res).data.items);
    }, () => {
        alert("Couldn't load shop items");
    });

    document.querySelector(".currency").onchange = (event) => {
        var newCurrency = event.target.options[event.target.selectedIndex].value;
        updateCurrencies(newCurrency, (res) => {
            displayNewCurrencies(JSON.parse(res).data.items);
        }, () => {
            alert("Sorry, currency changing is not available");
        });
    }
}

function loadItems(onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:3000/graphql', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({
        "operationName": null,
        "query": `{
            items {
                id
                title
                description
                image
                price
                currency
            }
        }`,
        "variables": {}
    }));
    
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            onSuccess(xhr.responseText);
        } else if (this.readyState == 4 && this.status != 200) {
            onError();
        }
    }
}

function updateCurrencies(currency, onSuccess, onError) {
    var xhr = new XMLHttpRequest();

    xhr.open('POST', 'http://localhost:3000/graphql', true);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.send(JSON.stringify({
        "operationName": null,
        "query": `{
            items(currency: "`+currency+`") {
                id
                price
                currency
            }
        }`,
        "variables": {}
    }));

    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            onSuccess(xhr.responseText);
        } else if (this.readyState == 4 && this.status != 200) {
            onError();
        }
    }
}

function displayNewCurrencies(items) {
    var itemElements = document.getElementsByClassName("col");
    for (var i = 0; i < itemElements.length; i++) {
        var id = itemElements[i].getAttribute("data-id");
        var item = items.find(function(el) {return el.id == id});

        if (item === undefined) {
            itemElements[i].style.display = "none";
            continue;
        }
        
        var priceElement = itemElements[i].querySelector(".price");
        priceElement.innerHTML = item.price.toFixed(2) + " " + item.currency;
    }
}

function displayItems(items) {
    var containerItems = document.querySelector(".container");
    for (var i = 0; i < items.length; i++) {
        var row = document.createElement("div");
        row.className = "row";

        var col = document.createElement("div");
        col.className = "col";
        col.setAttribute("data-id", items[i].id);

        var img = document.createElement("img");
        img.setAttribute("src", items[i].image);
        img.className = "float-left d-block";

        var title = document.createElement("h3");
        title.innerHTML = items[i].title;
        
        var description = document.createElement("p");
        description.innerHTML = items[i].description;
        
        var price = document.createElement("h2");
        price.innerHTML = items[i].price.toFixed(2) + ' ' + items[i].currency.toLowerCase();
        price.className = "float-right price";
        
        row.appendChild(col)
        col.appendChild(img);
        col.appendChild(title);
        col.appendChild(description);
        col.appendChild(price);
        
        containerItems.appendChild(row);
    }
}