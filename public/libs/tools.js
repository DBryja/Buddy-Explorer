// !!!!!!!!!!!!!!
// the container must be built in the following way:
/* 
<div id="cities_Searchbars">  -> big container
  <p class="error sb_start"></p> -> first element, it can be an empty span, but it must exist
    <div class="autocomplete_box"> -> input container. Holding input field, delete button and suggestions container
        <input type="text" class="city_autocomplete city" placeholder="city" name="city" autocomplete="off">
        <button class="item_delete prevent">Usuń</button>
        <div class="cities_container"></div>
    </div>
</div> 
*/
// !!!!!!!!!!!!!!
function ifNoListener(item, type, fun) {
  if (item.getAttribute("listener") !== "true") {
    item.addEventListener(type, fun);
    item.setAttribute("listener", "true");
  }
}
function removeItemListener() {
  const removeItem = (e) => {
    e.preventDefault();
    if (e.target.parentElement.parentElement.childElementCount > 2) {
      e.target.parentElement.remove();
    }
  };
  document.querySelectorAll(".item_delete").forEach((item) => ifNoListener(item, "click", removeItem));
}
// add another county
function addCountyListener() {
  document.querySelector(".county_add").addEventListener("click", (e) => {
    e.preventDefault();
    const qs = document.querySelector("#counties_Searchbars");
    const lastItem = qs.lastElementChild;
    if (lastItem.firstElementChild.value) {
      const acBox = document.createElement("div");
      acBox.classList.add("autocomplete_box");
      acBox.innerHTML = `
    <input type="text" class="county_autocomplete county" placeholder="powiat" name="county" autocomplete="off"/>
    <button class="item_delete prevent">Usuń</button>
    <div class="counties_container"></div>
    `;
      qs.appendChild(acBox);
      removeItemListener();
      countiesSearchbars = document.querySelectorAll(".county_autocomplete");
      SearchbarsForeach(countiesSearchbars, "counties");
    }
  });
}
// add another city
function addCityListener() {
  document.querySelector(".city_add").addEventListener("click", (e) => {
    e.preventDefault();
    const qs = document.querySelector("#cities_Searchbars");
    const lastItem = qs.lastElementChild;
    if (lastItem.firstElementChild.value) {
      const acBox = document.createElement("div");
      acBox.classList.add("autocomplete_box");
      acBox.innerHTML = `
    <input type="text" class="city_autocomplete city" placeholder="miejscowość" name="city" autocomplete="off"/>
    <button class="item_delete prevent">Usuń</button>
    <div class="cities_container"></div>
    `;
      qs.appendChild(acBox);
      citiesSearchbars = document.querySelectorAll(".city_autocomplete");
      SearchbarsForeach(citiesSearchbars, "cities");
      removeItemListener();
    }
  });
}

function autocompleteSearch(type, searchBox, query = "") {
  fetch(`/get_${type}?${type}=${query}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (responseData) {
      if (responseData.length > 0) {
        let arr = [];
        responseData.forEach((item) => {
          arr.push(item);
        });
        arr = [...new Set(arr)];
        searchBox.textContent = "";
        arr.forEach((item) => {
          const row = document.createElement("p");
          row.classList.add("autocomplete_item");
          row.textContent = item;
          searchBox.appendChild(row);
          row.addEventListener("click", (e) => {
            const acBox = e.target.parentElement.previousElementSibling.previousElementSibling;
            acBox.value = e.target.textContent;
            searchBox.textContent = "";
          });
        });
      }
    });
}
function SearchbarsForeach(group, type) {
  let countdown;
  const runSearch = (e) => {
    clearTimeout(countdown);
    countdown = setTimeout(() => {
      if (e.target.value.length > 1) {
        const text = e.target.value;
        const block = e.target.nextElementSibling.nextElementSibling;
        block.textContent = "";
        autocompleteSearch(type, block, text);
      }
      if (e.target.value.length < 2) {
        e.target.nextElementSibling.nextElementSibling.textContent = "";
      }
    }, 400);
  };

  group.forEach((item) => ifNoListener(item, "input", runSearch));
}
