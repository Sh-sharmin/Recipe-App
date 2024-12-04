const getCategories = async () => {
    const response = await fetch("https://www.themealdb.com/api/json/v1/1/categories.php");
    const data = await response.json();
    const container = document.querySelector("#categoriesContainer");
    const h2 = document.createElement("h2");
    h2.classList.add("text-center", "mb-3");
    h2.innerText = "CATAGORIES..."
    container.appendChild(h2);
    data.categories.forEach(category => {
        const div = document.createElement("div");
        div.classList.add("col-3", "mb-4");
        div.innerHTML = `
                <div class="card h-100">
                    <img class="card-img-top cat-img" src="${category.strCategoryThumb}" alt="${category.strCategory}">
                    <div class="card-body">
                        <h4 class="card-title">${category.strCategory}</h4>
                        <p class="card-text">${category.strCategoryDescription.slice(0, 50)}...</p>
                    </div>
                </div>
            `;
        container.appendChild(div);
    });
};

getCategories();

document.getElementById("SearchBtn").addEventListener("click", () => {
    const inputValue = document.getElementById("SearchBar").value;
    getRecipes(inputValue);
});

const getRecipes = async (inputValue) => {
    const container = document.querySelector("#categoriesContainer");
    container.innerHTML = "";


        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${inputValue}`);
        const data = await response.json();

        if (!data.meals) {
            container.innerHTML = `<p class="text-danger text-center">No recipes found for "${inputValue}". Try again!</p>`;
            return;
        }

        const recipesDiv = document.createElement("div");
        recipesDiv.classList.add("col-8", "row", "p-3");

        const cartDiv = document.createElement("div");
        cartDiv.classList.add("col-4", "p-3");

        cartDiv.innerHTML = `<h4>Selected Recipes</h4>
                             <hr>
                            <ul id="cartList"></ul>`;

        container.appendChild(recipesDiv);
        container.appendChild(cartDiv);

        data.meals.forEach((meal) => {
            const card = document.createElement("div");
            card.classList.add("card", "col-4", "m-2");
            card.style.width = "18rem";

            card.innerHTML = `
                <img src="${meal.strMealThumb}" class="card-img-top" alt="${meal.strMeal}">
                <div class="card-body">
                    <h5 class="card-title">${meal.strMeal}</h5>
                    <p class="card-text">${meal.strInstructions.substring(0, 100)}...</p>
                    <button class="btn btn-warning selectBtn" data-name="${meal.strMeal}" data-img="${meal.strMealThumb}">Select</button>
                    <button class="btn btn-info detailsBtn" data-id="${meal.idMeal}" data-bs-toggle="modal" data-bs-target="#detailsModal">Details</button>
                </div>
            `;
            recipesDiv.appendChild(card);
        });

        const selectButtons = document.querySelectorAll(".selectBtn");
        selectButtons.forEach((button) =>
            button.addEventListener("click", (event) => {
                const recipeName = event.target.getAttribute("data-name");
                const recipeImg = event.target.getAttribute("data-img");
                addToCart(recipeName, recipeImg);
            })
        );

        const detailsButtons = document.querySelectorAll(".detailsBtn");
        detailsButtons.forEach((button) =>
            button.addEventListener("click", async (event) => {
                const recipeId = event.target.getAttribute("data-id");
                await showDetails(recipeId);
            })
        );
};

const addToCart = (recipeName, recipeImg) => {
    const cartList = document.getElementById("cartList");

    // Check if the recipe is already in the cart
    const existingItem = Array.from(cartList.children).find(
        (item) => item.dataset.name === recipeName
    );
    if (existingItem) {
        alert("This recipe is already in the cart! 😊");
        return;
    }

    // Add the recipe to the cart
    const listItem = document.createElement("li");
    listItem.classList.add("d-flex", "align-items-center", "mb-2");
    listItem.dataset.name = recipeName;

    listItem.innerHTML = `
        <img src="${recipeImg}" alt="${recipeName}" style="width: 60px; height: 50px; object-fit: cover; margin-right: 10px;">
        <span>${recipeName}</span>
        <button class="btn btn-danger btn-sm ms-auto removeBtn">Remove</button>
    `;

    cartList.appendChild(listItem);
    updateCartCount(); // Update the total count of selected recipes

    // Add remove functionality
    listItem.querySelector(".removeBtn").addEventListener("click", () => {
        listItem.remove();
        updateCartCount(); // Recalculate cart count after removal
    });
};

// Function to update the cart count dynamically
const updateCartCount = () => {
    const cartList = document.getElementById("cartList");
    const count = cartList.children.length; // Get the number of items in the cart
    const cartHeader = document.querySelector(".col-4 h4");

    // Update the total count display
    cartHeader.innerText = `Selected Recipes (${count})`;
};


const showDetails = async (recipeId) => {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${recipeId}`);
        const data = await response.json();

        if (data.meals) {
            const meal = data.meals[0];
            document.getElementById("modalTitle").innerText = meal.strMeal;
            document.getElementById("modalBody").innerHTML = `
                <div class="text-center mb-3">
        <img src="${meal.strMealThumb}" class="img-fluid" style="width: 350px;" alt="${meal.strMeal}">
    </div>
                <p><strong>Category:</strong> ${meal.strCategory}</p>
                <p><strong>Area:</strong> ${meal.strArea}</p>
                <p><strong>Instructions:</strong> ${meal.strInstructions}</p>
            `;
        }
};