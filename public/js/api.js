const API = "http://localhost:3000";

const Api = {

  post(endpoint, body) {
    return fetch(`${API}/api/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }).then(res => res.json());
  }

};