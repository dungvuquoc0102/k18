document.querySelector("#app").innerHTML = `Hello F8!`;

const apiUrl = import.meta.env.API_URL;
fetch(apiUrl)
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  });
