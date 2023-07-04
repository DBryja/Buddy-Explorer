// !!!!!!!!!!!!!!
// the container must be built in the following way:
/* 
<div id="cities_Searchbars">  -> big container
  <p class="error sb_start"></p> -> first element, it can be an empty span, but it must exist
    <div class="autocomplete_box"> -> input container. Holding input field, delete button and suggestions container
        <input type="text" class="city_autocomplete city" placeholder="city" name="city" autocomplete="off">
        <button class="item_delete prevent">Usuń</button> -> free of choice element, may be a div, button or anything else
        <div class="cities_container"></div>  ->
    </div>
</div> 
*/
/* <div id="cities_Searchbars">  -> big container
  <p class="error sb_start"></p> -> first element, it can be an empty span, but it must exist
  <div class="autocomplete_box"> -> input container. Holding input field, delete button and suggestions container
    <div>
      <input type="text" class="city_autocomplete city" placeholder="city" name="city" autocomplete="off">
      <button class="item_delete prevent">Usuń</button> -> free of choice element, may be a div, button or anything else
    </div>
    <div class="cities_container"></div>  ->
  </div>
</div>  */

// !!!!!!!!!!!!!!
const updateTracker = (input) => {
  const trackerButton = document.querySelector(`.tracker--circle[data-number="${input.dataset.number}"]`);
  trackerButton.classList.remove("filled");
  trackerButton.classList.add("empty");
};

const inputTracking = (group, input) => {
  input.dataset.listener = "true";
  input.addEventListener("input", () => {
    let check = false;
    group.forEach((input) => {
      check = input.value ? true : false;
    });
    const trackerButton = document.querySelector(`.tracker--circle[data-number="${input.dataset.number}"]`);
    if (check == true) {
      trackerButton.classList.add("filled");
    } else {
      trackerButton.classList.remove("filled");
      trackerButton.classList.add("empty");
    }
  });
};

const addTrackingListener = (inputs, selector) => {
  if (inputs !== false && selector !== false) {
    updateTracker(inputs[0]);

    inputs = document.querySelectorAll(selector);
    inputs.forEach((input) => {
      if (input.dataset.listener !== "true") {
        inputTracking(inputs, input);
      }
    });
  }
};

function ifNoListener(item, type, fun, attr) {
  if (item.getAttribute(attr) !== "true") {
    item.addEventListener(type, fun);
    item.setAttribute(attr, "true");
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
const shake = [{ rotate: "0deg" }, { rotate: "-2deg" }, { rotate: "2deg" }, { rotate: "0deg" }];

function addCountyListener(inputs = false, selector = false) {
  document.querySelector(".county_add").addEventListener("click", (e) => {
    e.preventDefault();
    const qs = document.querySelector("#counties_Searchbars");
    if (qs.childElementCount > 3) {
      e.target.animate(shake, { duration: 500, iterations: 1 });
      return;
    }
    const lastItem = Array.from(document.querySelectorAll("#counties_Searchbars .autocomplete_box")).pop();
    if (lastItem.firstElementChild.value) {
      const acBox = document.createElement("div");
      acBox.classList.add("autocomplete_box");
      acBox.classList.add("autocomplete_box--icon");
      acBox.innerHTML = `
      <input
        type="text"
        class="county_autocomplete county input input--lb-title"
        placeholder="powiat"
        name="county"
        autocomplete="off"
        data-number="1"
      />
      <div class="item_delete prevent trash-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            class="trashcan-hood"
            d="M9.25 3C9.25 2.80109 9.32902 2.61032 9.46967 2.46967C9.61032 2.32902 9.80109 2.25 10 2.25H14C14.1989 2.25 14.3897 2.32902 14.5303 2.46967C14.671 2.61032 14.75 2.80109 14.75 3V3.75H19C19.1989 3.75 19.3897 3.82902 19.5303 3.96967C19.671 4.11032 19.75 4.30109 19.75 4.5C19.75 4.69891 19.671 4.88968 19.5303 5.03033C19.3897 5.17098 19.1989 5.25 19 5.25H5C4.80109 5.25 4.61032 5.17098 4.46967 5.03033C4.32902 4.88968 4.25 4.69891 4.25 4.5C4.25 4.30109 4.32902 4.11032 4.46967 3.96967C4.61032 3.82902 4.80109 3.75 5 3.75H9.25V3Z"
            fill="#3f825e"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.24009 7.945C6.25363 7.82266 6.31182 7.70961 6.40353 7.6275C6.49523 7.54539 6.614 7.49999 6.73709 7.5H17.2631C17.3862 7.49999 17.5049 7.54539 17.5967 7.6275C17.6884 7.70961 17.7465 7.82266 17.7601 7.945L17.9601 9.746C18.3211 12.993 18.3211 16.27 17.9601 19.517L17.9401 19.694C17.8761 20.2687 17.6226 20.8058 17.2195 21.2205C16.8165 21.6352 16.2868 21.9038 15.7141 21.984C13.2501 22.3289 10.7501 22.3289 8.28609 21.984C7.71321 21.904 7.1833 21.6355 6.78002 21.2208C6.37675 20.8061 6.12309 20.2689 6.05909 19.694L6.03909 19.517C5.67838 16.2703 5.67838 12.9937 6.03909 9.747L6.24009 7.945ZM10.7501 11.4C10.7501 11.2011 10.6711 11.0103 10.5304 10.8697C10.3898 10.729 10.199 10.65 10.0001 10.65C9.80118 10.65 9.61041 10.729 9.46976 10.8697C9.32911 11.0103 9.25009 11.2011 9.25009 11.4V18.4C9.25009 18.5989 9.32911 18.7897 9.46976 18.9303C9.61041 19.071 9.80118 19.15 10.0001 19.15C10.199 19.15 10.3898 19.071 10.5304 18.9303C10.6711 18.7897 10.7501 18.5989 10.7501 18.4V11.4ZM14.7501 11.4C14.7501 11.2011 14.6711 11.0103 14.5304 10.8697C14.3898 10.729 14.199 10.65 14.0001 10.65C13.8012 10.65 13.6104 10.729 13.4698 10.8697C13.3291 11.0103 13.2501 11.2011 13.2501 11.4V18.4C13.2501 18.5989 13.3291 18.7897 13.4698 18.9303C13.6104 19.071 13.8012 19.15 14.0001 19.15C14.199 19.15 14.3898 19.071 14.5304 18.9303C14.6711 18.7897 14.7501 18.5989 14.7501 18.4V11.4Z"
            fill="#3f825e"
          />
        </svg>
      </div>
      <div class="counties_container ac_container"></div>
    `;
      qs.appendChild(acBox);
      countiesSearchbars = document.querySelectorAll(".county_autocomplete");

      if (inputs !== false && selector !== false) {
        addTrackingListener(inputs, selector);
      }
      removeItemListener();
      SearchbarsForeach(countiesSearchbars, "counties");
    }
  });
}
// add another city
function addCityListener(inputs = false, selector = false) {
  document.querySelector(".city_add").addEventListener("click", (e) => {
    e.preventDefault();
    const qs = document.querySelector("#cities_Searchbars");
    console.log(qs.childElementCount);
    if (qs.childElementCount > 4) {
      e.target.animate(shake, { duration: 500, iterations: 1 });
      return;
    }
    const lastItem = qs.lastElementChild;
    if (lastItem.firstElementChild.value) {
      const acBox = document.createElement("div");
      acBox.classList.add("autocomplete_box");
      acBox.classList.add("autocomplete_box--icon");
      acBox.innerHTML = `
      <input
        type="text"
        class="city_autocomplete city input input--lb-title"
        placeholder="miejscowość"
        name="city"
        autocomplete="off"
        data-number="2"
      />
      <div class="item_delete prevent trash-icon">
        <svg viewBox="0 0 24 24" fill="none">
          <path
            class="trashcan-hood"
            d="M9.25 3C9.25 2.80109 9.32902 2.61032 9.46967 2.46967C9.61032 2.32902 9.80109 2.25 10 2.25H14C14.1989 2.25 14.3897 2.32902 14.5303 2.46967C14.671 2.61032 14.75 2.80109 14.75 3V3.75H19C19.1989 3.75 19.3897 3.82902 19.5303 3.96967C19.671 4.11032 19.75 4.30109 19.75 4.5C19.75 4.69891 19.671 4.88968 19.5303 5.03033C19.3897 5.17098 19.1989 5.25 19 5.25H5C4.80109 5.25 4.61032 5.17098 4.46967 5.03033C4.32902 4.88968 4.25 4.69891 4.25 4.5C4.25 4.30109 4.32902 4.11032 4.46967 3.96967C4.61032 3.82902 4.80109 3.75 5 3.75H9.25V3Z"
            fill="#3f825e"
          />
          <path
            fill-rule="evenodd"
            clip-rule="evenodd"
            d="M6.24009 7.945C6.25363 7.82266 6.31182 7.70961 6.40353 7.6275C6.49523 7.54539 6.614 7.49999 6.73709 7.5H17.2631C17.3862 7.49999 17.5049 7.54539 17.5967 7.6275C17.6884 7.70961 17.7465 7.82266 17.7601 7.945L17.9601 9.746C18.3211 12.993 18.3211 16.27 17.9601 19.517L17.9401 19.694C17.8761 20.2687 17.6226 20.8058 17.2195 21.2205C16.8165 21.6352 16.2868 21.9038 15.7141 21.984C13.2501 22.3289 10.7501 22.3289 8.28609 21.984C7.71321 21.904 7.1833 21.6355 6.78002 21.2208C6.37675 20.8061 6.12309 20.2689 6.05909 19.694L6.03909 19.517C5.67838 16.2703 5.67838 12.9937 6.03909 9.747L6.24009 7.945ZM10.7501 11.4C10.7501 11.2011 10.6711 11.0103 10.5304 10.8697C10.3898 10.729 10.199 10.65 10.0001 10.65C9.80118 10.65 9.61041 10.729 9.46976 10.8697C9.32911 11.0103 9.25009 11.2011 9.25009 11.4V18.4C9.25009 18.5989 9.32911 18.7897 9.46976 18.9303C9.61041 19.071 9.80118 19.15 10.0001 19.15C10.199 19.15 10.3898 19.071 10.5304 18.9303C10.6711 18.7897 10.7501 18.5989 10.7501 18.4V11.4ZM14.7501 11.4C14.7501 11.2011 14.6711 11.0103 14.5304 10.8697C14.3898 10.729 14.199 10.65 14.0001 10.65C13.8012 10.65 13.6104 10.729 13.4698 10.8697C13.3291 11.0103 13.2501 11.2011 13.2501 11.4V18.4C13.2501 18.5989 13.3291 18.7897 13.4698 18.9303C13.6104 19.071 13.8012 19.15 14.0001 19.15C14.199 19.15 14.3898 19.071 14.5304 18.9303C14.6711 18.7897 14.7501 18.5989 14.7501 18.4V11.4Z"
            fill="#3f825e"
          />
        </svg>
      </div>
      <div class="cities_container ac_container"></div>
    `;
      qs.appendChild(acBox);
      citiesSearchbars = document.querySelectorAll(".city_autocomplete");
      // used for form progress tracker
      if (inputs !== false && selector !== false) {
        addTrackingListener(inputs, selector);
      }
      //
      removeItemListener();
      SearchbarsForeach(citiesSearchbars, "cities");
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
            searchBox.classList.remove("active");
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
      const text = e.target.value;
      const block = e.target.parentElement.lastElementChild;
      if (text.length > 1) {
        block.textContent = "";
        block.classList.add("active");
        autocompleteSearch(type, block, text);
      }
      if (text.length < 2) {
        block.textContent = "";
        block.classList.remove("active");
      }
    }, 400);
  };

  group.forEach((item) => {
    ifNoListener(item, "input", runSearch, "inputListener");
  });
}

function getAbsoluteHeight(el) {
  el = typeof el === "string" ? document.querySelector(el) : el;

  var styles = window.getComputedStyle(el);
  var margin = parseFloat(styles["marginTop"]) + parseFloat(styles["marginBottom"]);

  return Math.ceil(el.offsetHeight + margin);
}

function addToClipboard(e) {
  navigator.clipboard.writeText(e.target.textContent);
}

function showPassword(e) {
  const atr = e.target.getAttribute("blockid");
  const passwordField = document.querySelector(`.password[blockid="${atr}"`);
  if (passwordField.type === "password") passwordField.type = "text";
  else if (passwordField.type === "text") passwordField.type = "password";
  e.target.classList.toggle("active");
}
